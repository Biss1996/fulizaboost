// api/verify.js

export default async function handler(req, res) {

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Allow GET only
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {

        const checkoutid = req.query.reference;

        if (!checkoutid) {
            return res.status(400).json({
                success: false,
                message: 'Missing checkout ID'
            });
        }

        console.log('Checking status for:', checkoutid);

        const response = await fetch(
            'https://api.hashback.co.ke/transactionstatus',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: process.env.HASHBACK_API_KEY,
                    account_id: process.env.HASHBACK_ACCOUNT_ID,
                    checkoutid
                })
            }
        );

        const data = await response.json();

        console.log('VERIFY RESPONSE:', data);

        // SUCCESSFUL PAYMENT
        if (
            data.ResultCode === '0' ||
            data.ResponseCode === '0'
        ) {

            return res.status(200).json({
                success: true,
                status: 'completed',
                message: 'Payment successful',
                receipt:
                    data.TransactionReceipt ||
                    data.TransactionID ||
                    checkoutid,
                data
            });
        }

        // FAILED PAYMENT
        if (
            data.ResultCode &&
            data.ResultCode !== '0'
        ) {

            return res.status(200).json({
                success: false,
                status: 'failed',
                message:
                    data.ResultDesc ||
                    'Payment failed',
                data
            });
        }

        // PENDING
        return res.status(200).json({
            success: false,
            status: 'pending',
            message: 'Waiting for payment confirmation',
            data
        });

    } catch (error) {

        console.error('VERIFY ERROR:', error);

        return res.status(500).json({
            success: false,
            status: 'failed',
            message:
                error.message ||
                'Verification failed'
        });
    }
}