import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Seeds a table with initial data ONLY if it's currently empty. This lets us
// switch the site from hardcoded arrays to real DB-backed content without
// wiping anything already entered via the admin dashboard, and without
// blanking the public site on first deploy (when tables are still empty).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const results: Record<string, string> = {};

  try {
    if (Array.isArray(body.posts)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM posts`;
      if (count === 0) {
        for (const p of body.posts) {
          await sql`INSERT INTO posts(title,category,content,excerpt,date,author,published,image) VALUES(${p.title},${p.category},${p.content||""},${p.excerpt||""},${p.date},${p.author},${p.published},${p.image||"default"})`;
        }
        results.posts = `seeded ${body.posts.length}`;
      } else results.posts = "skipped (already has data)";
    }
    if (Array.isArray(body.projects)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM projects`;
      if (count === 0) {
        for (const p of body.projects) {
          await sql`INSERT INTO projects(title,client,category,status,url,description,year,image_url,testimonial) VALUES(${p.title},${p.client},${p.category},${p.status},${p.url||""},${p.description||""},${p.year},${p.imageUrl||""},${p.testimonial||""})`;
        }
        results.projects = `seeded ${body.projects.length}`;
      } else results.projects = "skipped (already has data)";
    }
    if (Array.isArray(body.products)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM products`;
      if (count === 0) {
        for (const p of body.products) {
          await sql`INSERT INTO products(title,category,description,price,link,badge,active,image_url) VALUES(${p.title},${p.category},${p.description||""},${p.price},${p.link||""},${p.badge||"Available"},${p.active!==false},${p.imageUrl||""})`;
        }
        results.products = `seeded ${body.products.length}`;
      } else results.products = "skipped (already has data)";
    }
    if (Array.isArray(body.grants)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM grants`;
      if (count === 0) {
        for (const g of body.grants) {
          await sql`INSERT INTO grants(name,org,amount,deadline,eligibility,link,category,active,image_url) VALUES(${g.name},${g.org},${g.amount},${g.deadline},${g.eligibility||""},${g.link||""},${g.category||"Government"},${g.active!==false},${g.imageUrl||""})`;
        }
        results.grants = `seeded ${body.grants.length}`;
      } else results.grants = "skipped (already has data)";
    }
    if (Array.isArray(body.cases)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM cases`;
      if (count === 0) {
        for (const c of body.cases) {
          await sql`INSERT INTO cases(client,title,challenge,solution,result,services,url,image_url) VALUES(${c.client},${c.title},${c.challenge||""},${c.solution||""},${c.result||""},${c.services||[]},${c.url||""},${c.imageUrl||""})`;
        }
        results.cases = `seeded ${body.cases.length}`;
      } else results.cases = "skipped (already has data)";
    }
    if (Array.isArray(body.courses)) {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM courses`;
      if (count === 0) {
        for (const c of body.courses) {
          await sql`INSERT INTO courses(title,category,description,duration,schedule,reg_fee,course_fee,active,image_url,instructor,level,seats,enrolled,start_date) VALUES(${c.title},${c.category},${c.description||""},${c.duration||""},${c.schedule||""},${c.regFee||5000},${c.courseFee||45000},${c.active!==false},${c.imageUrl||""},${c.instructor||""},${c.level||"Beginner"},${c.seats||30},${c.enrolled||0},${c.startDate||""})`;
        }
        results.courses = `seeded ${body.courses.length}`;
      } else results.courses = "skipped (already has data)";
    }
    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    console.error("Seed error:", e?.message);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
