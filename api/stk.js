export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    const { phone_number, amount, reference } = req.body;

    if (!phone_number || !amount || !reference) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const environment = process.env.HASHPAY_ENV || 'sandbox';

    const endpoint =
      environment === 'production'
        ? 'https://api.hashpay.co.ke/v1/payments/stkpush'
        : 'https://sandbox.hashpay.co.ke/v1/payments/stkpush';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HASHPAY_API_KEY}`,
        'Merchant-Id': process.env.HASHPAY_MERCHANT_ID,
      },

      body: JSON.stringify({
        phone_number,
        amount,
        reference,

        callback_url: `${
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:5173'
        }/api/callback`,

        description: `Fuliza Limit Boost - Ksh ${amount}`,
      }),
    });

    const text = await response.text();

let data = {};

try {
  data = text ? JSON.parse(text) : {};
} catch {
  data = {
    raw: text,
  };
}

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Failed to initiate STK push',
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('STK Push Error:', error);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}