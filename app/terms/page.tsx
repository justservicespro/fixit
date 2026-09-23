// app/terms/page.tsx
import { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalShell";
import { CAC_NAME, CAC_RC, EMAIL, PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service — JustServicesPro",
  description:
    "The terms governing use of JustServicesPro's business registration, consulting, website development, course, and platform services.",
  alternates: { canonical: "https://justservices.pro/terms" },
  openGraph: {
    title: "Terms of Service — JustServicesPro",
    description: "The terms governing use of JustServicesPro's services.",
    url: "https://justservices.pro/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell label="Legal" title="Terms of Service" lastUpdated="30 June 2026" currentPath="/terms">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using the JustServicesPro website and services, you agree to be bound by these Terms of
          Service. If you do not agree, please do not use our services. These terms apply to all visitors, clients,
          students, and users of our platforms.
        </p>
      </LegalSection>
      <LegalSection title="2. Our Services">
        <p>
          {CAC_NAME} (RC: {CAC_RC}) provides business and corporate solutions including but not limited to: business
          registration and compliance services (CAC, TIN, SCUML); website and application development; cloud
          management services; corporate administration and training; startup and business consulting; branding and
          digital marketing; AI and technology solutions; event and equipment solutions; and access to our digital
          platforms (WebMan, CertTrack, ProDoc, Appaholic, Processa, JustBuys, FixIt).
        </p>
      </LegalSection>
      <LegalSection title="3. Eligibility">
        <p>
          You must be at least 18 years old and have the legal capacity to enter into binding contracts to use our
          paid services. By using our services, you represent that you meet these requirements.
        </p>
      </LegalSection>
      <LegalSection title="4. Account Registration">
        <p>
          Certain services (Client Portal, Student Portal) require account registration. You are responsible for
          maintaining the confidentiality of your reference code/Student ID and for all activities under your
          account. Notify us immediately of any unauthorized use.
        </p>
      </LegalSection>
      <LegalSection title="5. Fees and Payment">
        <p>
          Prices for our services are listed on our website and quote calculator and are subject to change without
          prior notice for future engagements. All fees are quoted in Nigerian Naira (₦) unless otherwise stated,
          and are exclusive of applicable taxes (VAT at 7.5%) unless stated otherwise. Payment is processed via
          Paystack or Flutterwave. Full payment or an agreed deposit is required before service commencement, as
          specified at checkout.
        </p>
      </LegalSection>
      <LegalSection title="6. Service Delivery">
        <p>
          Timelines provided for service delivery (e.g. CAC registration, website development) are estimates and may
          vary due to factors outside our control, including third-party regulatory processing times (e.g. CAC,
          banks). We will communicate any significant delays promptly.
        </p>
      </LegalSection>
      <LegalSection title="7. Client Responsibilities">
        <p>
          You agree to provide accurate, complete, and timely information required for service delivery. Delays
          caused by incomplete or inaccurate information provided by you are not the responsibility of
          JustServicesPro.
        </p>
      </LegalSection>
      <LegalSection title="8. Intellectual Property">
        <p>
          All content on this website, including text, graphics, logos, and software, is the property of
          JustServicesPro or its licensors and is protected by applicable intellectual property laws. Deliverables
          created for clients (e.g. custom websites) are transferred to the client upon full payment, unless
          otherwise agreed in writing.
        </p>
      </LegalSection>
      <LegalSection title="9. Course Enrollment and Access">
        <p>
          Enrollment in JustServicesPro Academy courses requires payment of registration and/or course fees. Access
          to course content is granted upon successful payment confirmation. Certificates of completion are issued
          only after the course requirements are fulfilled and full payment is received.
        </p>
      </LegalSection>
      <LegalSection title="10. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, JustServicesPro shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of our services. Our total liability for any claim
          shall not exceed the amount paid by you for the specific service giving rise to the claim.
        </p>
      </LegalSection>
      <LegalSection title="11. Disclaimer of Warranties">
        <p>
          Our services are provided "as is" without warranties of any kind, express or implied. We do not guarantee
          specific business outcomes (e.g. grant approval, loan approval) as these depend on third-party decisions
          outside our control.
        </p>
      </LegalSection>
      <LegalSection title="12. Termination">
        <p>
          We reserve the right to suspend or terminate access to our services for violations of these terms,
          fraudulent activity, or non-payment, without prior notice where necessary.
        </p>
      </LegalSection>
      <LegalSection title="13. Governing Law">
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising shall be
          subject to the exclusive jurisdiction of the courts of the Federal Capital Territory, Abuja.
        </p>
      </LegalSection>
      <LegalSection title="14. Changes to Terms">
        <p>
          We may revise these Terms periodically. Continued use of our services after changes constitutes acceptance
          of the revised Terms.
        </p>
      </LegalSection>
      <LegalSection title="15. Contact Information">
        <p>
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
