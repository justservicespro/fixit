// app/calculator/page.tsx
"use client";
import { useState } from "react";
import { PH, Card, Sel, Icon, GBtn, PBtn, Input } from "@/components/ui";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { usePayment } from "@/lib/PaymentContext";
import { notifyAdmin, notifyUser } from "@/lib/notify";
import { C, EMAIL, PHONE, WHATSAPP, CAC_RC, SERVICES_LIST } from "@/lib/constants";

export default function CalculatorPage() {
  const { openPayment } = usePayment();
  const [sel, setSel] = useState<string[]>([]);
  const [cx, setCx] = useState("standard");
  const [tl, setTl] = useState("normal");
  const [copied, setCopied] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [subForm, setSubForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (s: string) => setSel((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const base = sel.reduce((a, s) => a + (SERVICES_LIST.find((x) => x.title === s)?.basePrice || 0), 0);
  const cm: Record<string, number> = { basic: 0.8, standard: 1, advanced: 1.4, enterprise: 1.8 };
  const tm: Record<string, number> = { rush: 1.3, normal: 1, flexible: 0.95 };
  const total = Math.round(base * cm[cx] * tm[tl]);
  const vat = Math.round(total * 0.075);
  const grand = total + vat;

  const copy = () => {
    navigator.clipboard?.writeText(
      `JustServicesPro Quote\nServices: ${sel.join(", ")}\nSubtotal: ₦${total.toLocaleString()}\nVAT: ₦${vat.toLocaleString()}\nTotal: ₦${grand.toLocaleString()}\nContact: ${EMAIL} | ${PHONE}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitQuote = async () => {
    if (!subForm.name || !subForm.email) return;
    setSubmitting(true);
    const serviceList = sel.map((s) => `  • ${s}`).join("\n");
    await notifyAdmin(
      `📋 New Quote Request — ${subForm.name} — ₦${grand.toLocaleString()}`,
      `New quote request submitted from website:\n\nName: ${subForm.name}\nEmail: ${subForm.email}\nPhone: ${subForm.phone || "N/A"}\n\nServices Selected:\n${serviceList}\n\nComplexity: ${cx}\nTimeline: ${tl}\n\nSubtotal: ₦${total.toLocaleString()}\nVAT (7.5%): ₦${vat.toLocaleString()}\nTotal: ₦${grand.toLocaleString()}\n\nPlease follow up promptly.`,
      subForm.email
    );
    await notifyUser(
      subForm.email,
      "✅ Your Quote Request — JustServicesPro",
      `Hi ${subForm.name},\n\nThank you for requesting a quote! Here's a summary:\n\nServices:\n${serviceList}\n\nSubtotal: ₦${total.toLocaleString()}\nVAT (7.5%): ₦${vat.toLocaleString()}\nTotal: ₦${grand.toLocaleString()}\n\nOur team will reach out within 24 hours to discuss your project and next steps.\n\nWhatsApp us anytime: ${WHATSAPP}\n\nBest regards,\nJustServicesPro Team\n${EMAIL} | ${PHONE}\nRC: ${CAC_RC}`
    );
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setShowSubmit(false);
      setSubmitted(false);
      setSubForm({ name: "", email: "", phone: "" });
    }, 3000);
  };

  return (
    <>
      <SiteNavbar current="/calculator" />
      <div style={{ paddingTop: 106 }}>
        <PH label="Quote Calculator" title={<>Instant <span style={{ color: "#93C5FD" }}>Business Quote</span></>} sub="Select services and get a price estimate instantly." />
        <section style={{ background: C.offWht, padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="tc" style={{ alignItems: "start" }}>
              <div>
                <Card style={{ marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, margin: "0 0 20px" }}>Select Services</h3>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                    {SERVICES_LIST.map((s) => (
                      <button
                        key={s.title}
                        onClick={() => toggle(s.title)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 10, border: "1.5px solid", borderColor: sel.includes(s.title) ? C.blueLt : C.border, background: sel.includes(s.title) ? C.accent : "#fff", cursor: "pointer", textAlign: "left" as const }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: sel.includes(s.title) ? C.blueLt : C.dark }}>{s.title}</div>
                          <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>From ₦{s.basePrice.toLocaleString()}</div>
                        </div>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid", borderColor: sel.includes(s.title) ? C.blueLt : C.border, background: sel.includes(s.title) ? C.blueLt : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {sel.includes(s.title) && <span style={{ color: "#fff" }}><Icon n="check" s={12} /></span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
                <Card>
                  <Sel label="Complexity" value={cx} onChange={(e: any) => setCx(e.target.value)} options={[{ value: "basic", label: "Basic" }, { value: "standard", label: "Standard" }, { value: "advanced", label: "Advanced (+40%)" }, { value: "enterprise", label: "Enterprise (+80%)" }]} />
                  <Sel label="Timeline" value={tl} onChange={(e: any) => setTl(e.target.value)} options={[{ value: "rush", label: "Rush (+30%)" }, { value: "normal", label: "Standard" }, { value: "flexible", label: "Flexible (-5%)" }]} />
                </Card>
              </div>
              <div style={{ position: "sticky" as const, top: 88 }}>
                <Card style={{ background: `linear-gradient(135deg,${C.navyDk},${C.navy})`, border: "none", marginBottom: 16 }}>
                  <div style={{ color: C.slateL, fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 20 }}>Your Quote</div>
                  {sel.length === 0 ? (
                    <div style={{ textAlign: "center" as const, padding: "32px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Select services to see your estimate</div>
                  ) : (
                    <div>
                      {sel.map((s) => {
                        const found = SERVICES_LIST.find((x) => x.title === s);
                        const price = Math.round((found?.basePrice || 0) * cm[cx] * tm[tl]);
                        return (
                          <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{s.split(" ").slice(0, 3).join(" ")}...</span>
                            <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>₦{price.toLocaleString()}</span>
                          </div>
                        );
                      })}
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                        <span style={{ color: C.slateL, fontSize: 13 }}>Subtotal</span>
                        <span style={{ color: "#fff", fontSize: 13 }}>₦{total.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", marginBottom: 12 }}>
                        <span style={{ color: C.slateL, fontSize: 13 }}>VAT (7.5%)</span>
                        <span style={{ color: "#fff", fontSize: 13 }}>₦{vat.toLocaleString()}</span>
                      </div>
                      <div style={{ background: "rgba(37,99,235,0.2)", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 14 }}>Total</span>
                        <span style={{ color: "#fff", fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 22 }}>₦{grand.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                        <GBtn onClick={() => setShowSubmit(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
                          <Icon n="send" s={16} /> Submit Quote Request
                        </GBtn>
                        <PBtn onClick={() => openPayment({ amount: grand, title: `Quote: ${sel.slice(0, 2).join(", ")}` })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
                          <Icon n="creditCard" s={16} /> Pay ₦{grand.toLocaleString()}
                        </PBtn>
                        <PBtn onClick={() => openPayment({ amount: Math.round(grand * 0.5), title: "50% Deposit" })} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: `linear-gradient(135deg,${C.success},${C.green})` }}>
                          <Icon n="creditCard" s={16} /> Pay 50% Deposit
                        </PBtn>
                        <PBtn onClick={() => window.open(WHATSAPP, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#25D366" }}>
                          <Icon n="whatsapp" s={16} /> Confirm on WhatsApp
                        </PBtn>
                        <button onClick={copy} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "11px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <Icon n="copy" s={14} /> {copied ? "Copied!" : "Copy Quote"}
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      {showSubmit && (
        <div
          style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget && !submitting) setShowSubmit(false); }}
        >
          <div className="modal-box" style={{ background: "#fff", borderRadius: 20, padding: "clamp(24px,5vw,36px) clamp(20px,5vw,40px)", width: "100%", maxWidth: 420, position: "relative" as const, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
            {!submitting && !submitted && (
              <button onClick={() => setShowSubmit(false)} style={{ position: "absolute" as const, top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: C.slate }}>
                <Icon n="x" s={20} />
              </button>
            )}
            {submitted ? (
              <div style={{ textAlign: "center" as const, padding: "20px 0" }}>
                <div style={{ width: 64, height: 64, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span style={{ color: C.success }}><Icon n="checkCircle" s={32} /></span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: C.dark, fontSize: 20, marginBottom: 8 }}>Quote Sent!</h3>
                <p style={{ color: C.slate, fontSize: 14 }}>We'll reach out within 24 hours. Check your email for a copy.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff" }}><Icon n="send" s={20} /></span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: C.dark, fontSize: 16 }}>Submit Quote Request</div>
                    <div style={{ color: C.blueLt, fontSize: 13, fontWeight: 700 }}>₦{grand.toLocaleString()}</div>
                  </div>
                </div>
                <Input label="Full Name *" value={subForm.name} onChange={(e: any) => setSubForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                <Input label="Email Address *" value={subForm.email} onChange={(e: any) => setSubForm((f) => ({ ...f, email: e.target.value }))} placeholder="john@company.com" type="email" />
                <Input label="Phone Number" value={subForm.phone} onChange={(e: any) => setSubForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+234 800 000 0000" />
                <PBtn onClick={submitQuote} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }} disabled={submitting || !subForm.name || !subForm.email}>
                  {submitting ? "Sending…" : <><Icon n="send" s={15} /> Send Quote Request</>}
                </PBtn>
              </div>
            )}
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
}
