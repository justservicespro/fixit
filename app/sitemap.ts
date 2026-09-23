import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getCaseStudies } from "@/lib/cases";
import { PRODUCTS_DATA } from "@/lib/constants";

// NOTE: The rest of the site (Services, Products, Shop, Courses, Grants,
// Calculator, Contact, Portal, StudentPortal, Admin) still uses hash-based
// client-side routing (#services, #products, etc.) and is not yet real,
// separately-indexable pages. Only routes with an actual app/<path>/page.tsx
// belong in this sitemap — adding hash fragments here would not help SEO
// since search engines don't index content after a "#".

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://justservices.pro", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://justservices.pro/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://justservices.pro/services", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://justservices.pro/products", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://justservices.pro/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://justservices.pro/case-studies", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://justservices.pro/grants", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://justservices.pro/calculator", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://justservices.pro/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://justservices.pro/faqs", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://justservices.pro/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://justservices.pro/terms", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://justservices.pro/refund", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCTS_DATA.map((p) => ({
    url: `https://justservices.pro/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let postPages: MetadataRoute.Sitemap = [];
  let casePages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postPages = posts.map((p) => ({
      url: `https://justservices.pro/blog/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}
  try {
    const cases = await getCaseStudies();
    casePages = cases.map((c) => ({
      url: `https://justservices.pro/case-studies/${c.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {}

  return [...staticPages, ...productPages, ...postPages, ...casePages];
}
