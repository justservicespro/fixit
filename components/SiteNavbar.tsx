// components/SiteNavbar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui";
import { C } from "@/lib/constants";

// A self-contained navbar for pages that live outside the SPA (real routes
// like /about, /blog, /grants, etc). Mirrors the homepage nav's structure
// exactly — same dropdowns, same items — so nav feels identical everywhere.
// Migrated pages link with real hrefs; pages still living inside the SPA
// link to "/#section" — a full navigation to the homepage, where the SPA's
// own hash-detection effect picks up the fragment and shows the right
// section.

type DropItem = { label: string; href: string };

function NavDropdown({ label, href, items, current }: { label: string; href: string; items: DropItem[]; current?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  const active = current === href || items.some((i) => i.href === current);
  return (
    <div ref={ref} style={{ position: "relative" as const, display: "flex", alignItems: "center" }}>
      <a
        href={href}
        className="nl"
        style={{ color: active ? C.steel : "rgba(255,255,255,0.75)", background: active ? "rgba(59,130,246,0.12)" : "transparent", fontSize: 13.5, fontWeight: 500, padding: "6px 6px 6px 13px", borderRadius: "4px 0 0 4px", textDecoration: "none" }}
      >
        {label}
      </a>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`${label} menu`}
        style={{ background: active ? "rgba(59,130,246,0.12)" : "transparent", border: "none", color: active ? C.steel : "rgba(255,255,255,0.75)", padding: "6px 9px 6px 4px", borderRadius: "0 4px 4px 0", cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <Icon n="chevronDown" s={13} />
      </button>
      {open && (
        <div style={{ position: "absolute" as const, top: "calc(100% + 8px)", left: 0, maxWidth: "calc(100vw - 32px)", background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(11,30,61,0.18)", border: `1px solid ${C.border}`, padding: 6, minWidth: 210, zIndex: 1000 }}>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ width: "100%", display: "block", padding: "10px 14px", borderRadius: 8, background: current === item.href ? C.accent : "transparent", cursor: "pointer", textAlign: "left" as const, textDecoration: "none" }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: current === item.href ? C.blueLt : C.dark }}>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteNavbar({ current }: { current?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const flatLinks: DropItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];
  const servicesItems: DropItem[] = [
    { label: "Our Services", href: "/services" },
    { label: "Client Portal", href: "/#portal" },
  ];
  const productsItems: DropItem[] = [
    { label: "Leadflo", href: "/products/leadflo" },
    { label: "CertTrack", href: "/products/certtrack" },
    { label: "OrgNexus", href: "/products/orgnexus" },
    { label: "DevTrac", href: "/products/devtrac" },
    { label: "ProDoc", href: "/products/prodoc" },
    { label: "Processa", href: "/products/processa" },
    { label: "WebMan", href: "/products/webman" },
    { label: "Appaholic", href: "/products/appaholic" },
    { label: "JustBuys", href: "/products/justbuys" },
    { label: "FixIt", href: "/products/fixit" },
  ];
  const resourcesItems: DropItem[] = [
    { label: "Courses", href: "/#courses" },
    { label: "Student Portal", href: "/#studentportal" },
    { label: "Shop", href: "/#shop" },
  ];
  const moreItems: DropItem[] = [
    { label: "FAQs", href: "/faqs" },
    { label: "Grants Database", href: "/grants" },
    { label: "Quote Calculator", href: "/calculator" },
    { label: "Case Studies", href: "/case-studies" },
  ];
  const tailLinks: DropItem[] = [
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const allMobileLinks: DropItem[] = [
    ...flatLinks,
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Courses", href: "/#courses" },
    { label: "Student Portal", href: "/#studentportal" },
    { label: "Shop", href: "/#shop" },
    ...tailLinks,
    { label: "Quote Calculator", href: "/calculator" },
    { label: "Grants Database", href: "/grants" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Client Portal", href: "/#portal" },
    { label: "FAQs", href: "/faqs" },
  ];

  return (
    <nav style={{ position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 9990, background: "rgba(7,20,40,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/icon.png" alt="JSP" style={{ width: 34, height: 34, objectFit: "contain" as const }} />
          <div>
            <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: "#fff", fontSize: 13 }}>JustServicesPro</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em" }}>CONNECTING OPPORTUNITIES!</div>
          </div>
        </a>
        <div className="dn" style={{ gap: 2, alignItems: "center" }}>
          {flatLinks.map((l) => (
            <a key={l.href} href={l.href} className="nl" style={{ color: current === l.href ? C.steel : "rgba(255,255,255,0.75)", background: current === l.href ? "rgba(59,130,246,0.12)" : "transparent", fontSize: 13.5, fontWeight: 500, padding: "6px 13px", borderRadius: 4, textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <NavDropdown label="Services" href="/services" items={servicesItems} current={current} />
          <NavDropdown label="Products" href="/products" items={productsItems} current={current} />
          <NavDropdown label="Resources" href="/#courses" items={resourcesItems} current={current} />
          {tailLinks.map((l) => (
            <a key={l.href} href={l.href} className="nl" style={{ color: current === l.href ? C.steel : "rgba(255,255,255,0.75)", background: current === l.href ? "rgba(59,130,246,0.12)" : "transparent", fontSize: 13.5, fontWeight: 500, padding: "6px 13px", borderRadius: 4, textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <NavDropdown label="More" href="/faqs" items={moreItems} current={current} />
          <a href="/contact" style={{ marginLeft: 8, background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Book Now
          </a>
        </div>
        <button className="mb" onClick={() => setMobileOpen((o) => !o)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 8 }}>
          <Icon n={mobileOpen ? "x" : "menu"} s={22} />
        </button>
      </div>
      {mobileOpen && (
        <div style={{ background: "rgba(7,20,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px clamp(16px,4vw,32px) 20px", maxHeight: "70vh", overflowY: "auto" as const }}>
          {allMobileLinks.map((l, i) => (
            <a key={i} href={l.href} style={{ display: "block", color: current === l.href ? C.steel : "rgba(255,255,255,0.75)", padding: "13px 0", fontSize: 15, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
