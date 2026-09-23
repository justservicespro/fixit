// components/ProductBrandCard.tsx
"use client";

type BrandConfig = {
  bg: string;
  textColor: string;
  subTextColor: string;
  logoLetter: string;
  logoColor: string;
  logoTextColor?: string;
  nameParts: [string, string];
  namePart1Color: string;
  namePart2Color: string;
  domainLabel: string;
  tagLabel: string;
  tagColor: string;
  headingLines: { text: string; accent?: boolean }[];
  accentColor: string;
  description: string;
  orbitWords?: string[];
  medal?: boolean;
  ctaText: string;
  ctaDomain: string;
  ctaBg: string;
  ctaTextColor: string;
  cornerColor: string;
};

function OrbitBadge({ words, accentColor, logoColor, logoLetter, logoTextColor = "#fff", cornerColor }: { words: string[]; accentColor: string; logoColor: string; logoLetter: string; logoTextColor?: string; cornerColor: string }) {
  const id = `orbit-${logoLetter}-${Math.random().toString(36).slice(2, 7)}`;
  const text = words.join("   ·   ") + "   ·   ";
  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" style={{ maxWidth: 220 }}>
      <defs>
        <path id={id} d="M 110,110 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
      </defs>
      {[...Array(24)].map((_, i) => {
        const angle = (i / 24) * 360;
        const rad = (angle * Math.PI) / 180;
        const x1 = 110 + 96 * Math.cos(rad);
        const y1 = 110 + 96 * Math.sin(rad);
        const x2 = 110 + 104 * Math.cos(rad);
        const y2 = 110 + 104 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={cornerColor} strokeWidth="1.5" opacity="0.5" />;
      })}
      <circle cx="110" cy="110" r="80" fill="none" stroke={accentColor} strokeWidth="1" opacity="0.6" />
      <text fontSize="8.5" letterSpacing="2" fill={accentColor} fontFamily="monospace">
        <textPath href={`#${id}`} startOffset="0%">
          {text}
        </textPath>
      </text>
      <circle cx="110" cy="110" r="42" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
      <rect x="86" y="86" width="48" height="48" rx="12" fill={logoColor} />
      <text x="110" y="118" fontSize="24" fontWeight="800" fill={logoTextColor} textAnchor="middle" fontFamily="Georgia,serif">
        {logoLetter}
      </text>
    </svg>
  );
}

function MedalBadge({ accentColor }: { accentColor: string }) {
  const dots = [...Array(28)];
  return (
    <svg viewBox="0 0 220 220" width="100%" height="100%" style={{ maxWidth: 220 }}>
      {dots.map((_, i) => {
        const angle = (i / dots.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const x = 110 + 92 * Math.cos(rad);
        const y = 110 + 92 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="9" fill={accentColor} />;
      })}
      <circle cx="110" cy="110" r="78" fill={accentColor} />
      <circle cx="110" cy="110" r="66" fill="none" stroke="#0B1E3D" strokeWidth="1.5" opacity="0.35" />
      <path d="M 82 112 L 102 132 L 140 90" stroke="#0B1E3D" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductBrandCard({ c, compact = false }: { c: BrandConfig; compact?: boolean }) {
  if (!c) return null;
  if (compact) {
    // Uniform site palette — every card reads as one family, not nine different brands.
    const NAVY = "#0B1E3D";
    const BLUE = "#1A4A8A";
    const STEEL = "#3B82F6";
    const SLATE = "#64748B";
    const BORDER = "#E2E8F0";
    return (
      <div
        style={{
          background: "#ffffff",
          border: `1px solid ${BORDER}`,
          borderRadius: 16,
          padding: "28px 24px",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        {[
          { top: 10, left: 10, borderTop: `1.5px solid ${STEEL}`, borderLeft: `1.5px solid ${STEEL}` },
          { top: 10, right: 10, borderTop: `1.5px solid ${STEEL}`, borderRight: `1.5px solid ${STEEL}` },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute" as const, width: 18, height: 18, opacity: 0.5, ...s }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{c.logoLetter}</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: NAVY }}>
            {c.nameParts[0]}
            {c.nameParts[1]}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
          <div style={{ width: 16, height: 1.5, background: BLUE }} />
          <span style={{ fontSize: 9.5, letterSpacing: 1, color: BLUE, fontWeight: 700, fontFamily: "monospace" }}>{c.tagLabel}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, fontSize: 20, lineHeight: 1.2, margin: "0 0 8px" }}>
          {c.headingLines.map((l, i) => (
            <span key={i} style={{ color: l.accent ? STEEL : NAVY, display: "block" }}>
              {l.text}
            </span>
          ))}
        </h3>
        <p style={{ color: SLATE, fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{c.description}</p>
      </div>
    );
  }
  return (
    <div style={{ background: c.bg, borderRadius: 20, padding: "clamp(24px,4vw,44px)", position: "relative" as const, overflow: "hidden", minHeight: 380 }}>
      {/* corner brackets */}
      {[
        { top: 14, left: 14, borderTop: `1.5px solid ${c.cornerColor}`, borderLeft: `1.5px solid ${c.cornerColor}` },
        { top: 14, right: 14, borderTop: `1.5px solid ${c.cornerColor}`, borderRight: `1.5px solid ${c.cornerColor}` },
        { bottom: 14, left: 14, borderBottom: `1.5px solid ${c.cornerColor}`, borderLeft: `1.5px solid ${c.cornerColor}` },
        { bottom: 14, right: 14, borderBottom: `1.5px solid ${c.cornerColor}`, borderRight: `1.5px solid ${c.cornerColor}` },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute" as const, width: 26, height: 26, ...s }} />
      ))}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: c.logoColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: c.logoTextColor || "#fff", fontWeight: 800, fontSize: 14 }}>{c.logoLetter}</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            <span style={{ color: c.namePart1Color }}>{c.nameParts[0]}</span>
            <span style={{ color: c.namePart2Color }}>{c.nameParts[1]}</span>
          </span>
        </div>
        <span style={{ fontSize: 10, letterSpacing: 2, color: c.subTextColor, fontFamily: "monospace" }}>{c.domainLabel}</span>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" as const }}>
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 20, height: 1.5, background: c.tagColor }} />
            <span style={{ fontSize: 10.5, letterSpacing: 1.5, color: c.tagColor, fontWeight: 700, fontFamily: "monospace" }}>{c.tagLabel}</span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2.1rem)", lineHeight: 1.15, margin: "0 0 14px" }}>
            {c.headingLines.map((l, i) => (
              <span key={i} style={{ color: l.accent ? c.accentColor : c.textColor, display: "block" }}>
                {l.text}
              </span>
            ))}
          </h3>
          <p style={{ color: c.subTextColor, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{c.description}</p>
        </div>
        <div style={{ flex: "0 0 160px", display: "flex", justifyContent: "center" }}>
          {c.medal ? <MedalBadge accentColor={c.accentColor} /> : <OrbitBadge words={c.orbitWords || []} accentColor={c.accentColor} logoColor={c.logoColor} logoLetter={c.logoLetter} logoTextColor={c.logoTextColor} cornerColor={c.cornerColor} />}
        </div>
      </div>

      <div style={{ marginTop: 28, background: c.ctaBg, borderRadius: 12, padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
        <span style={{ color: c.ctaTextColor, fontWeight: 700, fontSize: 13 }}>{c.ctaText}</span>
        <span style={{ color: c.ctaTextColor, fontWeight: 700, fontSize: 13, fontFamily: "monospace", textDecoration: "underline" }}>{c.ctaDomain} →</span>
      </div>
    </div>
  );
}
