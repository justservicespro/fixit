// lib/cases.ts
import { sql } from "@/lib/db";
import { CaseStudy } from "@/lib/constants";

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const rows = await sql`SELECT * FROM cases ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      client: r.client,
      title: r.title,
      challenge: r.challenge,
      solution: r.solution,
      result: r.result,
      services: r.services || [],
      url: r.url,
      imageUrl: r.image_url,
    }));
  } catch {
    return [];
  }
}

export async function getCaseStudyById(id: number): Promise<CaseStudy | null> {
  try {
    const rows = await sql`SELECT * FROM cases WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      client: r.client,
      title: r.title,
      challenge: r.challenge,
      solution: r.solution,
      result: r.result,
      services: r.services || [],
      url: r.url,
      imageUrl: r.image_url,
    };
  } catch {
    return null;
  }
}
