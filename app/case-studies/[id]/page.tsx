// app/case-studies/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bdg, Icon } from "@/components/ui";
import ShareBar from "@/components/ShareBar";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { getCaseStudyById } from "@/lib/cases";
import { C } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cs = await getCaseStudyById(parseInt(params.id));
  if (!cs) return { title: "Case Study Not Found — JustServicesPro" };
  return {
    title: `${cs.title} — JustServicesPro Case Study`,
    description: `${cs.client}: ${cs.result}`,
    alternates: { canonical: `https://justservices.pro/case-studies/${cs.id}` },
    openGraph: {
      title: cs.title,
      description: `${cs.client}: ${cs.result}`,
      url: `https://justservices.pro/case-studies/${cs.id}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: { id: string } }) {
  const cs = await getCaseStudyById(parseInt(params.id));
  if (!cs) notFound();

  return (
    <>
      <SiteNavbar current="/case-studies" />
      <div style={{ paddingTop: 106 }}>
      <div style={{ background: `linear-gradient(135deg,${C.navyDk},${C.navy})`, padding: "clamp(48px,6vw,60px) clamp(16px,4vw,32px) 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Link
            href="/case-studies"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              marginBottom: 24,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon n="arrowLeft" s={13} /> All Case Studies
          </Link>
          <div style={{ marginTop: 16 }}>
            <Bdg label="Case Study" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, color: "#fff", margin: "16px 0 12px" }}>{cs.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>Client: {cs.client}</p>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px,5vw,48px) clamp(16px,4vw,32px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 36 }}>
          {[
            { l: "Challenge", t: cs.challenge, c: C.danger, i: "alertCircle" },
            { l: "Solution", t: cs.solution, c: C.blueLt, i: "zap" },
            { l: "Result", t: cs.result, c: C.success, i: "trendingUp" },
          ].map((s) => (
            <div key={s.l} style={{ background: C.offWht, borderRadius: 14, padding: "20px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ color: s.c }}>
                  <Icon n={s.i} s={18} />
                </span>
                <span style={{ fontFamily: "'Playfair Display'", fontWeight: 700, color: C.dark, fontSize: 14 }}>{s.l}</span>
              </div>
              <p style={{ color: C.slate, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{s.t}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, alignItems: "center", justifyContent: "space-between" }}>
          {cs.url && (
            <a
              href={cs.url}
              target="_blank"
              rel="noreferrer"
              style={{ background: `linear-gradient(135deg,${C.blueLt},${C.blue})`, color: "#fff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}
            >
              <Icon n="externalLink" s={15} /> Visit Project
            </a>
          )}
          <ShareBar title={cs.title} />
        </div>
      </div>
      </div>
      <SiteFooter />
    </>
  );
}
