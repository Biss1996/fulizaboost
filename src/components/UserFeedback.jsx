import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

const feedbackData = [
  {
    name: 'David L.',
    initials: 'DL',
    message: "My limit moved from 2k to 75k in under 10 mins. Highly recommended for Safaricom users to start businesses!",
    verified: true,
    date: 'May 2026',
    rating: 5
  },
  {
    name: 'Mercy A.',
    initials: 'MA',
    message: "The process was very professional. My business limit is now boosted. Thank you so much!",
    verified: true,
    date: 'May 2026',
    rating: 5
  },
  {
    name: 'James K.',
    initials: 'JK',
    message: "Fast and reliable service. My Fuliza limit was increased within minutes of applying.",
    verified: true,
    date: 'May 2026',
    rating: 5
  },
];

export default function UserFeedback() {
  return (
    <section className="mb-16 px-4">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <i
            className="fas fa-quote-left"
            style={{ color: SAFARICOM_GREEN }}
          />
          Trusted by Thousands
        </h3>
        <p className="text-sm text-slate-500">Real feedback from verified users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {feedbackData.map((feedback, index) => (
          <article
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-safaricom/10 flex items-center justify-center text-safaricom font-bold text-sm">
                  {feedback.initials}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800 truncate">{feedback.name}</h4>
                    {feedback.verified && (
                      <span className="flex items-center gap-1 text-xs bg-green-50 text-safaricom px-2 py-0.5 rounded-full font-medium">
                        <i className="fas fa-shield-alt text-[10px]"></i>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star text-[10px] ${
                        star <= feedback.rating ? 'text-safaricom' : 'text-slate-200'
                      }`}
                      style={{ color: star <= feedback.rating ? SAFARICOM_GREEN : undefined }}
                    />
                  ))}
                </div>

                <blockquote className="text-sm text-slate-600 leading-relaxed">
                  "{feedback.message}"
                </blockquote>

                <p className="text-[10px] text-slate-400 mt-3">
                  {feedback.date}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}