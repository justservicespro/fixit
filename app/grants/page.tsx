// app/grants/page.tsx
import { Metadata } from "next";
import { PH } from "@/components/ui";
import GrantsList from "@/components/GrantsList";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { getActiveGrants } from "@/lib/grants";
import { C } from "@/lib/constants";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Grants & Funding Database — JustServicesPro",
  description:
    "Curated government, private, and tech grants for Nigerian businesses — with application support from JustServicesPro at a 97% success rate.",
  alternates: { canonical: "https://justservices.pro/grants" },
  openGraph: {
    title: "Grants & Funding Database — JustServicesPro",
    description: "Curated funding opportunities for Nigerian businesses — we can help you apply.",
    url: "https://justservices.pro/grants",
  },
};

export default async function GrantsPage() {
  const grants = await getActiveGrants();
  return (
    <>
      <SiteNavbar current="/grants" />
      <div style={{ paddingTop: 106 }}>
        <PH
          label="Grants & Funding"
          title={
            <>
              Active Grants for <span style={{ color: "#93C5FD" }}>Nigerian Businesses</span>
            </>
          }
          sub="Curated funding opportunities — we can help you apply."
        />
        <GrantsList grants={grants} />
      </div>
      <SiteFooter />
    </>
  );
}
