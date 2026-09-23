// components/LegalShell.tsx
"use client";
import { C } from "@/lib/constants";
import { PH } from "@/components/ui";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

export const LegalSection = ({ title, children }: { title: string; children: any }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ fontFamily: "'Playfair Display'", fontWeight: 700, fontSize: 18, color: C.dark, marginBottom: 12 }}>
      {title}
    </h3>
    <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.85 }}>{children}</div>
  </div>
);

export const LegalPageShell = ({
  label,
  title,
  lastUpdated,
  currentPath,
  children,
}: {
  label: string;
  title: string;
  lastUpdated: string;
  currentPath: string;
  children: any;
}) => (
  <>
    <SiteNavbar current={currentPath} />
    <div style={{ paddingTop: 106 }}>
      <PH label={label} title={title} sub={`Last updated: ${lastUpdated}`} />
      <section style={{ background: "#fff", padding: "clamp(40px,6vw,60px) clamp(16px,4vw,32px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>{children}</div>
      </section>
    </div>
    <SiteFooter />
  </>
);
