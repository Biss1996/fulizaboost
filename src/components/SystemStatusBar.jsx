import React from "react";
export default function SystemStatusBar() {
  return (
    <div className="bg-slate-900 text-white py-2.5 text-[9px] font-black text-center uppercase tracking-[0.2em] px-4 border-b border-white/10">
      <span className="text-green-400 animate-pulse">●</span> 
      System Status: Online | Encryption: AES-256 | Node: SAF-024
    </div>
  );
}