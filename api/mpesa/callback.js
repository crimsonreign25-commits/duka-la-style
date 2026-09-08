import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Pulls the CallbackMetadata.Item array (only present when
// ResultCode === 0) into a plain object keyed by Name.
function extractMetadata(stkCallback) {
  const items = stkCallback?.CallbackMetadata?.Item || [];
  const map = {};
  for (const item of items) {
    if (item && item.Name) map[item.Name] = item.Value;
  }
  return {
    amount: map.Amount,
    mpesaReceipt: map.MpesaReceiptNumber,
    transactionDate: map.TransactionDate ? String(map.TransactionDate) : null,
    phoneNumber: map.PhoneNumber ? String(map.PhoneNumber) : null,
  };
}

// Normalizes a Kenyan phone number to 2547XXXXXXXX / 2541XXXXXXXX
// for comparison, regardless of the format either side used.
function normalizePhone(phone) {
  if (!phone) return null;
  let cleaned = String(phone).replace(/\s+/g, "").replace(/^\+/, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.substring(1);
  return cleaned;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // Safaricom needs a fast, well-formed ack or it will retry the
  // callback repeatedly. We always return ResultCode 0 to Safaricom
  // (this just means "we received it", not "the payment is valid") —
  // any real problems are recorded on the order row instead, never
  // surfaced back to Safaricom as an HTTP error.
  const ack = () => res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Callback received successfully",
  });

  try {
    const body = req.body;
    console.log("M-Pesa callback received:", JSON.stringify(body, null, 2));

    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback || !stkCallback.CheckoutRequestID) {
      console.error("Callback missing stkCallback/CheckoutRequestID:", body);
      return ack();
    }

    const {
      ResultCode,
      ResultDesc,
      CheckoutRequestID,
      MerchantRequestID,
    } = stkCallback;

    // 1. Find the order this callback belongs to.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, total, customer_phone, payment_status, verification_status, mpesa_receipt"
      )
      .eq("checkout_request_id", CheckoutRequestID)
      .maybeSingle();

    if (orderError) {
      console.error("Order lookup failed for callback:", orderError);
      return ack();
    }

    if (!order) {
      // A callback with no matching order — most likely a stale
      // Sandbox retry, or CheckoutRequestID was never stored. Nothing
      // to update; just acknowledge.
      console.error("No order found for CheckoutRequestID:", CheckoutRequestID, MerchantRequestID);
      return ack();
    }

    // 2. Idempotency: don't reprocess a callback we've already handled
    // for this order (Safaricom sometimes sends the callback more than
    // once).
    const alreadyProcessed = [
      "valid_awaiting_owner",
      "invalid",
      "amount_mismatch",
      "phone_mismatch",
      "confirmed",
      "rejected",
    ].includes(order.verification_status);

    if (alreadyProcessed) {
      console.log(`Order ${order.id} already processed (${order.verification_status}); ignoring duplicate callback.`);
      return ack();
    }

    // 3. Transaction failed / was cancelled / timed out.
    if (Number(ResultCode) !== 0) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          verification_status: "invalid",
          mpesa_result_desc: ResultDesc || "Transaction was not completed.",
          callback_processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)
        .eq("checkout_request_id", CheckoutRequestID);

      if (updateError) console.error("Failed to mark order invalid:", updateError);
      return ack();
    }

    // 4. Successful transaction — extract the real payment details and
    // verify them against the order.
    const { amount, mpesaReceipt, transactionDate, phoneNumber } =
      extractMetadata(stkCallback);

    const orderTotal = Math.round(Number(order.total));
    const callbackAmount = Math.round(Number(amount));
    const amountMatches = Number.isFinite(callbackAmount) && callbackAmount === orderTotal;

    const orderPhone = normalizePhone(order.customer_phone);
    const callbackPhone = normalizePhone(phoneNumber);
    const phoneMatches = orderPhone && callbackPhone && orderPhone === callbackPhone;

    let verificationStatus = "valid_awaiting_owner";
    if (!amountMatches) verificationStatus = "amount_mismatch";
    else if (!phoneMatches) verificationStatus = "phone_mismatch";

    const { error: updateError, data: updateData } = await supabaseAdmin
      .from("orders")
      .update({
        mpesa_receipt: mpesaReceipt || null,
        mpesa_amount: Number.isFinite(callbackAmount) ? callbackAmount : null,
        mpesa_phone: callbackPhone,
        mpesa_transaction_date: transactionDate,
        mpesa_result_desc: ResultDesc || "Transaction completed successfully.",
        verification_status: verificationStatus,
        callback_processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      // Both conditions guard against a race where two callbacks for
      // the same CheckoutRequestID arrive at once — only the first to
      // land actually changes the row, since verification_status is
      // still "verifying" only for that one.
      .eq("id", order.id)
      .eq("checkout_request_id", CheckoutRequestID)
      .eq("verification_status", "verifying")
      .select()
      .maybeSingle();

    if (updateError) {
      // A unique-constraint violation here (23505) most likely means
      // this exact mpesa_receipt was already attached to a different
      // order — a duplicate/replayed callback. Don't silently accept
      // that; the order stays in "verifying" and the owner dashboard
      // will show it as unresolved rather than falsely confirmed.
      console.error("Failed to update order with verification result:", updateError);
      return ack();
    }

    if (!updateData) {
      console.log(`Order ${order.id} was no longer in "verifying" state; duplicate callback ignored.`);
    }

    return ack();
  } catch (error) {
    console.error("Callback error:", error);
    // Still ack — an internal error here shouldn't cause Safaricom to
    // hammer the endpoint with retries. The order simply stays in
    // "verifying" and is visible as unresolved in the owner dashboard.
    return ack();
  }
}
