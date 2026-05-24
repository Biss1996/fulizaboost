export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, amount } = req.body || {};

    if (!phone || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const msisdn = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    const response = await fetch(
      "https://api.hashback.co.ke/initiatestk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.HASHPAY_API_KEY,
          account_id: process.env.HASHPAY_ACCOUNT_ID,
          amount: String(amount),
          msisdn,
          reference: "ORDER_" + Date.now(),
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      success: true,
      message: "STK request sent",
      data,
    });
  } catch (err) {
    console.error("STK ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}