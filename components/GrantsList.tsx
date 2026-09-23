// components/GrantsList.tsx
"use client";
import { useState } from "react";
import { Card, Bdg, Icon } from "@/components/ui";
import ShareBar from "@/components/ShareBar";
import { C, Grant } from "@/lib/constants";

export default function GrantsList({ grants }: { grants: Grant[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = ["All", "Government", "Private", "Tech"];
  const filtered = grants.filter(
    (g) => cat === "All" || g.category === cat
  ).filter((g) => !q || g.name.toLowerCase().includes(q.toLowerCase()) || g.org.toLowerCase().includes(q.toLowerCase()));

  return (
    <section style={{ background: C.offWht, padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" as const, alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 240, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "11px 16px" }}>
            <span style={{ color: C.slateL }}>
              <Icon n="search" s={16} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search grants..."
              style={{ border: "none", background: "none", fontSize: 14, color: C.dark, flex: 1, outline: "none" }}
            />
          </div>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: cat === c ? C.blueLt : "#fff",
                border: "1px solid",
                borderColor: cat === c ? C.blueLt : C.border,
                borderRadius: 20,
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: cat === c ? "#fff" : C.slate,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="bg">
          {filtered.map((g, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <Bdg label={g.category} color={g.category === "Government" ? C.blue : g.category === "Tech" ? C.purple : C.success} />
                <span style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>Deadline: {g.deadline}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 17, color: C.dark, margin: "0 0 6px" }}>{g.name}</h3>
              <p style={{ color: C.slate, fontSize: 13, marginBottom: 6 }}>
                by <strong>{g.org}</strong>
              </p>
              <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 20, color: C.blueLt, marginBottom: 12 }}>{g.amount}</div>
              <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>
                <strong>Eligibility:</strong> {g.eligibility}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, alignItems: "center", justifyContent: "space-between" }}>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, color: "#fff", padding: "9px 18px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Icon n="externalLink" s={13} /> Apply Now
                </a>
                <ShareBar title={`${g.name} — ${g.amount}`} />
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <p style={{ color: C.slate, gridColumn: "1/-1", textAlign: "center" as const }}>No grants match your search.</p>}
        </div>
      </div>
    </section>
  );
}
