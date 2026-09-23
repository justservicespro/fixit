// components/AboutPortfolio.tsx
"use client";
import { useState } from "react";
import { SL, ST, Bdg, Icon } from "@/components/ui";
import { C, Project } from "@/lib/constants";

export default function AboutPortfolio({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", "Business Registration & Compliance", "Website & App Development", "Corporate Administration & Training"];
  const filtered = projects.filter((p) => cat === "All" || p.category === cat);

  return (
    <section style={{ background: C.offWht, padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center" as const, marginBottom: 36 }}>
          <SL>Portfolio</SL>
          <ST center>
            Clients &amp; <span style={{ color: C.blueLt }}>Projects</span>
          </ST>
          <p style={{ color: C.slate, marginTop: 10, fontSize: 14 }}>
            {projects.filter((p) => p.status === "completed").length} completed · {projects.filter((p) => p.status === "ongoing").length} ongoing
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 28, justifyContent: "center" }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: cat === c ? C.blueLt : "#fff",
                border: "1px solid",
                borderColor: cat === c ? C.blueLt : C.border,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: cat === c ? "#fff" : C.slate,
                cursor: "pointer",
              }}
            >
              {c === "All" ? c : c.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        <div className="prj">
          {filtered.map((p, i) => (
            <div key={i} className="sc" style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", minHeight: 110 }}>
              <div style={{ width: 100, flexShrink: 0, background: `linear-gradient(135deg,${C.navyDk},${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 28, color: "rgba(255,255,255,0.12)" }}>{p.client[0]}</span>
              </div>
              <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column" as const, justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, color: C.blue, background: C.accent, padding: "2px 8px", borderRadius: 20 }}>
                      {p.category.split(" ")[0]}
                    </span>
                    <Bdg label={p.status} color={p.status === "completed" ? C.success : "#D97706"} />
                  </div>
                  <h4 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 13, color: C.dark, margin: "0 0 3px" }}>{p.client}</h4>
                  <p style={{ color: C.slate, fontSize: 12, lineHeight: 1.55, margin: 0 }}>{p.description.substring(0, 60)}...</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: C.slateL }}>{p.year}</span>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" style={{ color: C.blueLt, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, textDecoration: "none" }}>
                      <Icon n="externalLink" s={10} /> Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
