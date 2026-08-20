export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({
        error: "M-Pesa credentials are missing.",
      });
    }

    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("Safaricom OAuth response:", data);

      return res.status(500).json({
        error: "Safaricom OAuth request failed.",
        status: response.status,
        details: data.errorMessage || data.error || "Unknown error",
      });
    }

    if (!data.access_token) {
      return res.status(500).json({
        error: "Safaricom did not return an access token.",
      });
    }

    return res.status(200).json({
      access_token: data.access_token,
    });
  } catch (error) {
    console.error("M-Pesa token error:", error);

    return res.status(500).json({
      error: error.message || "M-Pesa token request failed.",
    });
  }
}