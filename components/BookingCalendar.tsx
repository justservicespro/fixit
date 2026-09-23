// components/BookingCalendar.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, Icon, Input, Sel, PBtn } from "@/components/ui";
import { notifyAdmin, notifyUser } from "@/lib/notify";
import { C, WHATSAPP, CAC_RC, SERVICES_LIST, Booking } from "@/lib/constants";

export default function BookingCalendar({ onBook }: { onBook?: (b: Booking) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selDay, setSelDay] = useState<number | null>(null);
  const [selTime, setSelTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", notes: "" });
  const [step, setStep] = useState<"date" | "time" | "form" | "done">("date");
  const [booked, setBooked] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing bookings from the DB so already-taken days show as booked,
  // instead of only tracking bookings made in this browser session.
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthLabel = months[month];
        const daysThisMonth = rows
          .filter((b) => b.date && b.date.includes(monthLabel) && b.date.includes(String(year)) && b.status !== "completed")
          .map((b) => parseInt(b.date.split(" ")[0]))
          .filter((n) => !isNaN(n));
        setBooked(daysThisMonth);
      })
      .catch(() => {});
  }, [month, year]);

  const h = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = new Date(year, month + 1, 0).getDate();
  const first = new Date(year, month, 1).getDay();
  const cells = [...Array(first).fill(null), ...Array(days).fill(0).map((_, i) => i + 1)];
  const isPast = (d: number) => new Date(year, month, d) < today;

  const submit = async () => {
    if (!form.name || !form.email || !selTime) return;
    setSubmitting(true);
    const dateStr = `${selDay} ${months[month]} ${year}`;
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, service: form.service, date: dateStr, time: selTime, notes: form.notes }),
      });
      const data = await res.json();
      const b: Booking = { id: data.id || Date.now(), name: form.name, email: form.email, phone: form.phone, service: form.service, date: dateStr, time: selTime, notes: form.notes, status: "pending" };
      onBook?.(b);
      setBooked((x) => [...x, selDay!]);
      setStep("done");

      await notifyAdmin(
        `📅 New Booking — ${form.name}`,
        `New consultation booking received:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "N/A"}\nService: ${form.service || "Not specified"}\nDate: ${dateStr} at ${selTime}\nNotes: ${form.notes || "None"}\n\nPlease confirm this booking promptly.`,
        form.email
      );
      await notifyUser(
        form.email,
        "✅ Your JustServicesPro Booking is Confirmed!",
        `Hi ${form.name},\n\nYour consultation has been booked successfully!\n\nDetails:\n📅 Date: ${dateStr}\n⏰ Time: ${selTime}\n🎯 Service: ${form.service || "General Consultation"}\n\nOur team will reach out to confirm and prepare for your session.\n\nWhatsApp us anytime: ${WHATSAPP}\n\nBest regards,\nJustServicesPro Team\nRC: ${CAC_RC}`
      );
    } catch (e) {
      console.error("Booking submission failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      {step !== "done" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["date", "time", "form"] as const).map((s, i) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: ["date", "time", "form"].indexOf(step) >= i ? C.blueLt : C.border }} />
          ))}
        </div>
      )}
      {step === "date" && (
        <div>
          <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 20 }}>Pick a Date</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button
              onClick={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear((y) => y - 1);
                } else setMonth((m) => m - 1);
              }}
              style={{ background: C.offWht, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
            >
              <Icon n="arrowLeft" s={16} />
            </button>
            <span style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: C.dark }}>
              {months[month]} {year}
            </span>
            <button
              onClick={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear((y) => y + 1);
                } else setMonth((m) => m + 1);
              }}
              style={{ background: C.offWht, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
            >
              <Icon n="arrowRight" s={16} />
            </button>
          </div>
          <div className="cal-grid" style={{ marginBottom: 8 }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} style={{ textAlign: "center" as const, fontSize: 11, fontWeight: 700, color: C.slate, padding: "4px" }}>
                {d}
              </div>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((d, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!d || isPast(d) || booked.includes(d)) return;
                  setSelDay(d);
                  setStep("time");
                }}
                disabled={!d || isPast(d) || booked.includes(d)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  border: "1.5px solid",
                  borderColor: selDay === d ? C.blueLt : C.border,
                  background: selDay === d ? C.blueLt : isPast(d) || !d ? "transparent" : booked.includes(d) ? "#fee2e2" : "#fff",
                  color: selDay === d ? "#fff" : !d || isPast(d) ? "rgba(0,0,0,0.2)" : C.dark,
                  fontWeight: selDay === d ? 700 : 400,
                  fontSize: 13,
                  cursor: !d || isPast(d) || booked.includes(d) ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {d || ""}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === "time" && (
        <div>
          <button onClick={() => setStep("date")} style={{ background: "none", border: "none", color: C.blueLt, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon n="arrowLeft" s={14} /> Back
          </button>
          <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 6 }}>Pick a Time</h3>
          <p style={{ color: C.slate, fontSize: 13, marginBottom: 20 }}>
            {selDay} {months[month]} {year}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelTime(t);
                  setStep("form");
                }}
                style={{ padding: "12px 8px", borderRadius: 8, border: "1.5px solid", borderColor: selTime === t ? C.blueLt : C.border, background: selTime === t ? C.blueLt : "#fff", color: selTime === t ? "#fff" : C.dark, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === "form" && (
        <div>
          <button onClick={() => setStep("time")} style={{ background: "none", border: "none", color: C.blueLt, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon n="arrowLeft" s={14} /> Back
          </button>
          <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 4 }}>Your Details</h3>
          <p style={{ color: C.slate, fontSize: 13, marginBottom: 20 }}>
            {selDay} {months[month]} {year} at {selTime}
          </p>
          <Input label="Full Name *" value={form.name} onChange={h("name")} placeholder="John Doe" />
          <Input label="Email *" value={form.email} onChange={h("email")} placeholder="john@company.com" type="email" />
          <Input label="Phone" value={form.phone} onChange={h("phone")} placeholder="+234 800 000 0000" />
          <Sel label="Service Interested In" value={form.service} onChange={h("service")} options={["Select service...", ...SERVICES_LIST.map((s) => s.title)]} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.slate, display: "block", marginBottom: 6 }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={h("notes")} rows={3} placeholder="Tell us about your project..." style={{ width: "100%", background: C.offWht, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", fontSize: 14, color: C.dark, outline: "none", resize: "vertical" as const }} />
          </div>
          <PBtn onClick={submit} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} disabled={submitting || !form.name || !form.email}>
            {submitting ? "Booking…" : (<><Icon n="calendar" s={16} /> Confirm Booking</>)}
          </PBtn>
        </div>
      )}
      {step === "done" && (
        <div style={{ textAlign: "center" as const, padding: "32px 0" }}>
          <div style={{ width: 64, height: 64, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <span style={{ color: C.success }}>
              <Icon n="checkCircle" s={32} />
            </span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 22, color: C.dark, marginBottom: 8 }}>Booking Confirmed!</h3>
          <p style={{ color: C.slate, fontSize: 14, marginBottom: 24 }}>
            {selDay} {months[month]} {year} at {selTime}
          </p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ color: "#25D366", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
            <Icon n="whatsapp" s={16} /> Send us a WhatsApp too
          </a>
        </div>
      )}
    </Card>
  );
}
