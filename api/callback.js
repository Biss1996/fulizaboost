export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔥 SAFE PARSING (Vercel sometimes sends string body)
    const payload =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("📩 Hashpay Callback Headers:", req.headers);
    console.log("📩 Hashpay Callback Payload:", payload);

    if (!payload) {
      return res.status(400).json({ error: "Empty payload" });
    }

    // Handle events
    switch (payload.event) {
      case "payment.request":
        console.log("🟡 STK Sent:", payload);
        break;

      case "payment.success":
        console.log("🟢 Payment Success:", payload);

        // TODO: update DB here
        // await updateTransaction(payload.checkout_id, "success");

        break;

      case "payment.failed":
        console.log("🔴 Payment Failed:", payload);

        // TODO: update DB here
        // await updateTransaction(payload.checkout_id, "failed");

        break;

      default:
        console.log("⚠️ Unknown event:", payload.event);
    }

    // IMPORTANT: always ACK quickly
    return res.status(200).json({ status: "received" });

  } catch (error) {
    console.error("❌ Callback Error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}