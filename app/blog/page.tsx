// app/blog/page.tsx
import { Metadata } from "next";
import { PH } from "@/components/ui";
import BlogList from "@/components/BlogList";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { getPublishedPosts } from "@/lib/blog";
import { C } from "@/lib/constants";

export const revalidate = 300; // refresh post list every 5 minutes

export const metadata: Metadata = {
  title: "Blog & Insights — JustServicesPro",
  description:
    "Actionable guides, startup tips, and industry insights for Nigerian businesses — CAC registration, grants, technology, and corporate strategy.",
  alternates: { canonical: "https://justservices.pro/blog" },
  openGraph: {
    title: "Blog & Insights — JustServicesPro",
    description: "Actionable guides, startup tips, and industry insights for Nigerian businesses.",
    url: "https://justservices.pro/blog",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <SiteNavbar current="/blog" />
      <div style={{ paddingTop: 106 }}>
        <PH
          label="Blog & Insights"
          title={
            <>
              Business Insights &<br />
              <span style={{ color: "#93C5FD" }}>Expert Knowledge</span>
            </>
          }
          sub="Actionable guides, startup tips, and industry insights."
        />
        <BlogList posts={posts} />
      </div>
      <SiteFooter />
    </>
  );
}
