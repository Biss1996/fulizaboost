import React from "react";
import { useState, useEffect } from 'react';
import { SAFARICOM_GREEN } from '../utils/constants';

export default function Toast({ message, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose && onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      id="live-toast"
      className="fixed bottom-[100px] left-5 right-5 bg-white p-3 rounded-xl shadow-2xl border-l-4 z-[1000] max-w-[320px] mx-auto"
      style={{ borderLeftColor: SAFARICOM_GREEN }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
          style={{ color: SAFARICOM_GREEN }}
        >
          <i className="fas fa-bolt"></i>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Live Activity</p>
          <p className="text-xs font-bold text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
}