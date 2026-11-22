import { createClient } from "@supabase/supabase-js";

// Server-side service-role client. Never expose this key to the browser.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function json(res, status, body) { return res.status(status).json(body); }

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { error: "Supabase server credentials are missing." });
  }

  let createdOrderId = null;
  try {
    const { customerName, customerPhone, items: requestedItems, referralCode } = req.body || {};
    const name = String(customerName || "").trim();
    const phone = String(customerPhone || "").replace(/[\s-]/g, "");
    if (name.length < 2 || name.length > 100) return json(res, 400, { error: "Enter a valid customer name." });
    if (!/^(?:\+?254|0)?[17]\d{8}$/.test(phone)) return json(res, 400, { error: "Enter a valid Kenyan M-Pesa phone number." });
    if (!Array.isArray(requestedItems) || requestedItems.length < 1 || requestedItems.length > 50) {
      return json(res, 400, { error: "Your cart is empty or contains too many items." });
    }

    const quantities = new Map();
    for (const item of requestedItems) {
      const id = item?.id;
      const quantity = Number(item?.quantity);
      if ((typeof id !== "string" && typeof id !== "number") || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return json(res, 400, { error: "One or more cart items are invalid." });
      }
      quantities.set(String(id), (quantities.get(String(id)) || 0) + quantity);
    }

    const productIds = [...quantities.keys()];
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products").select("id, name, price").in("id", productIds);
    if (productsError) {
      console.error("Order product lookup failed:", productsError);
      return json(res, 500, { error: "Could not validate cart products." });
    }
    if (!products || products.length !== productIds.length) return json(res, 400, { error: "A product in your cart is no longer available." });

    const productById = new Map(products.map((p) => [String(p.id), p]));
    const orderItems = productIds.map((id) => {
      const product = productById.get(id);
      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) throw new Error("A product has an invalid price. Please contact the store.");
      return { product_id: product.id, product_name: product.name, quantity: quantities.get(id), price };
    });
    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));

    let referral = null;
    let discount = 0;
    const code = String(referralCode || "").trim().toUpperCase();
    if (code) {
      const { data, error } = await supabaseAdmin.from("referral_codes")
        .select("id, code, owner_name, total_referrals, total_discount_awarded")
        .eq("code", code).eq("active", true).maybeSingle();
      if (error) throw error;
      if (!data) return json(res, 400, { error: "The referral code is invalid." });
      referral = data;
      const { count, error: countError } = await supabaseAdmin.from("referral_events")
        .select("id", { count: "exact", head: true }).eq("referral_code", data.code);
      if (countError) throw countError;
      if (Number(count || 0) >= 3) discount = Number((subtotal * 0.05).toFixed(2));
    }

    const total = Math.max(0, Number((subtotal - discount).toFixed(2)));
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
      customer_name: name, customer_phone: phone, total, subtotal,
      payment_status: "pending", order_status: "new",
      referred_by: referral?.owner_name || null,
      referral_code: referral?.code || null,
      referral_discount: discount,
    }).select("id").single();
    if (orderError) throw orderError;
    createdOrderId = order.id;

    const { error: itemError } = await supabaseAdmin.from("order_items").insert(
      orderItems.map((item) => ({ ...item, order_id: order.id }))
    );
    if (itemError) throw itemError;

    // Preserve the existing referral accounting, but perform it server-side.
    if (referral) {
      const { error: eventError } = await supabaseAdmin.from("referral_events").insert({
        referrer_name: referral.owner_name, referred_customer_name: name,
        referred_customer_phone: phone, order_id: order.id,
        referral_code: referral.code, discount_awarded: discount,
      });
      if (eventError) throw eventError;
      const { error: updateError } = await supabaseAdmin.from("referral_codes").update({
        total_referrals: Number(referral.total_referrals || 0) + 1,
        total_discount_awarded: Number(referral.total_discount_awarded || 0) + discount,
        updated_at: new Date().toISOString(),
      }).eq("id", referral.id);
      if (updateError) throw updateError;
    }

    return json(res, 201, { orderId: order.id, subtotal, discount, total });
  } catch (error) {
    console.error("Create order failed:", error);
    if (createdOrderId) await supabaseAdmin.from("orders").delete().eq("id", createdOrderId);
    return json(res, 500, { error: error.message || "Could not create your order." });
  }
}
