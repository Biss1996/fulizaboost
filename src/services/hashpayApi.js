import { HASHPAY_CONFIG, API_BASE } from '../utils/constants';

/**
 * Initialize Hashpay STK Push
 * @param {string} phone - Phone number in 254 format
 * @param {number} amount - Amount to charge
 * @param {string} reference - Unique reference for the transaction
 * @returns {Promise<Object>} - Transaction response
 */
export async function initiateHashpaySTK(phone, amount, reference) {
  try {
    // Hashpay API endpoint
    const endpoint = HASHPAY_CONFIG.environment === 'production'
      ? 'https://api.hashpay.co.ke/v1/payments/stkpush'
      : 'https://sandbox.hashpay.co.ke/v1/payments/stkpush';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HASHPAY_CONFIG.apiKey}`,
        'Merchant-Id': HASHPAY_CONFIG.merchantId,
      },
      body: JSON.stringify({
        phone_number: phone,
        amount: amount,
        reference: reference,
        callback_url: `${API_BASE}/api/callback`,
        description: `Fuliza Limit Boost - Ksh ${amount}`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initiate STK push');
    }

    return await response.json();
  } catch (error) {
    console.error('Hashpay STK Error:', error);
    throw error;
  }
}

/**
 * Verify payment status with Hashpay
 * @param {string} reference - Transaction reference
 * @returns {Promise<Object>} - Payment status
 */
export async function verifyHashpayPayment(reference) {
  try {
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
      const text = await response.text();

let data = {};

try {
  data = text ? JSON.parse(text) : {};
} catch {
  data = { error: 'Invalid JSON response' };
}
      throw new Error(error.message || 'Failed to verify payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Hashpay Verification Error:', error);
    throw error;
  }
}

/**
 * Local API proxy for serverless deployment
 * This would be implemented in your serverless functions
 */
export async function localSTKPush(phone, amount, reference) {
  try {
    const response = await fetch(`${API_BASE}/api/stk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phone,
        amount: amount,
        reference: reference,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'STK failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Local STK Error:', error);
    throw error;
  }
}

export async function localVerifyPayment(reference) {
  try {
const response = await fetch('/api/stk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone_number: phone,
    amount,
    reference,
  }),
})
    return await response.json();
  } catch (error) {
    console.error('Local Verification Error:', error);
    throw error;
  }
}

/**
 * Clean phone number to 254 format
 * @param {string} phone - Phone number
 * @returns {string} - Cleaned phone number
 */
export function cleanPhone(phone) {
  if (!phone) return phone;

  let cleaned = phone.replace(/\s+/g, '');

  if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
    return '254' + cleaned.substring(1);
  }

  if (cleaned.startsWith('254')) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Generate unique reference
 * @returns {string} - Unique reference
 */
export function generateReference() {
  return 'FULIZA-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}