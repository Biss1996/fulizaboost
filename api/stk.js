import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, amount } = req.body || {};

    if (!phone || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Convert phone if needed (0712... → 254712...)
    const msisdn = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    const response = await axios.post(
      "https://api.hashback.co.ke/initiatestk",
      {
        api_key: process.env.HASHPAY_API_KEY,
        account_id: process.env.HASHPAY_ACCOUNT_ID,
        amount: String(amount),
        msisdn,
        reference: "ORDER_" + Date.now(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "STK pushed successfully",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
}