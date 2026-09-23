// app/case-studies/page.tsx
import { Metadata } from "next";
import { PH } from "@/components/ui";
import CaseStudiesList from "@/components/CaseStudiesList";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { getCaseStudies } from "@/lib/cases";
import { C } from "@/lib/constants";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Case Studies — JustServicesPro",
  description:
    "Evidence-based success stories from JustServicesPro's portfolio — real results in business registration, website development, and consulting.",
  alternates: { canonical: "https://justservices.pro/case-studies" },
  openGraph: {
    title: "Case Studies — JustServicesPro",
    description: "Evidence-based success stories from our portfolio.",
    url: "https://justservices.pro/case-studies",
  },
};

export default async function CaseStudiesPage() {
  const cases = await getCaseStudies();
  return (
    <>
      <SiteNavbar current="/case-studies" />
      <div style={{ paddingTop: 106 }}>
        <PH
          label="Case Studies"
          title={
            <>
              Real Results. <span style={{ color: "#93C5FD" }}>Proven Track Record.</span>
            </>
          }
          sub="Evidence-based success stories from our portfolio."
        />
        <CaseStudiesList cases={cases} />
      </div>
      <SiteFooter />
    </>
  );
}
