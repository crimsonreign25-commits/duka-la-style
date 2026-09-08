import { createClient } from "@supabase/supabase-js";

// NEW FILE — required for the frontend to find out whether a
// payment has been automatically verified, without needing an RLS
// policy that lets anonymous customers read arbitrary order rows.
// Only the handful of non-sensitive status fields are returned.

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required." });
  }

  try {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, payment_status, verification_status, order_status, mpesa_receipt")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error("Status lookup error:", error);
      return res.status(500).json({ error: "Could not look up order status." });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Status endpoint error:", error);
    return res.status(500).json({ error: "Status request failed." });
  }
}
