// app/blog/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bdg, Icon } from "@/components/ui";
import ShareBar from "@/components/ShareBar";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { getPostById } from "@/lib/blog";
import { C, BLOG_IMG } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPostById(parseInt(params.id));
  if (!post) return { title: "Post Not Found — JustServicesPro" };
  return {
    title: `${post.title} — JustServicesPro Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://justservices.pro/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://justservices.pro/blog/${post.id}`,
      type: "article",
      images: [BLOG_IMG[post.image] || BLOG_IMG.default],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(parseInt(params.id));
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.date,
    publisher: { "@type": "Organization", name: "JustServicesPro" },
  };

  return (
    <>
      <SiteNavbar current="/blog" />
      <div style={{ paddingTop: 106 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div style={{ background: `linear-gradient(135deg,${C.navyDk},${C.navy})`, padding: "clamp(48px,6vw,60px) clamp(16px,4vw,32px) 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Link
            href="/blog"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "7px 14px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              marginBottom: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon n="arrowLeft" s={12} /> Back
          </Link>
          <div style={{ marginTop: 16 }}>
            <Bdg label={post.category} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 800, color: "#fff", margin: "16px 0 10px" }}>{post.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            {post.date} · {post.author}
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "44px 32px" }}>
        <div style={{ height: 280, backgroundImage: `url(${BLOG_IMG[post.image] || BLOG_IMG.default})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 16, marginBottom: 32 }} />
        <p style={{ color: "#475569", fontSize: 17, fontStyle: "italic", lineHeight: 1.8, marginBottom: 28, paddingLeft: 16, borderLeft: `4px solid ${C.blueLt}` }}>{post.excerpt}</p>
        <div style={{ color: C.dark, fontSize: 16, lineHeight: 1.9, whiteSpace: "pre-line" as const, marginBottom: 40 }}>{post.content}</div>
        <div style={{ padding: "16px 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ShareBar title={post.title} />
          <Link href="/blog" style={{ color: C.blueLt, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            ← All posts
          </Link>
        </div>
      </div>
      </div>
      <SiteFooter />
    </>
  );
}
