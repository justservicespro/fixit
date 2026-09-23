// app/faqs/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs — JustServicesPro",
  description:
    "Answers to common questions about CAC business registration, website packages, consultations, digital platforms, and grants at JustServicesPro.",
  alternates: { canonical: "https://justservices.pro/faqs" },
  openGraph: {
    title: "FAQs — JustServicesPro",
    description: "Answers to common questions about JustServicesPro's services.",
    url: "https://justservices.pro/faqs",
  },
};

export default function FAQsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
