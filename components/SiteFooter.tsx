// components/SiteFooter.tsx
import { Icon } from "@/components/ui";
import { C, CAC_NAME, CAC_RC, PHONE, EMAIL, WHATSAPP, SUCCESS_RATE } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer style={{ background: C.navyDk, padding: "clamp(48px,7vw,72px) clamp(16px,4vw,32px) 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="fg" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <img src="/icon.png" alt="JSP" style={{ width: 50, height: 50, objectFit: "contain" as const, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 14, color: "#fff" }}>JustServicesPro Ltd</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>connecting opportunities!</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.8, maxWidth: 240 }}>
              Your trusted business solutions partner. Helping startups, SMEs and organizations establish, manage and scale.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: "#fff", fontSize: 13, marginBottom: 16 }}>Quick Links</div>
            {[
              ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Products", "/products"],
              ["Blog", "/blog"], ["Contact", "/contact"], ["FAQs", "/faqs"],
            ].map(([l, href]) => (
              <a key={href} href={href} style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 9, cursor: "pointer", textDecoration: "none" }} className="nl">
                {l}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: "#fff", fontSize: 13, marginBottom: 16 }}>Resources</div>
            {[
              ["Courses", "/#courses"], ["Student Portal", "/#studentportal"], ["Shop", "/#shop"],
              ["Quote Calculator", "/calculator"], ["Grants Database", "/grants"], ["Case Studies", "/case-studies"], ["Client Portal", "/#portal"],
            ].map(([l, href]) => (
              <a key={href} href={href} style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 9, cursor: "pointer", textDecoration: "none" }} className="nl">
                {l}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: "#fff", fontSize: 13, marginBottom: 16 }}>Contact</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 2.1 }}>
              <div>📞 {PHONE}</div>
              <div>✉️ {EMAIL}</div>
              <div>📍 Abuja, Nigeria</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ color: C.steel }}>
                  <Icon n="shield" s={13} />
                </span>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>CAC RC: {CAC_RC}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ color: C.success }}>
                  <Icon n="award" s={13} />
                </span>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{SUCCESS_RATE} Success Rate</span>
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>© {new Date().getFullYear()} {CAC_NAME}</div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, justifyContent: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund"]].map(([l, href]) => (
              <a key={href} href={href} className="nl" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, cursor: "pointer", textDecoration: "none" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
      <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" style={{ position: "fixed" as const, bottom: 28, right: 28, zIndex: 9997, width: 52, height: 52, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.5)" }}>
        <span style={{ color: "#fff" }}>
          <Icon n="whatsapp" s={26} />
        </span>
      </a>
    </footer>
  );
}
