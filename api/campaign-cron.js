/**
 * Called automatically by Vercel Cron (see vercel.json) once a day. Most
 * days it does nothing — it only actually sends on the one day every 14
 * days that starts a new cycle (see lib/campaigns.js: isSendDay). Running
 * daily instead of trying to schedule "every 14 days" directly keeps the
 * cadence exact even across month boundaries, and daily cron is supported
 * on every Vercel plan.
 *
 * Protected by CRON_SECRET so a stranger can't hit this URL and trigger a
 * bulk send — set CRON_SECRET on Vercel, and reference it in vercel.json's
 * cron path as ?secret=... (see vercel.json in this repo).
 */
const { fetchSubscribers, logCampaignSend } = require('../lib/subscribers');
const { sendBulkEmail } = require('../lib/mailer');
const { getCurrentCampaign, isSendDay } = require('../lib/campaigns');

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
    return res.status(200).json({ ok: true, sent: 0, message: 'No subscribers yet.' });
  }

  try {
    const result = await sendBulkEmail(subResult.subscribers, campaign.subject, campaign.html, SMTP_USER);
    await logCampaignSend(campaign.id, result.sent, `auto sent:${result.sent} failed:${result.failed}`);
    return res.status(200).json({ ok: true, campaignId: campaign.id, ...result });
  } catch (err) {
    console.error('campaign-cron error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send scheduled campaign.' });
  }
};
