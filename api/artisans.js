/**
 * FixIt Abuja — public artisan directory feed (Vercel serverless function).
 *
 * Reads APPROVED listings from the private Google Sheet (via the same Apps Script
 * endpoint + token the rest of the site already uses), sanitises them, and returns
 * only what the directory page may show. The sheet itself is never exposed.
 *
 * Safety rules enforced here (defence in depth - Apps Script already filters too):
 *   - only Status = Approved rows arrive from the sheet
 *   - PREMIUM skills are stripped; a listing with no public skill left is dropped,
 *     so premium artisans can never appear in the directory
 *   - names are shortened to "First L."; no email / certifications / private notes
 *   - URLs must be http(s); phone numbers are normalised to international digits
 *
 * Uses the existing env vars: SHEETS_ENDPOINT, SHEETS_ADMIN_TOKEN. No new setup.
 */

const taxonomy = require('../skills-data.json');

const PUBLIC_SKILLS = new Map(); // skill id -> true (general + automotive only)
taxonomy.tiers.forEach((tier) => {
  if (tier.id === 'premium') return;
  tier.groups.forEach((g) => g.skills.forEach((s) => PUBLIC_SKILLS.set(s.id, true)));
});

function normPhone(raw) {
  let d = String(raw || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '234' + d.slice(1);
  else if (/^[789]\d{9}$/.test(d)) d = '234' + d;
  return /^\d{10,15}$/.test(d) ? d : '';
}

function safeUrl(u) {
  const s = String(u || '').trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : '';
}

function num(v) {
  const n = Number(String(v === undefined || v === null ? '' : v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function displayName(full) {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'FixIt artisan';
  if (parts.length === 1) return parts[0];
  return parts[0] + ' ' + parts[parts.length - 1].charAt(0).toUpperCase() + '.';
}

function sanitize(rows) {
  const out = [];
  (rows || []).forEach((r) => {
    const id = String(r['Listing ID'] || '').trim();
    const skills = String(r['Listing Skill IDs'] || '')
      .split(/[|,;]/).map((x) => x.trim()).filter((x) => PUBLIC_SKILLS.has(x));
    const phone = normPhone(r['Phone Number']);
    if (!id || !skills.length || !phone) return;

    let feeFrom = num(r['Fee From']);
    let feeTo = num(r['Fee To']);
    if (feeFrom && feeTo && feeFrom > feeTo) { const t = feeFrom; feeFrom = feeTo; feeTo = t; }

    out.push({
      id,
      name: displayName(r['Full Name']),
      verified: String(r['Verified'] || '').trim().toLowerCase() === 'yes',
      skills: Array.from(new Set(skills)).slice(0, 12),
      area: String(r['Base Location in Abuja'] || '').trim().slice(0, 60),
      areasServed: String(r['Areas Served'] || '').split(/[|;]/).map((x) => x.trim()).filter(Boolean).slice(0, 12),
      years: String(r['Years of Experience'] || '').trim().slice(0, 30),
      feeFrom,
      feeTo,
      feeBasis: ['job', 'hour', 'day', 'callout', 'negotiable'].includes(String(r['Fee Basis'] || '').trim()) ? String(r['Fee Basis']).trim() : 'job',
      bio: String(r['Public Bio'] || '').trim().slice(0, 160),
      photo: safeUrl(r['Profile Photo URL']),
      gallery: String(r['Job Experience Photo URLs'] || '').split(/\s+/).map(safeUrl).filter(Boolean).slice(0, 3),
      phone,
      whatsapp: normPhone(r['WhatsApp Number']) || phone,
      joined: String(r['Timestamp'] || '').slice(0, 10),
    });
  });
  out.sort((a, b) => (b.verified - a.verified) || String(b.joined).localeCompare(String(a.joined)));
  return out.slice(0, 500);
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { SHEETS_ENDPOINT, SHEETS_ADMIN_TOKEN } = process.env;
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_YOUR') === 0 || !SHEETS_ADMIN_TOKEN) {
    // Not configured yet: the directory simply shows no listings (page falls back to artisans-data.json).
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(200).json({ ok: true, artisans: [], note: 'sheets-not-configured' });
  }

  try {
    const url = SHEETS_ENDPOINT + (SHEETS_ENDPOINT.includes('?') ? '&' : '?') +
      'action=artisans&token=' + encodeURIComponent(SHEETS_ADMIN_TOKEN);
    const upstream = await fetch(url, { redirect: 'follow' });
    const json = await upstream.json();
    if (!json || json.ok !== true) throw new Error('upstream refused');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ ok: true, artisans: sanitize(json.artisans) });
  } catch (err) {
    console.error('artisans feed error:', err);
    return res.status(502).json({ ok: false, artisans: [] });
  }
};

module.exports.sanitize = sanitize;
