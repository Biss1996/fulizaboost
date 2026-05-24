// Hashpay callback handler for payment notifications
// This receives webhook notifications from Hashpay

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // Verify the callback is from Hashpay
    // You should add signature verification here
    // const signature = req.headers['x-hashpay-signature'];
    // if (!verifySignature(payload, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    console.log('Hashpay Callback:', payload);

    // Handle different callback types
    switch (payload.event) {
      case 'payment.request':
        // STK push has been sent to the user
        console.log('STK Push Sent:', payload);
        break;

      case 'payment.success':
        // Payment was successful
        console.log('Payment Successful:', payload);
        // Update your database here
        break;

      case 'payment.failed':
        // Payment failed
        console.log('Payment Failed:', payload);
        break;

      default:
        console.log('Unknown Event:', payload);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error('Callback Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function for signature verification
// function verifySignature(payload, signature) {
//   const crypto = require('crypto');
//   const secret = process.env.HASHPAY_WEBHOOK_SECRET;
//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(JSON.stringify(payload))
//     .digest('hex');
//   return expectedSignature === signature;
// }