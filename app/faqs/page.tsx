// app/faqs/page.tsx
"use client";
import { useState } from "react";
import { PH, Icon } from "@/components/ui";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { C, CAC_NAME, CAC_RC } from "@/lib/constants";

const FAQS = [
  { q: "How long does CAC registration take?", a: "Typically 5-10 working days. We handle the full process end-to-end." },
  { q: "Do you serve clients outside Nigeria?", a: "Yes. We work with African diaspora clients and international businesses expanding into Nigeria." },
  { q: "What is included in a website package?", a: "Design, development, hosting setup, mobile responsiveness, SEO basics, and 30-day post-launch support." },
  { q: "How do I book a consultation?", a: "Use our calendar booking system, fill the contact form, or message us directly on WhatsApp." },
  { q: "What are your digital products?", a: "We have 7 platforms: WebMan (website hosting), CertTrack (certificates), ProDoc (business documents), Appaholic (mobile apps), Processa (free online tools), JustBuys (marketplace), and FixIt (repair booking). Visit our Products page!" },
  { q: "Can you help access government grants?", a: "Absolutely. Check our Grants Database and we can help you apply with a 97% success rate." },
  { q: "Is JustServicesPro registered?", a: `Yes. We are ${CAC_NAME}, RC Number ${CAC_RC}, registered with the CAC under CAMA.` },
];

export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <SiteNavbar current="/faqs" />
      <div style={{ paddingTop: 106 }}>
      <PH
        label="FAQs"
        title={
          <>
            Got Questions?
            <br />
            <span style={{ color: "#93C5FD" }}>We Have Answers.</span>
          </>
        }
        sub="Everything you need to know about JustServicesPro."
      />
      <section style={{ background: "#fff", padding: "clamp(44px,7vw,70px) clamp(16px,4vw,32px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
              >
                <span style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 15, color: C.dark }}>{f.q}</span>
                <span
                  style={{
                    color: C.blueLt,
                    transform: open === i ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    marginLeft: 14,
                    flexShrink: 0,
                  }}
                >
                  <Icon n="chevronDown" s={18} />
                </span>
              </button>
              {open === i && <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.8, paddingBottom: 18 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
      </div>
      <SiteFooter />
    </>
  );
}
