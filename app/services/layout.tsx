// app/services/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services — JustServicesPro",
  description:
    "Business registration, website development, cloud services, consulting, branding, AI solutions, and more — complete business solutions from JustServicesPro, Abuja.",
  alternates: { canonical: "https://justservices.pro/services" },
  openGraph: {
    title: "Our Services — JustServicesPro",
    description: "Complete business solutions to register, grow, and scale your business.",
    url: "https://justservices.pro/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
