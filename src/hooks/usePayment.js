import { useState, useCallback, useEffect, useRef } from "react";
import {
  localSTKPush,
  localVerifyPayment,
  generateReference,
  cleanPhone,
} from "../services/hashpayApi";
import { PAYMENT_STATUS } from "../utils/constants";

export function usePayment() {
  const [paymentState, setPaymentState] = useState({
    isLoading: false,
    error: null,
    reference: null,
    status: PAYMENT_STATUS.PREPARING,
    phone: null,
    amount: 0,
  });

  const [paymentBusy, setPaymentBusy] = useState(false);
  const pollRef = useRef(null);

  // 🔥 INITIATE PAYMENT
  const initiatePayment = useCallback(
    async (phone, amount) => {
      if (!phone || !amount) {
        throw new Error("Phone and amount are required");
      }

      if (paymentBusy) {
        throw new Error("Payment already in progress");
      }

      setPaymentBusy(true);

      const cleanedPhone = cleanPhone(phone);
      const reference = generateReference();

      setPaymentState({
        isLoading: true,
        error: null,
        reference,
        status: PAYMENT_STATUS.PREPARING,
        phone: cleanedPhone,
        amount,
      });

      try {
        await localSTKPush(cleanedPhone, amount, reference);

        setPaymentState((prev) => ({
          ...prev,
          status: PAYMENT_STATUS.PENDING,
          isLoading: false,
        }));

        startPaymentPolling(reference);

        return { success: true, reference };
      } catch (error) {
        setPaymentState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
          status: PAYMENT_STATUS.FAILED,
        }));

        setPaymentBusy(false);
        throw error;
      }
    },
    [paymentBusy]
  );

  // 🔥 POLLING (FIXED)
  const startPaymentPolling = useCallback((reference) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const data = await localVerifyPayment(reference);

        const status = data.status;

        // 🔥 UPDATE UI EVERY POLL
        if (status === "completed" || status === "success") {
          setPaymentState((prev) => ({
            ...prev,
            status: PAYMENT_STATUS.COMPLETED,
            isLoading: false,
          }));

          setPaymentBusy(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
          return;
        }

        if (status === "failed") {
          setPaymentState((prev) => ({
            ...prev,
            status: PAYMENT_STATUS.FAILED,
            isLoading: false,
            error: "Payment failed",
          }));

          setPaymentBusy(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
          return;
        }

        // still pending → keep UI updated
        setPaymentState((prev) => ({
          ...prev,
          status: PAYMENT_STATUS.PENDING,
        }));
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 4000);
  }, []);

  // 🔥 MANUAL CHECK
  const checkPaymentNow = useCallback(async () => {
    if (!paymentState.reference) return;

    const data = await localVerifyPayment(paymentState.reference);

    return data.status;
  }, [paymentState.reference]);

  // 🔥 CLOSE CLEANUP
  const closePayment = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    setPaymentBusy(false);

    setPaymentState({
      isLoading: false,
      error: null,
      reference: null,
      status: PAYMENT_STATUS.PREPARING,
      phone: null,
      amount: 0,
    });
  }, []);

  // 🔥 SAFETY CLEANUP
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return {
    paymentState,
    paymentBusy,
    initiatePayment,
    checkPaymentNow,
    closePayment,
  };
}