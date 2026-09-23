// components/ShareBar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui";
import { C } from "@/lib/constants";

export default function ShareBar({ title, url }: { title: string; url?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const share = (p: string) => {
    const u = encodeURIComponent(url || (typeof window !== "undefined" ? window.location.href : ""));
    const t = encodeURIComponent(title);
    const m: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${t}`,
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
    };
    window.open(m[p], "_blank");
    setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: "relative" as const, display: "inline-flex" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: open ? C.accent : "#f1f5f9",
          border: `1px solid ${open ? C.blueLt : C.border}`,
          borderRadius: 8,
          padding: "5px 11px",
          fontSize: 11,
          fontWeight: 700,
          color: open ? C.blueLt : C.slate,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Icon n="share" s={13} /> Share
      </button>
      {open && (
        <div
          style={{
            position: "absolute" as const,
            bottom: "calc(100% + 6px)",
            left: 0,
            background: "#fff",
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: 6,
            boxShadow: "0 8px 24px rgba(11,30,61,0.15)",
            display: "flex",
            gap: 6,
            zIndex: 200,
          }}
        >
          {[
            { p: "twitter", c: "#1DA1F2", i: "twitter" },
            { p: "facebook", c: "#1877F2", i: "facebook" },
            { p: "linkedin", c: "#0A66C2", i: "linkedin" },
            { p: "whatsapp", c: "#25D366", i: "whatsapp" },
          ].map((s) => (
            <button
              key={s.p}
              onClick={() => share(s.p)}
              style={{ background: s.c, border: "none", borderRadius: 6, padding: "5px 9px", display: "flex", alignItems: "center", cursor: "pointer", color: "#fff" }}
            >
              <Icon n={s.i} s={13} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
