// components/BlogList.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Bdg, Icon } from "@/components/ui";
import ShareBar from "@/components/ShareBar";
import { C, BLOG_IMG, BlogPost } from "@/lib/constants";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", "Startup Tips", "Technology", "Grants", "Corporate Insights"];
  const filtered = posts.filter((p) => cat === "All" || p.category === cat);

  return (
    <section style={{ background: C.offWht, padding: "clamp(36px,5vw,50px) clamp(16px,4vw,32px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" as const }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: cat === c ? C.blueLt : "#fff",
                border: "1px solid",
                borderColor: cat === c ? C.blueLt : C.border,
                borderRadius: 20,
                padding: "7px 16px",
                fontSize: 12,
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
          {filtered.map((b, i) => (
            <div key={i} className="bc" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <Link href={`/blog/${b.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    height: 200,
                    backgroundImage: `url(${BLOG_IMG[b.image] || BLOG_IMG.default})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative" as const,
                  }}
                >
                  <div style={{ position: "absolute" as const, inset: 0, background: "rgba(7,20,40,0.5)" }} />
                  <div style={{ position: "absolute" as const, top: 14, left: 14 }}>
                    <Bdg label={b.category} />
                  </div>
                </div>
              </Link>
              <div style={{ padding: "22px" }}>
                <Link href={`/blog/${b.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontFamily: "'Playfair Display'", fontSize: 17, fontWeight: 700, color: C.dark, margin: "0 0 10px", lineHeight: 1.4 }}>{b.title}</h3>
                </Link>
                <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>{b.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
                  <Link href={`/blog/${b.id}`} style={{ background: "none", border: "none", color: C.blueLt, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                    Read More <Icon n="arrowRight" s={12} />
                  </Link>
                  <ShareBar title={b.title} url={typeof window !== "undefined" ? `${window.location.origin}/blog/${b.id}` : undefined} />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: C.slate, gridColumn: "1/-1", textAlign: "center" as const }}>No posts in this category yet.</p>}
        </div>
      </div>
    </section>
  );
}
