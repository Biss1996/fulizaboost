import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

const feedbackData = [
  {
    name: 'David L.',
    avatar: 'https://ui-avatars.com/api/?name=David+L&background=49aa33&color=fff',
    message: "My limit moved from 2k to 75k in under 10 mins. Highly recommended for safaricom users to start businesses!",
    verified: true,
  },
  {
    name: 'Mercy A.',
    avatar: 'https://ui-avatars.com/api/?name=Mercy+A&background=49aa33&color=fff',
    message: "The process was very professional. My business limit is now boosted. Thank You so much",
    verified: true,
  },
];

export default function UserFeedback() {
  return (
    <div className="mb-12">
      <h3 className="text-center font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
        <i
          className="fas fa-comment-dots text-safaricom"
          style={{ color: SAFARICOM_GREEN }}
        /> 
        Real-Time User Feedback
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackData.map((feedback, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-3"
          >
            <img
              src={feedback.avatar}
              alt={feedback.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-xs font-bold">
                {feedback.name}
                {feedback.verified && (
                  <span
                    className="text-safaricom ml-1 text-[10px]"
                    style={{ color: SAFARICOM_GREEN }}
                  >
                    <i className="fas fa-check-circle"></i> Verified
                  </span>
                )}
              </p>
              <p className="text-[12px] text-slate-600">{feedback.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}