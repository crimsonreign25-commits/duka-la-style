export default async function handler(req, res) {
  try {
    return res.status(200).json({
      function: "working",
      consumerKeyConfigured: Boolean(process.env.MPESA_CONSUMER_KEY),
      consumerSecretConfigured: Boolean(process.env.MPESA_CONSUMER_SECRET),
      message: "Vercel function is running correctly."
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}