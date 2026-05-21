// api/stk.js

export default async function handler(req, res) {

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Allow POST only
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {

        const {
            phone_number,
            amount,
            reference
        } = req.body;

        // Validation
        if (!phone_number || !amount || !reference) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Clean phone
        let msisdn = String(phone_number)
            .replace(/\s+/g, '')
            .replace('+', '');

        if (msisdn.startsWith('07')) {
            msisdn = '254' + msisdn.substring(1);
        }

        if (msisdn.startsWith('01')) {
            msisdn = '254' + msisdn.substring(1);
        }

        console.log('Initiating STK:', {
            msisdn,
            amount,
            reference
        });

        const response = await fetch(
            'https://api.hashback.co.ke/initiatestk',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: process.env.HASHBACK_API_KEY,
                    account_id: process.env.HASHBACK_ACCOUNT_ID,
                    amount: String(amount),
                    msisdn,
                    reference
                })
            }
        );

        const data = await response.json();

        console.log('HashBack Response:', data);

        // Handle API errors
        if (!response.ok || !data.success) {
            return res.status(400).json({
                success: false,
                message:
                    data.message ||
                    'Failed to initiate STK push',
                data
            });
        }

        return res.status(200).json({
            success: true,
            message: 'STK push initiated successfully',
            checkout_id: data.checkout_id,
            data
        });

    } catch (error) {

        console.error('STK ERROR:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}