// app/contact/page.tsx
"use client";
import { useState } from "react";
import { PH, Card, Icon, Input, Sel, PBtn } from "@/components/ui";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import BookingCalendar from "@/components/BookingCalendar";
import { useFormValidation } from "@/lib/hooks";
import { notifyAdmin, notifyUser } from "@/lib/notify";
import { C, EMAIL, PHONE, WHATSAPP, CAC_RC, SERVICES_LIST } from "@/lib/constants";

export default function ContactPage() {
  const [tab, setTab] = useState<"calendar" | "form">("calendar");
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const { errors, validate, clearError } = useFormValidation();
  const h = (k: string) => (e: any) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    clearError(k);
  };

  const submit = async () => {
    const nameOk = validate("name", form.name, { required: true });
    const emailOk = validate("email", form.email, { required: true, email: true });
    const phoneOk = validate("phone", form.phone, { phone: true });
    if (!nameOk || !emailOk || !phoneOk) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    await notifyAdmin(
      `📬 New Contact Form — ${form.name}`,
      `New message from website contact form:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "N/A"}\nService: ${form.service || "Not specified"}\nMessage:\n${form.message || "No message"}\n\nPlease respond within 24 hours.`,
      form.email
    );
    await notifyUser(
      form.email,
      "✅ We received your message — JustServicesPro",
      `Hi ${form.name},\n\nThank you for reaching out to JustServicesPro!\n\nWe have received your message and our team will respond within 24 hours (Mon-Fri, 8AM-6PM).\n\nFor urgent matters, WhatsApp us directly: ${WHATSAPP}\n\nYour enquiry reference: JSP-${Date.now().toString(36).toUpperCase()}\n\nBest regards,\nJustServicesPro Team\n${EMAIL} | ${PHONE}\nRC: ${CAC_RC}`
    );
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <>
      <SiteNavbar current="/contact" />
      <div style={{ paddingTop: 106 }}>
        <PH
          label="Contact Us"
          title={<>Let's Build Something<br /><span style={{ color: "#93C5FD" }}>Great Together</span></>}
          sub="Book a consultation, send an inquiry, or chat us on WhatsApp."
        />
        <section style={{ background: C.offWht, padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
              {[{ k: "calendar", l: "📅 Book Consultation" }, { k: "form", l: "📬 Send Message" }].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k as any)}
                  style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1.5px solid", borderColor: tab === t.k ? C.blueLt : C.border, background: tab === t.k ? C.blueLt : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", color: tab === t.k ? "#fff" : C.slate }}
                >
                  {t.l}
                </button>
              ))}
            </div>
            {tab === "calendar" && <BookingCalendar />}
            {tab === "form" && (
              <div className="tc" style={{ alignItems: "start" }}>
                <div>
                  {[
                    { icon: "phone", title: "Call Us", val: PHONE, href: `tel:+2348079926755` },
                    { icon: "mail", title: "Email Us", val: EMAIL, href: `mailto:${EMAIL}` },
                    { icon: "mapPin", title: "Location", val: "Abuja, Nigeria", href: "#" },
                    { icon: "whatsapp", title: "WhatsApp", val: "Direct chat", href: WHATSAPP },
                  ].map((ci, i) => (
                    <a key={i} href={ci.href} target="_blank" rel="noreferrer" style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 22, textDecoration: "none" }}>
                      <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.04))", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(37,99,235,0.15)" }}>
                        <span style={{ color: C.blue }}>
                          <Icon n={ci.icon} s={18} />
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 2, fontFamily: "'Playfair Display'" }}>{ci.title}</div>
                        <div style={{ color: C.slate, fontSize: 13 }}>{ci.val}</div>
                      </div>
                    </a>
                  ))}
                  <Card style={{ background: `linear-gradient(135deg,${C.navyDk},${C.navy})`, border: "none" }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: "#fff", marginBottom: 6, fontSize: 15 }}>Working Hours</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.85 }}>
                      Mon–Fri: 8AM–6PM · Sat: 9AM–2PM
                      <br />
                      Sunday: WhatsApp support only
                    </div>
                  </Card>
                </div>
                <Card>
                  {sent && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#15803d", fontWeight: 600, fontSize: 14 }}>Message sent! We'll respond within 24 hours.</div>}
                  <Input label="Full Name *" value={form.name} onChange={h("name")} onBlur={() => validate("name", form.name, { required: true })} placeholder="John Doe" error={errors.name} />
                  <Input label="Email *" value={form.email} onChange={h("email")} onBlur={() => validate("email", form.email, { required: true, email: true })} placeholder="john@company.com" type="email" error={errors.email} />
                  <Input label="Phone" value={form.phone} onChange={h("phone")} onBlur={() => validate("phone", form.phone, { phone: true })} placeholder="0801 234 5678" error={errors.phone} />
                  <Sel label="Service Needed" value={form.service} onChange={h("service")} options={["Select a service...", ...SERVICES_LIST.map((s) => s.title)]} />
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Message</label>
                    <textarea value={form.message} onChange={h("message")} rows={4} placeholder="Tell us about your project..." style={{ width: "100%", background: C.offWht, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 14, color: C.dark, outline: "none", resize: "vertical" as const }} />
                  </div>
                  <PBtn onClick={submit} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} disabled={!form.name || !form.email}>
                    <Icon n="send" s={15} /> Send Message
                  </PBtn>
                  <div style={{ textAlign: "center" as const, marginTop: 12 }}>
                    <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ color: "#25D366", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Icon n="whatsapp" s={14} /> Or chat on WhatsApp
                    </a>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
