export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const callback = req.body;

    console.log(
      "M-Pesa callback received:",
      JSON.stringify(callback, null, 2)
    );

    /*
      For now, we acknowledge the callback.

      Once the Sandbox STK Push is working, we'll connect
      this callback to Supabase so successful payments
      automatically change the order to "paid".
    */

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    });
  } catch (error) {
    console.error("Callback error:", error);

    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Callback processing failed",
    });
  }
}