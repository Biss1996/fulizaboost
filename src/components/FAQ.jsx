import React from "react";
import { SAFARICOM_GREEN } from '../utils/constants';

const faqs = [
  {
    question: 'How long does the boost take and to reflect on my M-pesa?',
    answer: 'Typically applied within 10 to 20 minutes after verification and processing.',
  },
  {
    question: 'Is my Safaricom PIN required?',
    answer: 'No. We never ask for your PIN. You only enter it on the official M-Pesa prompt to process your applied limit.',
  },
];

export default function FAQ() {
  return (
    <div className="mb-12">
      <h3
        className="font-bold text-slate-800 mb-6 px-2 border-l-4 border-safaricom"
        style={{ borderColor: SAFARICOM_GREEN }}
      >
        Frequently Asked Questions
      </h3>
      <div className="space-y-3 text-sm">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-slate-200"
          >
            <p className="font-bold mb-1">{index + 1}. {faq.question}</p>
            <p className="text-slate-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}