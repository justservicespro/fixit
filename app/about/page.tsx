// app/about/page.tsx
import { Metadata } from "next";
import { sql } from "@/lib/db";
import { PH, SL, ST, Icon } from "@/components/ui";
import AboutPortfolio from "@/components/AboutPortfolio";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { C, CAC_NAME, CAC_RC, SUCCESS_RATE, Project } from "@/lib/constants";

export const revalidate = 300; // refresh project data every 5 minutes

export const metadata: Metadata = {
  title: "About Us — JustServicesPro",
  description:
    "JustServicesPro Management and Consulting Ltd (RC: 7965265) — Abuja-based business registration, consulting, and technology partner with a 97% success rate.",
  alternates: { canonical: "https://justservices.pro/about" },
  openGraph: {
    title: "About Us — JustServicesPro",
    description: "Your trusted business solutions partner in Abuja, Nigeria.",
    url: "https://justservices.pro/about",
  },
};

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      client: r.client,
      category: r.category,
      status: r.status,
      url: r.url,
      description: r.description,
      year: r.year,
      imageUrl: r.image_url,
      testimonial: r.testimonial,
    }));
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const projects = await getProjects();

  return (
    <>
      <SiteNavbar current="/about" />
    <div style={{ paddingTop: 106 }}>
      <PH
        label="About Us"
        title={
          <>
            Your Trusted Business
            <br />
            <span style={{ color: "#93C5FD" }}>Solutions Partner</span>
          </>
        }
        sub={`${CAC_NAME} · RC: ${CAC_RC} · Abuja, Nigeria.`}
      />
      <section style={{ background: "#fff", padding: "clamp(44px,7vw,70px) clamp(16px,4vw,32px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="tc">
            <div>
              <SL>Our Story</SL>
              <ST>
                Built for Nigerian Businesses, <span style={{ color: C.blueLt }}>Built to Scale</span>
              </ST>
              <p style={{ color: C.slate, marginTop: 18, lineHeight: 1.8, fontSize: 16 }}>
                JustServicesPro Ltd was founded to provide Nigerian businesses with the same quality corporate
                services that global enterprises enjoy. We bridge the gap between ambition and execution.
              </p>
              <div
                style={{
                  marginTop: 22,
                  background: C.accent,
                  border: `1px solid rgba(37,99,235,0.2)`,
                  borderRadius: 14,
                  padding: "18px 22px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg,${C.blueLt},${C.blue})`,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#fff" }}>
                    <Icon n="shield" s={18} />
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display'", fontWeight: 800, fontSize: 15, color: C.dark, marginBottom: 4 }}>
                    CAC Registered · RC: {CAC_RC}
                  </div>
                  <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7 }}>
                    <strong>{CAC_NAME}</strong> — Incorporated under CAMA.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
              {[
                { icon: "shield", title: "Professionalism", desc: "International standards, every time." },
                { icon: "award", title: "Integrity", desc: "Transparent, honest, accountable." },
                { icon: "zap", title: "Innovation", desc: "Technology at the core of every solution." },
                { icon: "star", title: "Excellence", desc: `${SUCCESS_RATE} success rate.` },
              ].map((v, i) => (
                <div key={i} style={{ background: C.offWht, borderRadius: 14, padding: "22px 18px", border: `1px solid ${C.border}` }}>
                  <span style={{ color: C.blue }}>
                    <Icon n={v.icon} s={24} />
                  </span>
                  <h4 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 14, margin: "10px 0 6px", color: C.dark }}>{v.title}</h4>
                  <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>
      <AboutPortfolio projects={projects} />
      <SiteFooter />
    </>
  );
}
