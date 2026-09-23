// app/calculator/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instant Business Quote Calculator — JustServicesPro",
  description:
    "Get an instant price estimate for CAC registration, website development, consulting, and more — select your services and see your quote in real time.",
  alternates: { canonical: "https://justservices.pro/calculator" },
  openGraph: {
    title: "Instant Business Quote Calculator — JustServicesPro",
    description: "Get an instant price estimate for our business services.",
    url: "https://justservices.pro/calculator",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
