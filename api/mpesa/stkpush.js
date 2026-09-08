import { createClient } from "@supabase/supabase-js";

// Server-side only. NEVER prefix these with NEXT_PUBLIC_ / VITE_ /
// anything that would ship them to the browser.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // CHANGED: the frontend now creates the order FIRST (status
    // "pending") and only sends us its id. We fetch the phone and
    // amount from that row ourselves rather than trusting whatever
    // the client sends in the request body — this is what lets the
    // callback later verify against a value the customer never
    // controlled directly.
    const { orderId } = req.body || {};

    if (!orderId) {
      return res.status(400).json({
        error: "orderId is required.",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({
        error: "Supabase server credentials are missing.",
      });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, customer_phone, total, payment_status, verification_status")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) {
      console.error("Order lookup error:", orderError);
      return res.status(500).json({ error: "Could not look up the order." });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (order.payment_status !== "pending") {
      return res.status(400).json({
        error: `This order is already ${order.payment_status}; cannot start a new payment.`,
      });
    }

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!shortcode || !passkey || !callbackUrl) {
      return res.status(500).json({
        error: "M-Pesa STK Push environment variables are missing.",
      });
    }

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({
        error: "M-Pesa OAuth credentials are missing.",
      });
    }

    // Convert Kenyan numbers such as 0712345678 or 0112345678
    // into the international format required by Daraja.
    // (unchanged from the original file)
    let formattedPhone = String(order.customer_phone).replace(/\s+/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    }

    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({
        error: "The order's phone number is not a valid Kenyan number.",
      });
    }

    const numericAmount = Math.round(Number(order.total));

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({
        error: "Order total is not a valid positive amount.",
      });
    }

    // Daraja timestamp format: YYYYMMDDHHMMSS
    const now = new Date();

    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");

    // Call Safaricom OAuth directly (avoid calling our own /api/mpesa/token endpoint)
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const oauthResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const oauthText = await oauthResponse.text();
    let oauthData;
    try {
      oauthData = JSON.parse(oauthText);
    } catch {
      oauthData = { raw: oauthText };
    }

    if (!oauthResponse.ok || !oauthData.access_token) {
      console.error("Safaricom OAuth error:", oauthData);
      return res.status(500).json({
        error: "Could not authenticate with M-Pesa (OAuth failed).",
        details: oauthData.error || oauthData.errorMessage || oauthData.raw || "No access token returned.",
      });
    }

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${oauthData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: numericAmount,
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: "DukaLaStyle",
          TransactionDesc: "DukaLaStyle Payment",
        }),
      }
    );

    const stkText = await stkResponse.text();

    let stkData;

    try {
      stkData = JSON.parse(stkText);
    } catch {
      stkData = {
        raw: stkText,
      };
    }

    if (!stkResponse.ok) {
      console.error("STK Push error:", stkData);

      return res.status(500).json({
        error:
          stkData.errorMessage ||
          stkData.error ||
          "M-Pesa STK Push failed.",
      });
    }

    // NEW: store the identifiers that link this push back to the
    // order, so the callback can find it. This is the crucial piece
    // that was missing before — without it, the callback has no way
    // to know which order a payment belongs to.
    if (stkData.CheckoutRequestID) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          checkout_request_id: stkData.CheckoutRequestID,
          merchant_request_id: stkData.MerchantRequestID || null,
          verification_status: "verifying",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        // The STK push itself succeeded — don't fail the request over
        // this, but log loudly since the callback won't be matchable
        // without it.
        console.error("Failed to store checkout_request_id on order:", updateError);
      }
    }

    return res.status(200).json({ ...stkData, orderId });
  } catch (error) {
    console.error("STK Push function error:", error);

    return res.status(500).json({
      error: error.message || "STK Push request failed.",
    });
  }
}
