// components/PaymentModal.tsx
"use client";
import { useState, useEffect } from "react";
import { Icon, PBtn, Input } from "@/components/ui";
import { notifyAdmin, notifyUser } from "@/lib/notify";
import { C, WHATSAPP } from "@/lib/constants";

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_live_REPLACE_WITH_YOUR_KEY";

export default function PaymentModal({
  amount,
  title,
  onClose,
  onSuccess,
  depositMode = false,
}: {
  amount: number;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
  depositMode?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payFull, setPayFull] = useState(!depositMode);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [method, setMethod] = useState<"paystack" | "flutterwave">("paystack");
  const [flwLink, setFlwLink] = useState("");
  const txRef = `JSP-${Date.now()}`;
  const payAmount = payFull ? amount : Math.round(amount * 0.5);

  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) return;
    const s = document.createElement("script");
    s.id = "paystack-inline-script";
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const payWithPaystack = () => {
    setErr("");
    setProcessing(true);
    const startPaystack = () => {
      const h = (window as any).PaystackPop?.setup({
        key: PAYSTACK_KEY,
        email,
        name,
        phone,
        amount: payAmount * 100,
        currency: "NGN",
        ref: txRef,
        callback: (response: any) => {
          setProcessing(false);
          setDone(true);
          onSuccess();
          notifyAdmin(
            `💳 Payment Received — ${name} — ₦${payAmount.toLocaleString()}`,
            `Paystack payment successful:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nAmount: ₦${payAmount.toLocaleString()}\nService: ${title}\nRef: ${txRef}\nGateway: Paystack`,
            email
          );
          notifyUser(
            email,
            "✅ Payment Confirmed — JustServicesPro",
            `Hi ${name},\n\nYour payment has been received!\n\nAmount: ₦${payAmount.toLocaleString()}\nService: ${title}\nRef: ${txRef}\n\nOur team will contact you within 2 hours to get started.\n\nWhatsApp: ${WHATSAPP}\n\nJustServicesPro Team`
          );
        },
        onClose: () => setProcessing(false),
      });
      if (!h) {
        setErr("Paystack failed to load. Try Flutterwave instead.");
        setProcessing(false);
        return;
      }
      h.openIframe();
    };
    if ((window as any).PaystackPop) {
      startPaystack();
      return;
    }
    const existing = document.getElementById("paystack-inline-script") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", startPaystack, { once: true });
      existing.addEventListener(
        "error",
        () => {
          setErr("Paystack failed to load. Try Flutterwave instead.");
          setProcessing(false);
        },
        { once: true }
      );
    } else {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v1/inline.js";
      s.onload = startPaystack;
      s.onerror = () => {
        setErr("Paystack failed to load. Try Flutterwave instead.");
        setProcessing(false);
      };
      document.head.appendChild(s);
    }
  };

  const payWithFlutterwave = async () => {
    setErr("");
    if (!email || !name) {
      setErr("Please enter your name and email.");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch("/api/flutterwave/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payAmount, email, name, phone, title, tx_ref: txRef }),
      });
      const data = await res.json();
      if (!res.ok || !data.link) {
        setErr(data.error || "Could not start Flutterwave checkout. Please try Paystack instead.");
        setProcessing(false);
        return;
      }
      // Render Flutterwave's hosted checkout inside an embedded iframe overlay
      // (instead of a full-page redirect) so the user stays on this page. This
      // keeps the "Standard" checkout flow's resilience to unstable connections
      // (a real page load inside the iframe, not a persistent XHR/socket) while
      // avoiding navigating the whole site away.
      setFlwLink(data.link);
      setProcessing(false);
    } catch (e) {
      setErr("Network error reaching our server. Please check your connection and try again.");
      setProcessing(false);
    }
  };

  const handleFlwIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const win = e.currentTarget.contentWindow;
      const href = win?.location?.href || "";
      if (href.includes("payment-success")) {
        setFlwLink("");
        setDone(true);
        onSuccess();
        notifyAdmin(
          `💳 Payment Received — ${name} — ₦${payAmount.toLocaleString()}`,
          `Flutterwave payment successful:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nAmount: ₦${payAmount.toLocaleString()}\nService: ${title}\nRef: ${txRef}\nGateway: Flutterwave`,
          email
        );
        notifyUser(
          email,
          "✅ Payment Confirmed — JustServicesPro",
          `Hi ${name},\n\nYour payment has been received!\n\nAmount: ₦${payAmount.toLocaleString()}\nService: ${title}\nRef: ${txRef}\n\nOur team will contact you within 2 hours.\n\nWhatsApp: ${WHATSAPP}\n\nJustServicesPro Team`
        );
      } else if (href.includes("payment-cancelled")) {
        setFlwLink("");
        setErr("Payment was cancelled.");
      } else if (href.includes("payment-failed")) {
        setFlwLink("");
        setErr("Payment could not be completed. Please try again or use Paystack.");
      }
    } catch (_) {
      // Cross-origin (still on Flutterwave's checkout pages) — expected, ignore.
    }
  };

  const pay = () => {
    if (!email || !name) {
      setErr("Please enter your name and email.");
      return;
    }
    method === "paystack" ? payWithPaystack() : payWithFlutterwave();
  };

  return (
    <div
      style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" style={{ background: "#fff", borderRadius: 20, padding: flwLink ? 0 : "clamp(24px,5vw,40px)", width: "100%", maxWidth: flwLink ? 520 : 460, position: "relative" as const, boxShadow: "0 24px 80px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: flwLink ? ("hidden" as const) : ("auto" as const) }}>
        {!flwLink && (
          <button onClick={onClose} style={{ position: "absolute" as const, top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: C.slate }}>
            <Icon n="x" s={20} />
          </button>
        )}
        {flwLink ? (
          <div style={{ position: "relative" as const }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: C.dark, fontFamily: "'Playfair Display'" }}>Complete Payment</span>
              <button
                onClick={() => {
                  setFlwLink("");
                }}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.slate }}
              >
                <Icon n="x" s={18} />
              </button>
            </div>
            <iframe src={flwLink} onLoad={handleFlwIframeLoad} style={{ width: "100%", height: "70vh", border: "none", display: "block" }} title="Flutterwave Checkout" />
          </div>
        ) : done ? (
          <div style={{ textAlign: "center" as const, padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, background: "rgba(16,185,129,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span style={{ color: C.success }}>
                <Icon n="checkCircle" s={32} />
              </span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: C.dark, fontSize: 20, marginBottom: 8 }}>Payment Successful!</h3>
            <p style={{ color: C.slate, fontSize: 14 }}>Ref: {txRef}. Our team will contact you within 2 hours.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff" }}>
                  <Icon n="creditCard" s={22} />
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: C.dark, fontSize: 15 }}>{title}</div>
                <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: C.blueLt, fontSize: 22 }}>₦{amount.toLocaleString()}</div>
              </div>
            </div>
            {depositMode && (
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[
                  [true, "Full Payment", "₦" + amount.toLocaleString()],
                  [false, "50% Deposit", "₦" + Math.round(amount * 0.5).toLocaleString()],
                ].map(([full, label, val]: any) => (
                  <button
                    key={label}
                    onClick={() => setPayFull(full)}
                    style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid", borderColor: payFull === full ? C.blueLt : C.border, background: payFull === full ? C.accent : "#fff", fontWeight: 700, fontSize: 12, color: payFull === full ? C.blueLt : C.slate, cursor: "pointer" }}
                  >
                    <div>{label}</div>
                    <div style={{ fontSize: 14, fontFamily: "'Playfair Display'", fontWeight: 800, color: payFull === full ? C.blueLt : C.dark, marginTop: 2 }}>{val}</div>
                  </button>
                ))}
              </div>
            )}
            <Input label="Full Name *" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="John Doe" />
            <Input label="Email Address *" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="john@company.com" type="email" />
            <Input label="Phone Number" value={phone} onChange={(e: any) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.slate, display: "block", marginBottom: 8 }}>Payment Gateway</label>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setMethod("paystack")} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid", borderColor: method === "paystack" ? C.blueLt : C.border, background: method === "paystack" ? C.accent : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: method === "paystack" ? C.blueLt : C.slate }}>🏦 Paystack</span>
                </button>
                <button onClick={() => setMethod("flutterwave")} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid", borderColor: method === "flutterwave" ? "#F5A623" : C.border, background: method === "flutterwave" ? "#FFF8ED" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: method === "flutterwave" ? "#F5A623" : C.slate }}>🦋 Flutterwave</span>
                </button>
              </div>
            </div>
            {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#DC2626", fontSize: 13, fontWeight: 600 }}>{err}</div>}
            <div style={{ background: C.offWht, borderRadius: 10, padding: "11px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.success }}>
                <Icon n="shield" s={15} />
              </span>
              <span style={{ fontSize: 12, color: C.slate }}>
                Secured by <strong>{method === "paystack" ? "Paystack" : "Flutterwave"}</strong> · Cards, Bank Transfer & USSD
              </span>
            </div>
            <PBtn onClick={pay} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} disabled={processing || !name || !email}>
              {processing ? "Processing…" : (
                <>
                  <Icon n="creditCard" s={16} /> Pay ₦{payAmount.toLocaleString()}
                  {!payFull ? " (Deposit)" : ""}
                </>
              )}
            </PBtn>
          </div>
        )}
      </div>
    </div>
  );
}
