export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, amount } = req.body || {};

  // DEBUG (important)
  console.log("BODY RECEIVED:", req.body);

  if (!phone || !amount) {
    return res.status(400).json({
      error: "Missing required fields",
      received: req.body
    });
  }

  return res.status(200).json({
    success: true,
    phone,
    amount,
    message: "STK ready to trigger"
  });
}