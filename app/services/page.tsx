// app/services/page.tsx
"use client";
import { PH, Reveal, Icon } from "@/components/ui";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { usePayment } from "@/lib/PaymentContext";
import { C, SERVICES_LIST } from "@/lib/constants";

export default function ServicesPage() {
  const { openPayment } = usePayment();
  return (
    <>
      <SiteNavbar current="/services" />
      <div style={{ paddingTop: 106 }}>
        <PH label="Services" title={<>Complete Business <span style={{ color: "#93C5FD" }}>Solutions</span></>} sub="One partner. Every solution your business needs to register, grow, and scale." />
        <section style={{ background: C.offWht, padding: "clamp(44px,7vw,70px) clamp(16px,4vw,32px)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="sg">
              {SERVICES_LIST.map((s, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="sc" style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", border: `1px solid ${C.border}`, height: "100%", display: "flex", flexDirection: "column" as const }}>
                    <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.03))", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, border: "1px solid rgba(37,99,235,0.15)" }}>
                      <span style={{ color: C.blue }}>
                        <Icon n={s.icon} s={22} />
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 16, fontWeight: 700, color: C.dark, margin: "0 0 10px" }}>{s.title}</h3>
                    <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.75, margin: "0 0 14px", flex: 1 }}>{s.desc}</p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 14 }}>
                      {s.tags.map((t) => (
                        <span key={t} style={{ fontSize: 10, background: C.accent, color: C.blue, padding: "2px 9px", borderRadius: 20, fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.blueLt, marginBottom: 14 }}>From ₦{s.basePrice.toLocaleString()}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                      <a href="/contact" style={{ background: "none", border: `1.5px solid ${C.blueLt}`, borderRadius: 6, color: C.blueLt, fontWeight: 700, fontSize: 12, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                        Enquire <Icon n="arrowRight" s={12} />
                      </a>
                      <button onClick={() => openPayment({ amount: s.basePrice, title: s.title })} style={{ background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, border: "none", borderRadius: 6, color: "#fff", fontWeight: 700, fontSize: 12, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon n="creditCard" s={12} /> Pay Now
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
