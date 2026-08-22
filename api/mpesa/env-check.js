export default function handler(req, res) {
  const required = [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_CALLBACK_URL",
  ];

  const presence = {};
  required.forEach((k) => {
    presence[k] = !!process.env[k];
  });

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    ok: true,
    presence,
    note: "Values are not exposed. true means the environment variable is set in the function runtime.",
    vercel_url: process.env.VERCEL_URL || null,
  });
}
