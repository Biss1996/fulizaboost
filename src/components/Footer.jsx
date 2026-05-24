import React from "react";
export default function Footer() {
  return (
    <footer className="py-10 border-t border-slate-200 text-center">
      <div className="flex justify-center gap-6 mb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg"
          alt="M-Pesa Logo"
          className="h-5 opacity-60"
        />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center">
          Safaricom API Integrated
        </span>
      </div>
      <p className="text-xs font-bold text-slate-500">
        FulizaBoost Services Ltd • Nairobi, Kenya
      </p>
    </footer>
  );
}