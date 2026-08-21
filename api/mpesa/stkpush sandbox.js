export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { phone, amount } = req.body || {};

    if (!phone || amount === undefined || amount === null) {
      return res.status(400).json({
        error: "Phone number and amount are required.",
      });
    }

    /*
     * =========================================================
     * DUKA LA STYLE — M-PESA SANDBOX CONFIGURATION
     *
     * These are SANDBOX values.
     * Your production file should remain saved separately.
     * =========================================================
     */

    const shortcode = "174379";

    const passkey =
      process.env.MPESA_PASSKEY ||
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!callbackUrl) {
      return res.status(500).json({
        error:
          "MPESA_CALLBACK_URL is missing. Add your deployed Vercel callback URL in Environment Variables.",
      });
    }

    /*
     * =========================================================
     * FORMAT PHONE NUMBER
     * =========================================================
     */

    let formattedPhone = String(phone)
      .trim()
      .replace(/\s+/g, "");

    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    }

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({
        error:
          "Enter a valid Kenyan phone number, for example 0712345678.",
      });
    }

    /*
     * =========================================================
     * FORMAT AMOUNT
     * =========================================================
     */

    const numericAmount = Math.round(Number(amount));

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({
        error: "Amount must be a valid positive number.",
      });
    }

    /*
     * =========================================================
     * DARAJA TIMESTAMP
     * =========================================================
     */

    const now = new Date();

    const timestamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    /*
     * =========================================================
     * GENERATE STK PASSWORD
     * =========================================================
     */

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");

    /*
     * =========================================================
     * GET ACCESS TOKEN
     * =========================================================
     *
     * We use your existing token.js endpoint.
     */

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://duka-la-style.vercel.app";

    const tokenResponse = await fetch(
      `${baseUrl}/api/mpesa/token`
    );

    const tokenText = await tokenResponse.text();

    let tokenData;

    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      tokenData = {
        raw: tokenText,
      };
    }

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("M-Pesa token error:", tokenData);

      return res.status(500).json({
        error: "Could not authenticate with M-Pesa.",
        details:
          tokenData.error ||
          tokenData.error_description ||
          "No access token returned.",
      });
    }

    /*
     * =========================================================
     * SEND STK PUSH
     * =========================================================
     */

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
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

    /*
     * =========================================================
     * READ SAFARICOM RESPONSE
     * =========================================================
     */

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
      console.error("M-Pesa STK Push error:", stkData);

      return res.status(500).json({
        error:
          stkData.errorMessage ||
          stkData.error ||
          "M-Pesa STK Push failed.",

        details: stkData,
      });
    }

    /*
     * IMPORTANT:
     *
     * A successful STK Push response only means Safaricom
     * accepted the request.
     *
     * It does NOT mean the customer has paid yet.
     *
     * The callback.js must receive the final result.
     */

    return res.status(200).json({
      success: true,
      ...stkData,
    });
  } catch (error) {
    console.error("STK Push function error:", error);

    return res.status(500).json({
      error:
        error.message ||
        "M-Pesa STK Push request failed.",
    });
  }
}