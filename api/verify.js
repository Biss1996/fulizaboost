// Serverless function for payment verification
// Deploy this to Vercel, Netlify, or Cloudflare Workers

import { HASHPAY_CONFIG } from '../src/utils/constants';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ error: 'Reference is required' });
    }

    // Hashpay API endpoint
    const endpoint = HASHPAY_CONFIG.environment === 'production'
      ? `https://api.hashpay.co.ke/v1/payments/status?reference=${reference}`
      : `https://sandbox.hashpay.co.ke/v1/payments/status?reference=${reference}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HASHPAY_CONFIG.apiKey}`,
        'Merchant-Id': HASHPAY_CONFIG.merchantId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: error.message || 'Failed to verify payment',
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Verification Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}