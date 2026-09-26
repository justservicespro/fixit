/**
 * Called automatically by Vercel Cron (see vercel.json) once a day. Most
 * days it does nothing — it only actually sends on the one day every 14
 * days that starts a new cycle (see lib/campaigns.js: isSendDay). Running
 * daily instead of trying to schedule "every 14 days" directly keeps the
 * cadence exact even across month boundaries, and daily cron is supported
 * on every Vercel plan.
 *
 * On a send day it does two things, back to back:
 *   1. Sends that cycle's rotating campaign to every subscriber (as before).
 *   2. Sends a bi-weekly business report to BUSINESS_EMAIL — bookings,
 *      technician applications, contact requests, subscriber growth, and
 *      how the campaign in step 1 performed. Same cadence, same run, so the
 *      report always lands right after the campaign it's reporting on.
 *
 * Protected by CRON_SECRET so a stranger can't hit this URL and trigger a
 * bulk send — set CRON_SECRET on Vercel, and reference it in vercel.json's
 * cron path as ?secret=... (see vercel.json in this repo).
 */
const { fetchSubscribers, logCampaignSend } = require('../lib/subscribers');
const { sendBulkEmail, getTransporter } = require('../lib/mailer');
const { getCurrentCampaign, isSendDay } = require('../lib/campaigns');
const { fetchReport, logEmailSent, buildReportEmailHtml } = require('../lib/report');

const REPORT_WINDOW_DAYS = 14;

async function sendBiWeeklyReport(campaignInfo) {
  const { SMTP_USER, BUSINESS_EMAIL } = process.env;
  const since = new Date(Date.now() - REPORT_WINDOW_DAYS * 86400000).toISOString();
  const report = await fetchReport(since);
  if (!report.ok) return { sent: false, reason: report.error };

  const toBusiness = BUSINESS_EMAIL || SMTP_USER;
  const html = buildReportEmailHtml(report, REPORT_WINDOW_DAYS, campaignInfo);

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"FixIt Abuja Reports" <${SMTP_USER}>`,
      to: toBusiness,
      subject: `FixIt Abuja — Bi-Weekly Report (${new Date().toLocaleDateString('en-NG')})`,
      html,
    });
    await logEmailSent('biweekly-report', toBusiness, 'FixIt Abuja — Bi-Weekly Report', 'sent');
    return { sent: true };
  } catch (err) {
    console.error('biweekly-report send error:', err);
    await logEmailSent('biweekly-report', toBusiness, 'FixIt Abuja — Bi-Weekly Report', 'failed');
    return { sent: false, reason: err.message };
  }
}

module.exports = async (req, res) => {
  const { CRON_SECRET, SMTP_USER } = process.env;
  if (!CRON_SECRET || req.query.secret !== CRON_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  if (!isSendDay()) {
    return res.status(200).json({ ok: true, skipped: true, reason: 'Not a scheduled send day.' });
  }

  if (!SMTP_USER) {
    return res.status(500).json({ ok: false, error: 'SMTP is not configured on the server yet.' });
  }

  const campaign = getCurrentCampaign();
  const subResult = await fetchSubscribers();

  if (!subResult.ok) {
    return res.status(200).json({ ok: false, error: subResult.error, note: 'Sheets backend not configured — nothing to send to.' });
  }
  if (subResult.subscribers.length === 0) {
    const report = await sendBiWeeklyReport(null);
    return res.status(200).json({ ok: true, sent: 0, message: 'No subscribers yet.', report });
  }

  try {
    const result = await sendBulkEmail(subResult.subscribers, campaign.subject, campaign.html, SMTP_USER);
    await logCampaignSend(campaign.id, result.sent, `auto sent:${result.sent} failed:${result.failed}`);

    const report = await sendBiWeeklyReport({ subject: campaign.subject, sent: result.sent, failed: result.failed });

    return res.status(200).json({ ok: true, campaignId: campaign.id, ...result, report });
  } catch (err) {
    console.error('campaign-cron error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send scheduled campaign.' });
  }
};
