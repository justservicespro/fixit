import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
export const sql = neon(process.env.DATABASE_URL);

// ── SCHEMA ────────────────────────────────────────────────────────────────────
export async function initSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Startup Tips',
      content TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'JustServicesPro Team',
      published BOOLEAN NOT NULL DEFAULT false,
      image TEXT NOT NULL DEFAULT 'default',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      client TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'completed',
      url TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      testimonial TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      price TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT 'Available',
      active BOOLEAN NOT NULL DEFAULT true,
      image_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS grants (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      org TEXT NOT NULL DEFAULT '',
      amount TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL DEFAULT '',
      eligibility TEXT NOT NULL DEFAULT '',
      link TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Government',
      active BOOLEAN NOT NULL DEFAULT true,
      image_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS cases (
      id SERIAL PRIMARY KEY,
      client TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      challenge TEXT NOT NULL DEFAULT '',
      solution TEXT NOT NULL DEFAULT '',
      result TEXT NOT NULL DEFAULT '',
      services TEXT[] NOT NULL DEFAULT '{}',
      url TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      service TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT '',
      time TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      ref_code TEXT NOT NULL UNIQUE,
      project_status TEXT NOT NULL DEFAULT 'Awaiting Assignment',
      stage INTEGER NOT NULL DEFAULT 0,
      docs TEXT[] NOT NULL DEFAULT '{}',
      join_date TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      subscribed BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  await sql`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      amount INTEGER NOT NULL,
      service TEXT NOT NULL,
      pay_type TEXT NOT NULL DEFAULT 'Full Payment',
      status TEXT NOT NULL DEFAULT 'success',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;

  return { ok: true };
}

// Add to initSchema — courses and students tables
export async function extendSchema() {
  const sql2 = neon(process.env.DATABASE_URL!);
  await sql2`
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      duration TEXT NOT NULL DEFAULT '',
      schedule TEXT NOT NULL DEFAULT '',
      reg_fee INTEGER NOT NULL DEFAULT 5000,
      course_fee INTEGER NOT NULL DEFAULT 45000,
      active BOOLEAN NOT NULL DEFAULT true,
      image_url TEXT NOT NULL DEFAULT '',
      instructor TEXT NOT NULL DEFAULT '',
      level TEXT NOT NULL DEFAULT 'Beginner',
      seats INTEGER NOT NULL DEFAULT 30,
      enrolled INTEGER NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
  await sql2`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      course_id INTEGER NOT NULL,
      course_title TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'enrolled',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      amount_paid INTEGER NOT NULL DEFAULT 0,
      enroll_date TEXT NOT NULL DEFAULT '',
      completion_date TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`;
  return { ok: true };
}

// ── INVOICES ─────────────────────────────────────────────────────────────────
// Called lazily by every /api/invoices* route (CREATE TABLE IF NOT EXISTS is
// idempotent/cheap) so the feature works immediately without a manual visit
// to /api/init, and also included in extendSchema() below for consistency.
export async function ensureInvoicesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      invoice_no TEXT NOT NULL UNIQUE DEFAULT '',
      public_id TEXT NOT NULL UNIQUE DEFAULT '',
      status TEXT NOT NULL DEFAULT 'unpaid',
      issue_date TEXT NOT NULL DEFAULT '',
      due_date TEXT NOT NULL DEFAULT '',
      client_name TEXT NOT NULL DEFAULT '',
      client_email TEXT NOT NULL DEFAULT '',
      client_phone TEXT NOT NULL DEFAULT '',
      client_company TEXT NOT NULL DEFAULT '',
      client_address TEXT NOT NULL DEFAULT '',
      source_type TEXT NOT NULL DEFAULT 'service',
      category TEXT NOT NULL DEFAULT '',
      items JSONB NOT NULL DEFAULT '[]',
      additional_info TEXT NOT NULL DEFAULT '',
      discount_type TEXT NOT NULL DEFAULT 'fixed',
      discount_value NUMERIC NOT NULL DEFAULT 0,
      other_charges JSONB NOT NULL DEFAULT '[]',
      tax_percent NUMERIC NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'NGN',
      subtotal NUMERIC NOT NULL DEFAULT 0,
      total NUMERIC NOT NULL DEFAULT 0,
      amount_paid NUMERIC NOT NULL DEFAULT 0,
      is_receipt BOOLEAN NOT NULL DEFAULT false,
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`;
  // Safety migration for tables created before is_receipt existed.
  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS is_receipt BOOLEAN NOT NULL DEFAULT false`;
  return { ok: true };
}
