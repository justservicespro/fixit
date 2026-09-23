// lib/blog.ts
import { sql } from "@/lib/db";
import { BlogPost } from "@/lib/constants";

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const rows = await sql`SELECT * FROM posts WHERE published = true ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      content: r.content,
      excerpt: r.excerpt,
      date: r.date,
      author: r.author,
      published: r.published,
      image: r.image,
    }));
  } catch {
    return [];
  }
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  try {
    const rows = await sql`SELECT * FROM posts WHERE id = ${id} AND published = true LIMIT 1`;
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      content: r.content,
      excerpt: r.excerpt,
      date: r.date,
      author: r.author,
      published: r.published,
      image: r.image,
    };
  } catch {
    return null;
  }
}
