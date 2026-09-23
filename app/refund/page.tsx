// app/refund/page.tsx
import { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalShell";
import { CAC_NAME, CAC_RC, EMAIL, PHONE, WHATSAPP, C } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — JustServicesPro",
  description:
    "Refund and cancellation terms for business registration, website development, consulting, courses, and digital products purchased from JustServicesPro.",
  alternates: { canonical: "https://justservices.pro/refund" },
  openGraph: {
    title: "Refund & Cancellation Policy — JustServicesPro",
    description: "Refund and cancellation terms for JustServicesPro's services.",
    url: "https://justservices.pro/refund",
  },
};

export default function RefundPage() {
  return (
    <LegalPageShell label="Legal" title="Refund & Cancellation Policy" lastUpdated="30 June 2026" currentPath="/refund">
      <LegalSection title="1. Overview">
        <p>
          This policy outlines the terms under which JustServicesPro Management and Consulting Ltd (RC: {CAC_RC})
          processes refunds and cancellations for services purchased through our website, including business
          registration, website development, consulting, courses, and digital products.
        </p>
      </LegalSection>
      <LegalSection title="2. General Refund Principles">
        <p>
          Due to the nature of professional services — which often involve immediate commencement of work,
          third-party fees (e.g. CAC filing fees), and resource allocation — refund eligibility varies by service
          type as detailed below.
        </p>
      </LegalSection>
      <LegalSection title="3. Business Registration & Compliance Services">
        <p>
          Once a CAC application, TIN registration, or similar regulatory filing has been submitted to the relevant
          government agency, fees are <strong>non-refundable</strong>, as third-party statutory fees are
          non-recoverable. If you cancel before submission, we will refund fees minus a 15% administrative
          processing charge.
        </p>
      </LegalSection>
      <LegalSection title="4. Website & App Development">
        <p>
          A deposit (typically 50%) secures your project slot and covers initial design/discovery work — this is{" "}
          <strong>non-refundable</strong> once work has commenced. If you cancel before any work begins, the deposit
          is refundable minus a 10% administrative fee. Final payments are due upon delivery and are non-refundable
          once the deliverable has been approved and handed over.
        </p>
      </LegalSection>
      <LegalSection title="5. Consulting & Advisory Services">
        <p>
          Consultation fees are non-refundable once the session has been conducted. If you need to reschedule,
          please notify us at least 24 hours in advance via WhatsApp or email.
        </p>
      </LegalSection>
      <LegalSection title="6. Course Enrollment (JustServicesPro Academy)">
        <p>
          <strong>Registration fees</strong> are non-refundable once paid, as they secure your seat and cover
          administrative costs.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Course fees:</strong> Full refund if cancellation is requested at least 7 days before the course
          start date. 50% refund if cancelled between 3–6 days before start. No refund if cancelled within 48 hours
          of the course start date or after course materials have been accessed.
        </p>
      </LegalSection>
      <LegalSection title="7. Digital Products & Marketplace (JustBuys, Shop)">
        <p>
          Digital products (templates, business plans, ready-made websites) are non-refundable once
          delivered/downloaded, due to their immediately reproducible nature. Physical gadgets/equipment may be
          returned within 7 days if unopened and in original condition, subject to a restocking fee.
        </p>
      </LegalSection>
      <LegalSection title="8. Subscription & Platform Services">
        <p>
          For ongoing platform services (WebMan hosting, CertTrack, ProDoc, Processa, FixIt subscriptions),
          cancellation takes effect at the end of the current billing cycle. We do not provide prorated refunds for
          partial billing periods, except where required by law.
        </p>
      </LegalSection>
      <LegalSection title="9. How to Request a Refund">
        <p>
          To request a refund, contact us at {EMAIL} or via WhatsApp ({PHONE}) with your payment reference, service
          details, and reason for the request. Approved refunds are processed within 7–14 business days to the
          original payment method via Paystack or Flutterwave.
        </p>
      </LegalSection>
      <LegalSection title="10. Disputed or Failed Transactions">
        <p>
          If a payment was charged but the service was not rendered due to a technical error, contact us immediately
          with your transaction reference for investigation and resolution.
        </p>
      </LegalSection>
      <LegalSection title="11. Chargebacks">
        <p>
          We encourage clients to contact us directly to resolve any billing concerns before initiating a chargeback
          with your bank or card issuer. Unwarranted chargebacks may result in suspension of services.
        </p>
      </LegalSection>
      <LegalSection title="12. Changes to This Policy">
        <p>
          We reserve the right to update this Refund Policy at any time. The policy in effect at the time of your
          purchase governs that transaction.
        </p>
      </LegalSection>
      <LegalSection title="13. Contact Us">
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
          <br />
          WhatsApp:{" "}
          <a href={WHATSAPP} style={{ color: C.blueLt }}>
            Chat with us
          </a>
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
