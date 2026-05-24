import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

export default function VerificationStep({ statusText, subStatusText }) {
  return (
    <div
      id="verifying-step"
      className="bg-white p-12 rounded-[2rem] shadow-xl text-center mb-10 relative overflow-hidden"
    >
      <div className="scanner-line" />
      <div
        className="w-16 h-16 border-4 border-safaricom border-t-transparent rounded-full animate-spin mx-auto mb-6"
        style={{ borderColor: SAFARICOM_GREEN }}
      />
      <h3 className="text-xl font-bold text-slate-800 mb-2" id="status-text">
        {statusText}
      </h3>
      <p className="text-sm text-slate-500" id="sub-status-text">
        {subStatusText}
      </p>
    </div>
  );
}