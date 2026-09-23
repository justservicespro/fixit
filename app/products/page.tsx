// app/products/page.tsx
"use client";
import Link from "next/link";
import { SL, ST, Bdg, Icon, Reveal, PBtn, OBtn } from "@/components/ui";
import ProductBrandCard from "@/components/ProductBrandCard";
import ProductNetwork from "@/components/ProductNetwork";
import { getProductBrand } from "@/lib/productBrands";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { C, WHATSAPP, PRODUCTS_DATA } from "@/lib/constants";

export default function ProductsPage() {
  return (
    <>
      <SiteNavbar current="/products" />
      <div style={{ paddingTop: 106 }}>
        {/* Hero — the orbit network is the centerpiece, not a headline + pill list */}
        <div style={{ background: `linear-gradient(135deg,${C.navyDk} 0%,${C.navy} 55%,${C.blue} 100%)`, padding: "clamp(56px,8vw,76px) clamp(16px,4vw,32px) clamp(20px,4vw,32px)", position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute" as const, inset: 0, backgroundImage: `radial-gradient(ellipse at 70% 20%,rgba(37,99,235,0.16) 0%,transparent 60%)` }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" as const, textAlign: "center" as const }}>
            <Reveal>
              <h1 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 16px" }}>
                One company. Ten platforms.
                <br />
                Everything under one roof.
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.8 }}>
                Business registration, compliance, and consulting are our core. These ten platforms are how we extend that work — each one built, hosted, and supported in-house.
              </p>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <ProductNetwork />
          </Reveal>
        </div>

        {/* Jump nav — real wayfinding for ten full sections below, not decoration */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, position: "sticky" as const, top: 74, zIndex: 20 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px clamp(16px,4vw,32px)", display: "flex", gap: 22, overflowX: "auto" as const }}>
            {PRODUCTS_DATA.map((p) => (
              <a key={p.id} href={`#${p.id}`} className="prod-jump">
                {p.name}
              </a>
            ))}
          </div>
        </div>

        <section style={{ background: C.offWht, padding: "56px 32px 72px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center" as const, marginBottom: 40 }}>
              <Reveal>
                <SL>The Full Lineup</SL>
                <ST center>Every Platform, One by One</ST>
              </Reveal>
            </div>
            <div className="prod-grid-full">
              {PRODUCTS_DATA.map((p, i) => (
                <Reveal key={i} delay={(i % 2) * 60}>
                  <div id={p.id} className="prod-anchor sc" style={{ background: "#fff", borderRadius: 22, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(11,30,61,0.06)", height: "100%", display: "flex", flexDirection: "column" as const }}>
                    <div style={{ position: "relative" as const }}>
                      {(p as any).isNew && (
                        <div style={{ position: "absolute" as const, top: 16, right: 16, zIndex: 2 }}>
                          <Bdg label="New" color={C.success} />
                        </div>
                      )}
                      <ProductBrandCard c={getProductBrand(p)} />
                    </div>
                    <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column" as const }}>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
                        {p.features.slice(0, 4).map((f, fi) => (
                          <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ color: p.color }}>
                                <Icon n="check" s={9} />
                              </span>
                            </div>
                            <span style={{ color: C.dark, fontSize: 13 }}>{f}</span>
                          </div>
                        ))}
                        {p.features.length > 4 && <div style={{ color: C.slateL, fontSize: 12, paddingLeft: 26 }}>+ {p.features.length - 4} more features</div>}
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                        <Link href={`/products/${p.id}`} style={{ flex: 1, background: `linear-gradient(135deg,${p.color},${p.color}cc)`, border: "none", borderRadius: 9, padding: "12px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                          <Icon n="eye" s={13} /> Learn More
                        </Link>
                        {!(p as any).comingSoon && (
                          <a href={p.url} target="_blank" rel="noreferrer" style={{ width: 44, background: "rgba(0,0,0,0.06)", border: `1px solid ${C.border}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
                            <span style={{ color: C.slate }}>
                              <Icon n="externalLink" s={14} />
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div style={{ marginTop: 56, background: `linear-gradient(135deg,${C.navyDk},${C.navy})`, borderRadius: 20, padding: "36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, color: "#fff", fontSize: 20, marginBottom: 6 }}>Need a custom digital platform?</div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>We build bespoke portals, SaaS products, and enterprise systems for Nigerian businesses.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <PBtn onClick={() => (window.location.href = "/contact")} sm style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon n="calendar" s={14} /> Book Consultation
                  </PBtn>
                  <OBtn onClick={() => window.open(WHATSAPP, "_blank")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "10px 18px" }}>
                    <Icon n="whatsapp" s={15} /> WhatsApp
                  </OBtn>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
