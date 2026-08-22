export default function handler(req, res) {
  // Simple health endpoint to verify Serverless Functions are deployed and reachable.
  // Accepts GET and POST and always returns JSON.
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
}
