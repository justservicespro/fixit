import type { Metadata } from "next";
import "./globals.css";
import { PaymentProvider } from "@/lib/PaymentContext";

export const metadata: Metadata = {
  title: "JustServicesPro — Business & Corporate Solutions Nigeria",
  description:
    "Nigeria's trusted partner for CAC registration, websites, cloud services, business consulting, grants, courses and more. RC: 7965265 · Based in Abuja.",
  keywords: [
    "business registration Nigeria",
    "CAC registration Abuja",
    "website development Nigeria",
    "cloud management Nigeria",
    "business consulting Abuja",
    "grants for Nigerian businesses",
    "digital skills courses Nigeria",
    "JustServicesPro",
  ],
  authors: [{ name: "JustServicesPro Ltd" }],
  creator: "JustServicesPro Ltd",
  publisher: "JustServicesPro Ltd",
  metadataBase: new URL("https://justservices.pro"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://justservices.pro",
    siteName: "JustServicesPro",
    title: "JustServicesPro — Business & Corporate Solutions Nigeria",
    description:
      "Nigeria's trusted partner for CAC registration, websites, cloud services, business consulting, grants and more. RC: 7965265 · Based in Abuja.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "JustServicesPro — Business & Corporate Solutions Nigeria",
      },
    ],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    site: "@justservicespro",
    creator: "@justservicespro",
    title: "JustServicesPro — Business & Corporate Solutions Nigeria",
    description:
      "CAC Registration, Websites, Cloud, Grants, Courses & Business Consulting in Nigeria. RC: 7965265.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "JustServicesPro",
    legalName: "JustServicesPro Management and Consulting Ltd",
    url: "https://justservices.pro",
    logo: "https://justservices.pro/icon.png",
    image: "https://justservices.pro/icon.png",
    description:
      "Nigeria's trusted partner for CAC registration, websites, cloud services, business consulting, grants, courses and more.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abuja",
      addressCountry: "NG",
    },
    areaServed: "NG",
    priceRange: "₦₦",
    sameAs: [
      "https://www.facebook.com/Justservicespro/",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#0B1E3D" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body><PaymentProvider>{children}</PaymentProvider></body>
    </html>
  );
}
