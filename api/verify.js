const fetch = require('node-fetch');

export default async function handler(req, res) {
  try {
    // Handle both GET (from client polling) and POST (from HashPay callback)
    const reference = req.method === 'GET' 
      ? req.query.reference 
      : (req.body.reference || req.body.MerchantRequestID || req.body.requestId);

    if (!reference) {
      return res.status(400).json({ error: 'Reference is required' });
    }

    const hashpayApiKey = process.env.HASHPAY_API_KEY;
    const hashpayAccountId = process.env.HASHPAY_ACCOUNT_ID;
    const hashpayBaseUrl = process.env.HASHPAY_BASE_URL || 'https://api.hashpay.co.ke';

    if (!hashpayApiKey || !hashpayAccountId) {
      return res.status(500).json({ 
        error: 'HashPay credentials not configured' 
      });
    }

    // Check if this is a callback from HashPay
    if (req.method === 'POST' && req.headers['authorization']?.includes(hashpayApiKey)) {
      // This is a callback from HashPay - process it directly
      const status = req.body.status || req.body.ResultCode || req.body.resultCode;
      const receipt = req.body.receipt || req.body.MpesaReceiptNumber || req.body.mpesaReceipt;
      
      return res.json({
        success: true,
        status: status === '0' || status?.toLowerCase() === 'success' ? 'completed' : 'failed',
        reference: reference,
        receipt: receipt
      });
    }

    // Polling request - query HashPay API
    const verifyResponse = await fetch(
      `${hashpayBaseUrl}/api/v1/transactions/verify?reference=${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${hashpayApiKey}`,
          'Account-Id': hashpayAccountId
        }
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      // If not found, it might still be pending
      if (verifyResponse.status === 404) {
        return res.json({
          status: 'pending',
          message: 'Payment not yet found',
          reference: reference
        });
      }
      
      return res.status(400).json({
        error: verifyData.message || 'Verification failed',
        ...verifyData
      });
    }

    // Normalize status
    let normalizedStatus = 'pending';
    const status = verifyData.status || verifyData.payment_status || verifyData.ResultCode;
    
    if (status === '0' || status?.toLowerCase() === 'success' || status?.toLowerCase() === 'completed') {
      normalizedStatus = 'completed';
    } else if (status?.toLowerCase().includes('fail') || status?.toLowerCase().includes('cancel') || status === '1') {
      normalizedStatus = 'failed';
    }

    res.json({
      success: true,
      status: normalizedStatus,
      reference: reference,
      receipt: verifyData.receipt || verifyData.MpesaReceiptNumber || verifyData.mpesaReceipt,
      amount: verifyData.amount,
      phone: verifyData.phone,
      timestamp: verifyData.timestamp || verifyData.createdAt
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}