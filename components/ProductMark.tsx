// components/ProductMark.tsx
// Self-contained recreations of each product's actual icon — background
// shape, colors and glyph all drawn together exactly as they appear on the
// live sites (matched against screenshots), rather than a generic letter
// tinted to fit. Each mark carries its own container (square / hexagon /
// shield / bare pin) instead of relying on the orb sphere behind it.

export type MarkType = "shield-check" | "network-nexus" | "map-pin" | "document-check" | "hex-p" | "square-letter" | "funnel-bolt";

export default function ProductMark({ mark, color = "#fff", letter, bg }: { mark: MarkType; color?: string; letter?: string; bg?: string }) {
  switch (mark) {
    // CertTrack: navy shield outline, gold checkmark centered
    case "shield-check":
      return (
        <svg viewBox="0 0 100 100" width="70%" height="70%">
          <path d="M50 4 L82 15 V44 C82 68 68 86 50 94 C32 86 18 68 18 44 V15 Z" fill="#0B1E3D" stroke="#E9C46A" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M33 49 L45 61 L68 36" fill="none" stroke="#E9C46A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // OrgNexus: white rounded-square tile, orange 3-node network glyph
    case "network-nexus":
      return (
        <svg viewBox="0 0 100 100" width="72%" height="72%">
          <rect x="4" y="4" width="92" height="92" rx="22" fill="#ffffff" />
          <g stroke="#F0653C" strokeWidth="4" fill="none">
            <line x1="50" y1="30" x2="32" y2="66" />
            <line x1="50" y1="30" x2="68" y2="66" />
          </g>
          <circle cx="50" cy="30" r="9" fill="#F0653C" />
          <circle cx="32" cy="66" r="6.5" fill="#F0653C" />
          <circle cx="68" cy="66" r="6.5" fill="#F0653C" />
        </svg>
      );

    // DevTrac: bare amber map pin, white hole — no container, matches live site
    case "map-pin":
      return (
        <svg viewBox="0 0 100 100" width="62%" height="62%">
          <path d="M50 6 C30 6 14 22 14 42 C14 68 50 96 50 96 C50 96 86 68 86 42 C86 22 70 6 50 6 Z" fill="#F2A93B" />
          <circle cx="50" cy="41" r="13" fill="#ffffff" />
        </svg>
      );

    // ProDoc: green rounded-square tile, white document + green check badge
    case "document-check":
      return (
        <svg viewBox="0 0 100 100" width="72%" height="72%">
          <rect x="4" y="4" width="92" height="92" rx="22" fill="#10B981" />
          <path d="M32 22 H58 L70 34 V76 C70 78.2 68.2 80 66 80 H32 C29.8 80 28 78.2 28 76 V26 C28 23.8 29.8 22 32 22 Z" fill="#ffffff" />
          <path d="M58 22 V34 H70 Z" fill="#CFE9DD" />
          <line x1="35" y1="47" x2="60" y2="47" stroke="#8FB9A8" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="56" x2="60" y2="56" stroke="#8FB9A8" strokeWidth="3" strokeLinecap="round" />
          <line x1="35" y1="65" x2="50" y2="65" stroke="#8FB9A8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="66" cy="74" r="15" fill="#059669" stroke="#ffffff" strokeWidth="3" />
          <path d="M58 74 L64 80 L76 66" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // Processa: hexagon outline, cyan, "P" centered — no fill container
    case "hex-p":
      return (
        <svg viewBox="0 0 100 100" width="72%" height="72%">
          <polygon points="50,6 87,28 87,72 50,94 13,72 13,28" fill="none" stroke="#2DD4CF" strokeWidth="5" strokeLinejoin="round" />
          <text x="50" y="67" textAnchor="middle" fontSize="44" fontWeight={800} fill="#ffffff" fontFamily="Inter, Arial, sans-serif">
            P
          </text>
        </svg>
      );

    // WebMan (and any generic rounded-square + letter product icon)
    case "square-letter":
      return (
        <svg viewBox="0 0 100 100" width="72%" height="72%">
          <rect x="4" y="4" width="92" height="92" rx="22" fill={bg || "#10B981"} />
          <text x="50" y="68" textAnchor="middle" fontSize="46" fontWeight={800} fill={color} fontFamily="Inter, Arial, sans-serif">
            {letter}
          </text>
        </svg>
      );

    // Leadflo: pink rounded-square tile, white funnel with leads flowing down into a bolt tip
    case "funnel-bolt":
      return (
        <svg viewBox="0 0 100 100" width="72%" height="72%">
          <rect x="4" y="4" width="92" height="92" rx="22" fill="#EC4899" />
          <circle cx="32" cy="26" r="4.5" fill="#ffffff" opacity="0.85" />
          <circle cx="50" cy="22" r="4.5" fill="#ffffff" />
          <circle cx="68" cy="26" r="4.5" fill="#ffffff" opacity="0.85" />
          <path d="M26 34 H74 L58 54 V66 L42 74 V54 Z" fill="#ffffff" />
        </svg>
      );

    default:
      return null;
  }
}

