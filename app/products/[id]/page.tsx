// app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bdg, Icon } from "@/components/ui";
import ProductBrandCard from "@/components/ProductBrandCard";
import { getProductBrand } from "@/lib/productBrands";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { C, WHATSAPP, PRODUCTS_DATA } from "@/lib/constants";

export function generateStaticParams() {
  return PRODUCTS_DATA.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = PRODUCTS_DATA.find((x) => x.id === params.id);
  if (!p) return { title: "Product Not Found — JustServicesPro" };
  return {
    title: `${p.name} — ${p.tagline} | JustServicesPro`,
    description: p.description,
    alternates: { canonical: `https://justservices.pro/products/${p.id}` },
    openGraph: {
      title: `${p.name} — ${p.tagline}`,
      description: p.description,
      url: `https://justservices.pro/products/${p.id}`,
      images: [p.img],
    },
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const p = PRODUCTS_DATA.find((x) => x.id === params.id);
  if (!p) notFound();

  return (
    <>
      <SiteNavbar current="/products" />
      <div style={{ paddingTop: 106 }}>
        <div style={{ padding: "clamp(24px,4vw,40px) clamp(16px,4vw,32px) 0" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <Link href="/products" style={{ background: C.offWht, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.slate, fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon n="arrowLeft" s={13} /> All Products
            </Link>
            <h1 style={{ position: "absolute" as const, width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{p.name} — {p.tagline}</h1>
            <ProductBrandCard c={getProductBrand(p)} />
          </div>
        </div>
        <section style={{ background: "#fff", padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="tc" style={{ alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 20, color: C.dark, marginBottom: 14 }}>About {p.name}</h2>
                <p style={{ color: C.slate, fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>{p.description}</p>
                <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 17, color: C.dark, marginBottom: 16 }}>Key Features</h3>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {p.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: p.color }}>
                          <Icon n="check" s={12} />
                        </span>
                      </div>
                      <span style={{ color: C.dark, fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "sticky" as const, top: 88, background: C.offWht, borderRadius: 18, padding: 28, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 15, color: C.dark, marginBottom: 20 }}>Get Started with {p.name}</div>
                {!(p as any).comingSoon ? (
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${p.color},${p.color}cc)`, borderRadius: 10, padding: "14px 24px", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", marginBottom: 14 }}>
                    <Icon n="externalLink" s={16} /> {p.cta}
                  </a>
                ) : (
                  <div style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 24px", color: C.slate, fontWeight: 600, fontSize: 14, textAlign: "center" as const, marginBottom: 14 }}>
                    In development — launching soon
                  </div>
                )}
                <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25D366", borderRadius: 10, padding: "14px 24px", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                  <Icon n="whatsapp" s={16} /> Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
