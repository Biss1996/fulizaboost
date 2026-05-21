const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone_number, amount, reference, platform } = req.body;

    if (!phone_number || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // HashPay API Configuration
    const hashpayApiKey = process.env.HASHPAY_API_KEY;
    const hashpayAccountId = process.env.HASHPAY_ACCOUNT_ID;
    const hashpayBaseUrl = process.env.HASHPAY_BASE_URL || 'https://api.hashpay.co.ke';

    if (!hashpayApiKey || !hashpayAccountId) {
      return res.status(500).json({ 
        error: 'HashPay credentials not configured' 
      });
    }

    // Clean phone number (remove +, spaces, ensure 254 prefix)
    const cleanPhone = (phone) => {
      phone = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
      if (phone.startsWith('07') || phone.startsWith('01')) {
        return '254' + phone.substring(1);
      }
      if (phone.startsWith('7') || phone.startsWith('1')) {
        return '254' + phone;
      }
      if (phone.startsWith('254')) {
        return phone;
      }
      throw new Error('Invalid phone number format');
    };

    const formattedPhone = cleanPhone(phone_number);

    // HashPay STK Push Request
    const stkResponse = await fetch(`${hashpayBaseUrl}/api/v1/stkpush`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hashpayApiKey}`,
        'Account-Id': hashpayAccountId
      },
      body: JSON.stringify({
        phone: formattedPhone,
        amount: Math.round(Number(amount)),
        reference: String(reference).substring(0, 50),
        callback_url: `${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/verify`,
        description: `Fuliza Limit Boost - ${reference}`
      })
    });

    const stkData = await stkResponse.json();

    if (!stkResponse.ok) {
      console.error('HashPay STK Error:', stkData);
      return res.status(400).json({
        error: stkData.message || 'Failed to initiate STK push',
        details: stkData
      });
    }

    // Return success with HashPay's response
    res.json({
      success: true,
      message: 'STK push initiated successfully',
      requestId: stkData.requestId || stkData.RequestId || stkData.merchantRequestID,
      reference: reference,
      phone: formattedPhone,
      amount: amount,
      ...stkData
    });

  } catch (error) {
    console.error('STK Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}