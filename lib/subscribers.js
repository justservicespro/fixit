/**
 * Fetches the active subscriber list from the Google Apps Script backend.
 * Server-side only (this runs inside a Vercel function, never in the browser) —
 * that's what lets us call the Apps Script endpoint without hitting CORS,
 * and keep SHEETS_ADMIN_TOKEN out of any client-facing code.
 *
 * Requires two Vercel environment variables:
 *   SHEETS_ENDPOINT     — the Apps Script web app URL (ends in /exec)
 *   SHEETS_ADMIN_TOKEN  — must match ADMIN_TOKEN inside google-apps-script.gs
 *
 * Returns { ok: true, subscribers: [...] } or { ok: false, error, subscribers: [] }
 * — callers should treat "not configured yet" as a normal, expected state
 * (mirrors how the rest of this site treats the Sheets backend as optional).
 */
async function fetchSubscribers() {
  const { SHEETS_ENDPOINT, SHEETS_ADMIN_TOKEN } = process.env;

  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_YOUR') === 0 || !SHEETS_ADMIN_TOKEN) {
    return {
      ok: false,
      error: 'Google Sheets backend is not configured yet (SHEETS_ENDPOINT / SHEETS_ADMIN_TOKEN missing on Vercel).',
      subscribers: [],
    };
  }

  const url = `${SHEETS_ENDPOINT}?action=subscribers&token=${encodeURIComponent(SHEETS_ADMIN_TOKEN)}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (!data.ok) {
      return { ok: false, error: data.error || 'Sheets endpoint returned an error.', subscribers: [] };
    }
    return { ok: true, subscribers: data.subscribers || [] };
  } catch (err) {
    return { ok: false, error: 'Could not reach the Sheets backend: ' + err.message, subscribers: [] };
  }
}

/** Fire-and-forget: tells the Sheet a campaign was sent, for the admin's records. Never throws. */
async function logCampaignSend(campaignId, recipientCount, result) {
  const { SHEETS_ENDPOINT, SHEETS_ADMIN_TOKEN } = process.env;
  if (!SHEETS_ENDPOINT || !SHEETS_ADMIN_TOKEN) return;
  try {
    const url =
      `${SHEETS_ENDPOINT}?action=logCampaign&token=${encodeURIComponent(SHEETS_ADMIN_TOKEN)}` +
      `&campaign=${encodeURIComponent(campaignId)}&recipients=${recipientCount}&result=${encodeURIComponent(result)}`;
    await fetch(url);
  } catch (e) {
    // Logging failure should never break a send — just ignore it.
  }
}

module.exports = { fetchSubscribers, logCampaignSend };
