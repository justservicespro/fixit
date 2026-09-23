// components/CaseStudiesList.tsx
"use client";
import Link from "next/link";
import { Bdg } from "@/components/ui";
import ShareBar from "@/components/ShareBar";
import { C, CaseStudy } from "@/lib/constants";

export default function CaseStudiesList({ cases }: { cases: CaseStudy[] }) {
  return (
    <section style={{ background: C.offWht, padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 24 }}>
          {cases.map((c, i) => (
            <div key={i} className="sc cs-row" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <Link href={`/case-studies/${c.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: `linear-gradient(135deg,${C.navyDk},${C.blue})`, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px" }}>
                  <div style={{ textAlign: "center" as const }}>
                    <div style={{ fontFamily: "'Playfair Display'", fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.1)" }}>{i + 1}</div>
                    <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: "#fff", fontSize: 16 }}>{c.client}</div>
                  </div>
                </div>
              </Link>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" as const }}>
                  {c.services.slice(0, 2).map((s) => (
                    <Bdg key={s} label={s.split(" ")[0]} color={C.navy} />
                  ))}
                </div>
                <Link href={`/case-studies/${c.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, margin: "0 0 12px" }}>{c.title}</h3>
                </Link>
                <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                  <strong style={{ color: C.success }}>Result:</strong> {c.result}
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" as const }}>
                  <Link
                    href={`/case-studies/${c.id}`}
                    style={{ background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
                  >
                    Read Case Study
                  </Link>
                  <ShareBar title={c.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
