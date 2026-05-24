import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

export default function SupportBar({ onChatClick }) {
  return (
    <div
      className="bg-slate-900 text-white font-bold text-[13px] py-3 px-5 sticky top-0 z-[60] border-b-2 border-safaricom"
      style={{ borderColor: SAFARICOM_GREEN }}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <i
            className="fas fa-headset text-safaricom"
            style={{ color: SAFARICOM_GREEN }}
          />
          <span className="uppercase tracking-wider">24/7 LIVE SUPPORT</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:0722000000" className="hidden md:block hover:text-safaricom transition-colors">
            0722 000 000
          </a>
          <button
            onClick={onChatClick}
            className="flex items-center gap-1.5 cursor-pointer hover:text-safaricom transition-colors"
          >
            <i
              className="fas fa-comment-alt text-safaricom"
              style={{ color: SAFARICOM_GREEN }}
            />
            <span className="uppercase">LIVE CHAT WITH ZURI</span>
          </button>
        </div>
      </div>
    </div>
  );
}