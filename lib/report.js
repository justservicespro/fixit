/**
 * Report data + email-send logging, both backed by the same Google Sheets
 * endpoint used everywhere else in this project. Server-side only.
 *
 * fetchReport(sinceISO) — pulls aggregated counts + recent activity across
 * every sheet (Bookings, TechnicianApplications, ContactRequests,
 * Subscribers, CampaignLog, EmailLog). Used by both:
 *   - api/report.js (the admin dashboard's live "Reports" panel)
 *   - api/campaign-cron.js (the bi-weekly report email, same cron cycle as
 *     the rotating subscriber campaign)
 *
 * logEmailSent(...) — call this any time api/send-email.js actually sends a
 * notification or autoresponse. It writes one row to the EmailLog sheet, so
 * the report is a true record of what went out — it doesn't depend on the
 * browser's sendBeacon call (in config.js) having succeeded too. Fire this
 * without awaiting it from the caller's perspective if you don't want a slow
 * Sheets write to delay the person's form submission response.
 */

const { SHEETS_ENDPOINT, SHEETS_ADMIN_TOKEN } = process.env;

function sheetsConfigured() {
  return Boolean(SHEETS_ENDPOINT) && SHEETS_ENDPOINT.indexOf('PASTE_YOUR') !== 0 && Boolean(SHEETS_ADMIN_TOKEN);
}

async function fetchReport(sinceISO) {
  if (!sheetsConfigured()) {
    return {
      ok: false,
      error: 'Google Sheets backend is not configured yet (SHEETS_ENDPOINT / SHEETS_ADMIN_TOKEN missing on Vercel).',
    };
  }
  let url = `${SHEETS_ENDPOINT}?action=report&token=${encodeURIComponent(SHEETS_ADMIN_TOKEN)}`;
  if (sinceISO) url += `&since=${encodeURIComponent(sinceISO)}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (!data.ok) return { ok: false, error: data.error || 'Sheets endpoint returned an error.' };
    return data;
  } catch (err) {
    return { ok: false, error: 'Could not reach the Sheets backend: ' + err.message };
  }
}

/** Logs one sent (or failed) email to the EmailLog sheet. Never throws — a logging failure should never break the thing that triggered it. */
async function logEmailSent(type, recipient, subject, status) {
  if (!sheetsConfigured()) return;
  try {
    const url = `${SHEETS_ENDPOINT}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, // matches the sendBeacon content-type used elsewhere, Apps Script doesn't care either way
      body: JSON.stringify({
        _sheet: 'EmailLog',
        Type: type,
        Recipient: recipient || '',
        Subject: subject || '',
        Status: status || 'sent',
      }),
    });
  } catch (e) {
    // Ignore — logging is best-effort, never blocks the caller.
  }
}

/** Renders the aggregated report as a plain, readable HTML email for the business owner. */
function buildReportEmailHtml(report, days, campaignInfo) {
  const ink = '#171A21', teal = '#12A594', amber = '#FF7A1A', paper = '#F6F2E9';

  const row = (label, val) =>
    `<tr><td style="padding:10px 14px; color:#555; font-size:13px;">${label}</td>` +
    `<td style="padding:10px 14px; text-align:right; font-family:Arial,sans-serif; font-weight:700; font-size:18px; color:${ink};">${val}</td></tr>`;

  const recentList = (items, fields) => {
    if (!items || items.length === 0) return '<p style="color:#999; font-size:13px; margin:6px 0 0;">Nothing yet.</p>';
    return (
      '<ul style="margin:8px 0 0; padding-left:18px; font-size:13px; color:#333;">' +
      items
        .slice(0, 5)
        .map((item) => `<li style="margin-bottom:4px;">${fields.map((f) => item[f] || '').filter(Boolean).join(' — ')}</li>`)
        .join('') +
      '</ul>'
    );
  };

  return `
  <div style="background:${paper}; padding:26px 0; font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; border:1px solid #eee;">
      <div style="background:${ink}; padding:20px 26px;">
        <span style="color:${paper}; font-size:18px; font-weight:bold;">FixIt Abuja — Bi-Weekly Report</span>
        <div style="color:rgba(246,242,233,0.6); font-size:12px; margin-top:4px;">Last ${days} days &middot; generated ${new Date(report.generatedAt).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</div>
      </div>

      <table style="width:100%; border-collapse:collapse;">
        ${row('New bookings', report.bookings.sinceCount)}
        ${row('New technician applications', report.technicians.sinceCount)}
        ${row('New contact requests', report.contactRequests.sinceCount)}
        ${row('New subscribers', report.subscribers.sinceCount)}
        ${row('Total active subscribers', report.subscribers.active)}
        ${row('Notification emails sent', report.emails.sinceCount)}
      </table>

      <div style="padding:6px 26px 22px;">
        <div style="border-top:1px solid #eee; padding-top:18px; margin-top:6px;">
          <h3 style="font-size:15px; color:${ink}; margin:0 0 4px;">Recent bookings</h3>
          ${recentList(report.bookings.recent, ['Full Name', 'Service Needed', 'Location in Abuja'])}
        </div>
        <div style="border-top:1px solid #eee; padding-top:18px; margin-top:18px;">
          <h3 style="font-size:15px; color:${ink}; margin:0 0 4px;">Recent technician applications</h3>
          ${recentList(report.technicians.recent, ['Full Name', 'Areas of Expertise', 'Base Location in Abuja'])}
        </div>
        <div style="border-top:1px solid #eee; padding-top:18px; margin-top:18px;">
          <h3 style="font-size:15px; color:${ink}; margin:0 0 4px;">Recent contact requests</h3>
          ${recentList(report.contactRequests.recent, ['Your Name', 'Technician Requested'])}
        </div>
        ${
          campaignInfo
            ? `<div style="border-top:1px solid #eee; padding-top:18px; margin-top:18px;">
                <h3 style="font-size:15px; color:${ink}; margin:0 0 4px;">This cycle's campaign</h3>
                <p style="font-size:13px; color:#333; margin:6px 0 0;">
                  "<b>${campaignInfo.subject}</b>" sent to <b>${campaignInfo.sent}</b> subscriber(s)${campaignInfo.failed ? `, ${campaignInfo.failed} failed` : ''}.
                </p>
              </div>`
            : ''
        }
      </div>

      <div style="padding:16px 26px; background:${paper}; border-top:1px solid #eee; text-align:center;">
        <a href="https://fixit.justservices.pro/admin.html" style="display:inline-block; background:${amber}; color:#171A21; text-decoration:none; font-weight:700; padding:10px 20px; border-radius:6px; font-size:13px;">Open Admin Dashboard</a>
      </div>
    </div>
  </div>`;
}

module.exports = { fetchReport, logEmailSent, buildReportEmailHtml };
