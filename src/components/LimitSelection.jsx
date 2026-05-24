import React, { useState, useEffect } from "react";
import { LIMITS_DATA, SAFARICOM_GREEN } from "../utils/constants";

export default function LimitSelection({ onSelect }) {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (limit) => {
    setActiveCard(limit.amt);
    onSelect(limit.amt, limit.fee);
  };

  const handleHeroOfferClick = () => {
    const heroLimit = LIMITS_DATA.find((l) => l.type === "hero");

    if (heroLimit) {
      setActiveCard(heroLimit.amt);
      onSelect(heroLimit.amt, heroLimit.fee);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-7">
        <h2
          className="text-2xl md:text-3xl font-black text-slate-800 border-l-4 pl-4"
          style={{ borderColor: SAFARICOM_GREEN }}
        >
          Select Your Approved Limit
        </h2>

        <p className="text-sm text-slate-500 mt-2 pl-5">
          Instant approval with secure M-Pesa verification
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        {LIMITS_DATA.map((limit) => {

          const isHero = limit.type === "hero";
          const isHot = limit.tags?.includes("hot");

          // FULL WIDTH FOR HERO + HOT
          const cardClass = isHero || isHot
            ? "col-span-2"
            : "col-span-1";

          // =========================
          // HERO CARD
          // =========================
          if (isHero) {
            return (
              <div
                key={limit.amt}
                className={cardClass}
              >
                <div
                  onClick={handleHeroOfferClick}
                  className={`relative overflow-hidden rounded-[2rem] p-5 cursor-pointer transition-all duration-300 shadow-2xl border ${
                    activeCard === limit.amt
                      ? "scale-[1.01]"
                      : "hover:scale-[1.01]"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #0f9d58 0%, #16a34a 45%, #22c55e 100%)",
                    borderColor:
                      activeCard === limit.amt
                        ? "#14532d"
                        : "rgba(255,255,255,0.2)",
                  }}
                >

                  {/* BACKGROUND GLOW */}
                  <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full blur-3xl" />

                  {/* TOP BADGE */}
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 text-[11px] font-black px-5 py-2 rounded-full shadow-xl uppercase tracking-[0.15em]">
                    <i className="fas fa-crown text-[10px]" />
                    Special Offer
                  </div>

                  {/* CONTENT */}
                  <div className="mt-6">
                    <p className="text-white/70 text-xs uppercase tracking-[0.25em] font-bold">
                      Approved Limit
                    </p>

                    <h1 className="text-4xl md:text-5xl font-black text-white mt-2 leading-none">
                      Ksh {limit.amt.toLocaleString()}
                    </h1>

                    <p className="text-white/80 mt-3 text-sm">
                      Fastest approval with priority processing
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="flex flex-wrap gap-3 mt-6">

                    <div className="bg-white/15 backdrop-blur-lg border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                      ⚡ Instant Approval
                    </div>

                    <div className="bg-white/15 backdrop-blur-lg border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                      🔥 Priority Processing
                    </div>

                    <div className="bg-white/15 backdrop-blur-lg border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full">
                      ⭐ Premium Offer
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="mt-7 flex items-center justify-between flex-wrap gap-4">

                    <div>
                      <p className="text-white/60 text-xs uppercase font-bold tracking-wider">
                        Processing Fee
                      </p>

                      <p className="text-white text-3xl font-black mt-1">
                        Ksh {limit.fee}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHeroOfferClick();
                      }}
                      className="bg-white text-green-700 px-6 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Claim Offer
                    </button>

                  </div>
                </div>
              </div>
            );
          }

          // =========================
          // HOT CARD
          // =========================
          if (isHot) {
            return (
              <div
                key={limit.amt}
                className={cardClass}
              >
                <div
                  onClick={() => handleCardClick(limit)}
                  className={`relative overflow-hidden rounded-[1.8rem] p-6 cursor-pointer transition-all duration-300 border shadow-xl ${
                    activeCard === limit.amt
                      ? "scale-[1.01]"
                      : "hover:-translate-y-1 hover:shadow-2xl"
                  }`}
                  style={{
                    background:
                      activeCard === limit.amt
                        ? "linear-gradient(135deg,#dc2626,#ef4444)"
                        : "linear-gradient(135deg,#ffffff,#fff5f5)",
                    borderColor:
                      activeCard === limit.amt
                        ? "#eaa71f"
                        : "#fecaca",
                  }}
                >

                  {/* GLOW */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-300/30 rounded-full blur-3xl" />

                  {/* HOT BADGE */}
                  <div className="inline-flex items-center gap-2 bg-red-500 text-white text-[11px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em] shadow-lg animate-pulse">
                    🔥 Hot Deal
                  </div>

                  <div className="mt-5 flex items-center justify-between">

                    <div>
                      <p
                        className={`text-xs uppercase font-bold tracking-[0.2em] ${
                          activeCard === limit.amt
                            ? "text-white/70"
                            : "text-red-400"
                        }`}
                      >
                        Popular Limit
                      </p>

                      <h3
                        className={`text-4xl font-black mt-2 ${
                          activeCard === limit.amt
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        Ksh {limit.amt.toLocaleString()}
                      </h3>

                      <p
                        className={`mt-3 text-sm ${
                          activeCard === limit.amt
                            ? "text-white/80"
                            : "text-slate-500"
                        }`}
                      >
                        High approval success rate
                      </p>
                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        activeCard === limit.amt
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <i className="fas fa-fire text-xl" />
                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between">

                    <div>
                      <p
                        className={`text-xs uppercase font-bold ${
                          activeCard === limit.amt
                            ? "text-white/60"
                            : "text-slate-400"
                        }`}
                      >
                        Processing Fee
                      </p>

                      <p
                        className={`text-2xl font-black ${
                          activeCard === limit.amt
                            ? "text-white"
                            : "text-red-600"
                        }`}
                      >
                        Ksh {limit.fee}
                      </p>
                    </div>

                    {activeCard === limit.amt && (
                      <div className="bg-white text-red-600 px-4 py-2 rounded-full text-xs font-black shadow-lg">
                        Selected
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          }

          // =========================
          // NORMAL CARD
          // =========================
          return (
            <div
              key={limit.amt}
              className={cardClass}
            >
              <div
                onClick={() => handleCardClick(limit)}
                className={`relative overflow-hidden rounded-[1.7rem] p-5 cursor-pointer transition-all duration-300 border shadow-md hover:shadow-2xl hover:-translate-y-1 ${
                  activeCard === limit.amt
                    ? "scale-[1.02]"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    activeCard === limit.amt
                      ? SAFARICOM_GREEN
                      : "#ffffff",
                  borderColor:
                    activeCard === limit.amt
                      ? SAFARICOM_GREEN
                      : "#e5e7eb",
                }}
              >

                {/* GLOW */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 opacity-40 rounded-full blur-2xl" />

                {/* TOP */}
                <div className="flex items-center justify-between mb-5">

                  {limit.tags?.includes("instant") ? (
                    <div className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      ⚡ Instant
                    </div>
                  ) : (
                    <div />
                  )}

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      activeCard === limit.amt
                        ? "bg-white/20 text-white"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    <i className="fas fa-arrow-right" />
                  </div>

                </div>

                {/* AMOUNT */}
                <div>
                  <p
                    className={`text-sm font-bold uppercase tracking-widest ${
                      activeCard === limit.amt
                        ? "text-white/70"
                        : "text-slate-400"
                    }`}
                  >
                    Available Limit
                  </p>

                  <h3
                    className={`text-3xl font-black mt-2 ${
                      activeCard === limit.amt
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                  >
                    Ksh {limit.amt.toLocaleString()}
                  </h3>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <p
                      className={`text-xs uppercase font-bold ${
                        activeCard === limit.amt
                          ? "text-white/60"
                          : "text-slate-400"
                      }`}
                    >
                      Processing Fee
                    </p>

                    <p
                      className={`text-xl font-black ${
                        activeCard === limit.amt
                          ? "text-white"
                          : "text-green-700"
                      }`}
                    >
                      Ksh {limit.fee}
                    </p>
                  </div>

                  {activeCard === limit.amt && (
                    <div className="bg-white text-green-700 text-xs font-black px-3 py-2 rounded-full shadow-lg">
                      Selected
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}