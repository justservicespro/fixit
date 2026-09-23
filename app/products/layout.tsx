// app/products/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Digital Platforms — JustServicesPro",
  description:
    "Ten digital platforms extending JustServicesPro's core business services — Leadflo, CertTrack, OrgNexus, DevTrac, ProDoc, Processa, WebMan, Appaholic, JustBuys, and FixIt.",
  alternates: { canonical: "https://justservices.pro/products" },
  openGraph: {
    title: "Our Digital Platforms — JustServicesPro",
    description: "Ten digital platforms extending our core business services.",
    url: "https://justservices.pro/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
