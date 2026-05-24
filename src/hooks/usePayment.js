import { useState, useCallback, useEffect } from 'react';
import {
  localSTKPush,
  localVerifyPayment,
  generateReference,
  cleanPhone
} from '../services/hashpayApi';
import { PAYMENT_STATUS } from '../utils/constants';

export function usePayment() {
  const [paymentState, setPaymentState] = useState({
    isLoading: false,
    error: null,
    reference: null,
    status: PAYMENT_STATUS.PREPARING,
    phone: null,
    amount: 0,
  });

  const [paymentPoller, setPaymentPoller] = useState(null);
  const [paymentBusy, setPaymentBusy] = useState(false);

  // Initiate payment with Hashpay STK
  const initiatePayment = useCallback(async (phone, amount, idNumber) => {
    if (!phone || !amount) {
      throw new Error('Phone and amount are required');
    }

    if (paymentBusy) {
      throw new Error('Payment already in progress');
    }

    setPaymentBusy(true);
    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const cleanedPhone = cleanPhone(phone);
      const reference = generateReference();

      // Store initial state
      setPaymentState({
        isLoading: true,
        error: null,
        reference,
        status: PAYMENT_STATUS.PREPARING,
        phone: cleanedPhone,
        amount,
      });

      // Call local API which will proxy to Hashpay
      const response = await localSTKPush(cleanedPhone, amount, reference);

      setPaymentState(prev => ({
        ...prev,
        status: PAYMENT_STATUS.PENDING,
        isLoading: false,
      }));

      // Start polling for payment status
      startPaymentPolling(reference, cleanedPhone, amount);

      return { success: true, reference };
    } catch (error) {
      setPaymentState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        status: PAYMENT_STATUS.FAILED,
      }));
      setPaymentBusy(false);
      throw error;
    }
  }, [paymentBusy]);

  // Start polling for payment status
  const startPaymentPolling = useCallback((reference, phone, amount) => {
    clearInterval(paymentPoller);

    const poller = setInterval(async () => {
      try {
        const result = await verifyPaymentStatus(reference);

        if (result === PAYMENT_STATUS.COMPLETED || result === PAYMENT_STATUS.FAILED) {
          clearInterval(poller);
          setPaymentPoller(null);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 4000);

    setPaymentPoller(poller);
  }, [paymentPoller]);

  // Verify payment status
  const verifyPaymentStatus = useCallback(async (reference) => {
    try {
      const data = await localVerifyPayment(reference);

      if (data.status === 'success' || data.status === 'completed') {
        setPaymentState(prev => ({
          ...prev,
          status: PAYMENT_STATUS.COMPLETED,
          isLoading: false,
        }));
        setPaymentBusy(false);
        return PAYMENT_STATUS.COMPLETED;
      }

      if (data.status === 'failed') {
        setPaymentState(prev => ({
          ...prev,
          status: PAYMENT_STATUS.FAILED,
          isLoading: false,
          error: 'Payment failed',
        }));
        setPaymentBusy(false);
        return PAYMENT_STATUS.FAILED;
      }

      return PAYMENT_STATUS.PENDING;
    } catch (error) {
      console.error('Verification error:', error);
      return PAYMENT_STATUS.PENDING;
    }
  }, []);

  // Manual check payment
  const checkPaymentNow = useCallback(async () => {
    if (!paymentState.reference) return;
    return await verifyPaymentStatus(paymentState.reference);
  }, [paymentState.reference, verifyPaymentStatus]);

  // Close payment modal
  const closePayment = useCallback(() => {
    clearInterval(paymentPoller);
    setPaymentPoller(null);
    setPaymentBusy(false);
    setPaymentState({
      isLoading: false,
      error: null,
      reference: null,
      status: PAYMENT_STATUS.PREPARING,
      phone: null,
      amount: 0,
    });
  }, [paymentPoller]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(paymentPoller);
    };
  }, [paymentPoller]);

  return {
    paymentState,
    paymentBusy,
    initiatePayment,
    verifyPaymentStatus,
    checkPaymentNow,
    closePayment,
  };
}