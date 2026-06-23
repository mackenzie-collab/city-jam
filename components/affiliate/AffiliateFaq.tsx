"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the commission work?",
    answer:
      "You earn £26.40 (30%) for every subscriber you refer who remains active on City Jam's £88/month plan.",
  },
  {
    question: "When do I get paid?",
    answer: "Commission payouts are processed monthly. Details confirmed during onboarding.",
  },
  {
    question: "Is there a minimum referral requirement?",
    answer: "No minimum. You earn from your very first referral.",
  },
  {
    question: "What is the onboarding session?",
    answer:
      "A 30-minute session (individual or band track) to set you up with your link, resources, and strategy.",
  },
  {
    question: "Can I apply as both an individual and a band?",
    answer: "Yes. You can register both tracks separately.",
  },
  {
    question: "When does the program launch?",
    answer: "The waitlist opens June 24, 2026. City Jam launches July 29. Apply now to join the founding cohort.",
  },
] as const;

export default function AffiliateFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div role="region" aria-label="Frequently asked questions">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `affiliate-faq-panel-${index}`;
        const triggerId = `affiliate-faq-trigger-${index}`;

        return (
          <div key={faq.question} className="affiliate-faq-item" data-open={isOpen}>
            <button
              id={triggerId}
              type="button"
              className="affiliate-faq-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{faq.question}</span>
              <ChevronDown className="affiliate-faq-chevron" size={20} aria-hidden />
            </button>
            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="affiliate-faq-panel"
              >
                {faq.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
