import axios from "axios";

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
        error: "M-Pesa credentials are not configured.",
      });
    }

    const auth = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return res.status(200).json({
      access_token: data.access_token,
    });
  } catch (error) {
    console.error(
      "M-Pesa token error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error:
        error.response?.data?.errorMessage ||
        error.message ||
        "Could not obtain M-Pesa access token.",
    });
  }
}