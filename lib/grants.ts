// lib/grants.ts
import { sql } from "@/lib/db";
import { Grant } from "@/lib/constants";

export async function getActiveGrants(): Promise<Grant[]> {
  try {
    const rows = await sql`SELECT * FROM grants WHERE active = true ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      org: r.org,
      amount: r.amount,
      deadline: r.deadline,
      eligibility: r.eligibility,
      link: r.link,
      category: r.category,
      active: r.active,
      imageUrl: r.image_url,
    }));
  } catch {
    return [];
  }
}
