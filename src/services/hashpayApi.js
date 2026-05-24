import { HASHPAY_CONFIG, API_BASE } from "../utils/constants";

/**
 * Initialize Hashpay STK Push
 */
export async function initiateHashpaySTK(phone, amount, reference) {
  try {
    const endpoint =
      HASHPAY_CONFIG.environment === "production"
        ? "https://api.hashpay.co.ke/v1/payments/stkpush"
        : "https://sandbox.hashpay.co.ke/v1/payments/stkpush";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HASHPAY_CONFIG.apiKey}`,
        "Merchant-Id": HASHPAY_CONFIG.merchantId,
      },
      body: JSON.stringify({
        phone_number: phone,
        amount: Number(amount),
        reference,
        callback_url: `${API_BASE}/api/callback`,
        description: `Fuliza Limit Boost - Ksh ${amount}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to initiate STK push");
    }

    return data;
  } catch (error) {
    console.error("Hashpay STK Error:", error);
    throw error;
  }
}

/**
 * Verify payment status with Hashpay
 */
export async function verifyHashpayPayment(reference) {
  try {
    const endpoint =
      HASHPAY_CONFIG.environment === "production"
        ? `https://api.hashpay.co.ke/v1/payments/status?reference=${reference}`
        : `https://sandbox.hashpay.co.ke/v1/payments/status?reference=${reference}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${HASHPAY_CONFIG.apiKey}`,
        "Merchant-Id": HASHPAY_CONFIG.merchantId,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

    return data;
  } catch (error) {
    console.error("Hashpay Verification Error:", error);
    throw error;
  }
}

/**
 * Local API proxy for STK (Vercel backend)
 */
export async function localSTKPush(phone, amount, reference) {
  try {
    const response = await fetch(`/api/stk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        amount,
        reference,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "STK failed");
    }

    return data;
  } catch (error) {
    console.error("Local STK Error:", error);
    throw error;
  }
}

/**
 * Local verification (YOU MUST create /api/status if using this)
 */
export async function localVerifyPayment(reference) {
  try {
    const response = await fetch(`/api/status?reference=${reference}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Verification failed");
    }

    return data;
  } catch (error) {
    console.error("Local Verification Error:", error);
    throw error;
  }
}

/**
 * Clean phone number to 254 format
 */
export function cleanPhone(phone) {
  if (!phone) return "";

  let cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
    return "254" + cleaned.substring(1);
  }

  if (cleaned.startsWith("254")) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Generate unique reference
 */
export function generateReference() {
  return (
    "FULIZA-" +
    Date.now() +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}