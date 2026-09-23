// app/privacy/page.tsx
import { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalShell";
import { CAC_NAME, CAC_RC, EMAIL, PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy — JustServicesPro",
  description:
    "How JustServicesPro Management and Consulting Ltd collects, uses, and protects your personal data, in compliance with the Nigeria Data Protection Act (NDPA) 2023.",
  alternates: { canonical: "https://justservices.pro/privacy" },
  openGraph: {
    title: "Privacy Policy — JustServicesPro",
    description: "How we collect, use, and protect your personal data, in compliance with the NDPA 2023.",
    url: "https://justservices.pro/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell label="Legal" title="Privacy Policy" lastUpdated="30 June 2026" currentPath="/privacy">
      <LegalSection title="1. Introduction">
        <p>
          JustServicesPro Management and Consulting Ltd ("JustServicesPro," "we," "us," or "our"), RC: {CAC_RC},
          respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you visit our website or use our services,
          in compliance with the Nigeria Data Protection Act (NDPA) 2023 and applicable regulations.
        </p>
      </LegalSection>
      <LegalSection title="2. Information We Collect">
        <p>We may collect the following categories of information:</p>
        <p style={{ marginTop: 8 }}>
          <strong>Personal identification information:</strong> Name, email address, phone number, company name, and
          physical address provided when you fill out forms, book consultations, enroll in courses, or register for
          our client/student portals.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Payment information:</strong> Transaction details processed through our payment partners (Paystack
          and Flutterwave). We do not store your full card details on our servers.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Usage data:</strong> Pages visited, time spent, browser type, device information, and IP address
          collected automatically via cookies and analytics tools.
        </p>
      </LegalSection>
      <LegalSection title="3. How We Use Your Information">
        <p>
          We use collected information to: provide and manage our services; process payments and bookings;
          communicate with you about your projects, courses, or enquiries; send service-related notifications and
          updates; improve our website and services; comply with legal obligations; and prevent fraud or misuse of
          our platform.
        </p>
      </LegalSection>
      <LegalSection title="4. Legal Basis for Processing">
        <p>
          We process your personal data based on: your consent (e.g. when submitting a contact form); the necessity
          to perform a contract (e.g. delivering paid services); compliance with legal obligations; and our
          legitimate business interests, provided these do not override your fundamental rights.
        </p>
      </LegalSection>
      <LegalSection title="5. Data Sharing and Disclosure">
        <p>
          We do not sell your personal data. We may share information with: payment processors (Paystack,
          Flutterwave) to complete transactions; email service providers to send notifications; government or
          regulatory authorities where legally required; and professional advisors (lawyers, accountants) under
          confidentiality obligations.
        </p>
      </LegalSection>
      <LegalSection title="6. Data Retention">
        <p>
          We retain personal data only for as long as necessary to fulfil the purposes outlined in this policy,
          comply with legal obligations, resolve disputes, and enforce our agreements. Client and student records
          are typically retained for the duration of the business relationship plus 6 years for tax and regulatory
          purposes.
        </p>
      </LegalSection>
      <LegalSection title="7. Your Rights">
        <p>
          Under the NDPA, you have the right to: access the personal data we hold about you; request correction of
          inaccurate data; request deletion of your data, subject to legal retention requirements; object to or
          restrict certain processing; and withdraw consent at any time. To exercise these rights, contact us at{" "}
          {EMAIL}.
        </p>
      </LegalSection>
      <LegalSection title="8. Data Security">
        <p>
          We implement industry-standard technical and organizational measures to protect your data, including
          encrypted connections (SSL/TLS), secure payment gateways, and restricted access to personal data. However,
          no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>
      <LegalSection title="9. Cookies">
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
          remember your preferences. You can control cookie settings through your browser. See our Cookie Notice for
          more details.
        </p>
      </LegalSection>
      <LegalSection title="10. Third-Party Links">
        <p>
          Our website may contain links to third-party sites including our digital platforms (WebMan, CertTrack,
          ProDoc, Appaholic, Processa, JustBuys, FixIt). We are not responsible for the privacy practices of these
          external sites.
        </p>
      </LegalSection>
      <LegalSection title="11. Children's Privacy">
        <p>
          Our services are not directed at individuals under 18. We do not knowingly collect personal data from
          children. If you believe we have inadvertently collected such data, please contact us immediately.
        </p>
      </LegalSection>
      <LegalSection title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. Changes will be posted on this page with an updated
          revision date. Continued use of our website after changes constitutes acceptance of the revised policy.
        </p>
      </LegalSection>
      <LegalSection title="13. Contact Us">
        <p>For questions or concerns about this Privacy Policy or our data practices, contact us at:</p>
        <p style={{ marginTop: 8 }}>
          {CAC_NAME}
          <br />
          RC: {CAC_RC}
          <br />
          Abuja, Nigeria
          <br />
          Email: {EMAIL}
          <br />
          Phone: {PHONE}
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
