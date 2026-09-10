import type { FaqCategory } from "@/types";

import { MOCK_FAQS } from "./mock/lake";

const CATEGORY_ORDER: { id: string; questionPrefixes?: string[] }[] = [
  { id: "booking" },
  { id: "payment" },
  { id: "onboard" },
  { id: "checkin" },
];

/** Groups flat mock FAQs into the four categories the /faqs page renders (§11.23). */
export async function getFaqCategories(): Promise<FaqCategory[]> {
  const byPrefix: Record<string, string> = {
    "faq-book": "booking",
    "faq-pay": "payment",
    "faq-onboard": "onboard",
    "faq-checkin": "checkin",
  };

  const grouped: Record<string, FaqCategory["items"]> = {
    booking: [],
    payment: [],
    onboard: [],
    checkin: [],
  };

  for (const f of MOCK_FAQS) {
    const prefix = Object.keys(byPrefix).find((k) => f.id.startsWith(k));
    if (prefix) grouped[byPrefix[prefix]].push({ question: f.question, answer: f.answer });
  }

  return CATEGORY_ORDER.map((c) => ({
    id: c.id,
    title: `faqs.categories.${c.id}`,
    items: grouped[c.id],
  }));
}
