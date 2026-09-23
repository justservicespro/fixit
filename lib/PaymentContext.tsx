// lib/PaymentContext.tsx
"use client";
import { createContext, useContext, useState, useCallback } from "react";
import PaymentModal from "@/components/PaymentModal";
import { Icon, PBtn } from "@/components/ui";
import { C, WHATSAPP } from "@/lib/constants";

type PaymentRequest = { amount: number; title: string; depositMode?: boolean };
type PaymentContextValue = {
  openPayment: (req: PaymentRequest) => void;
};

const PaymentContext = createContext<PaymentContextValue | null>(null);

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within a PaymentProvider");
  return ctx;
}

function PaymentResultBanner({ result, onClose }: { result: "success" | "cancelled" | "failed"; onClose: () => void }) {
  const cfg = {
    success: { icon: "checkCircle", color: C.success, title: "Payment Successful!", msg: "Thank you! We've received your payment and will reach out within 2 hours to get started." },
    cancelled: { icon: "x", color: C.slate, title: "Payment Cancelled", msg: "You cancelled the checkout. No charge was made — feel free to try again whenever you're ready." },
    failed: { icon: "x", color: "#DC2626", title: "Payment Failed", msg: "Something went wrong and we couldn't confirm this payment. If you were charged, please contact us with your reference and we'll sort it out right away." },
  }[result];
  return (
    <div style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 420, textAlign: "center" as const, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 64, height: 64, background: `${cfg.color}18`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ color: cfg.color }}><Icon n={cfg.icon} s={32} /></span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: C.dark, fontSize: 20, marginBottom: 10 }}>{cfg.title}</h3>
        <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{cfg.msg}</p>
        <PBtn onClick={onClose} style={{ width: "100%" }}>Continue</PBtn>
        {result === "failed" && (
          <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 12, color: C.blueLt, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Contact us on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [paymentResult, setPaymentResult] = useState<"success" | "cancelled" | "failed" | null>(null);

  // Detect old-style ?payment-success / hash-based redirects landing on a
  // non-home real-route page (e.g. if a user starts checkout from /grants).
  useState(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash === "payment-success" || hash === "payment-cancelled" || hash === "payment-failed") {
      setPaymentResult(hash.replace("payment-", "") as "success" | "cancelled" | "failed");
      try {
        window.history.replaceState(null, "", window.location.pathname);
      } catch (e) {}
    }
    return null;
  });

  const openPayment = useCallback((req: PaymentRequest) => setPayment(req), []);

  return (
    <PaymentContext.Provider value={{ openPayment }}>
      {children}
      {payment && (
        <PaymentModal
          amount={payment.amount}
          title={payment.title}
          depositMode={payment.depositMode}
          onClose={() => setPayment(null)}
          onSuccess={() => {
            setTimeout(() => setPayment(null), 3500);
          }}
        />
      )}
      {paymentResult && <PaymentResultBanner result={paymentResult} onClose={() => setPaymentResult(null)} />}
    </PaymentContext.Provider>
  );
}
