export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { phone, amount } = req.body || {};

    if (!phone || !amount) {
      return res.status(400).json({
        error: "Phone number and amount are required.",
      });
    }

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!shortcode || !passkey || !callbackUrl) {
      return res.status(500).json({
        error: "M-Pesa STK Push environment variables are missing.",
      });
    }

    // Convert Kenyan numbers such as 0712345678 or 0112345678
    // into the international format required by Daraja.
    let formattedPhone = String(phone).replace(/\s+/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    }

    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return res.status(400).json({
        error: "Enter a valid Kenyan phone number.",
      });
    }

    const numericAmount = Math.round(Number(amount));

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({
        error: "Amount must be a valid positive number.",
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

    // Get an OAuth token from our existing endpoint.
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://duka-la-style.vercel.app";

    const tokenResponse = await fetch(
      `${baseUrl}/api/mpesa/token`
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Token endpoint error:", tokenData);

      return res.status(500).json({
        error: "Could not authenticate with M-Pesa.",
        details: tokenData.error || "No access token returned.",
      });
    }

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

    return res.status(200).json(stkData);
  } catch (error) {
    console.error("STK Push function error:", error);

    return res.status(500).json({
      error: error.message || "STK Push request failed.",
    });
  }
}