// app/contact/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — JustServicesPro",
  description:
    "Book a free consultation, send us a message, or chat on WhatsApp — get in touch with JustServicesPro, Abuja's trusted business solutions partner.",
  alternates: { canonical: "https://justservices.pro/contact" },
  openGraph: {
    title: "Contact Us — JustServicesPro",
    description: "Book a free consultation or send us a message.",
    url: "https://justservices.pro/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
