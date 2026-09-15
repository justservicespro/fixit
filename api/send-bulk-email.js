const { fetchSubscribers, logCampaignSend } = require('../lib/subscribers');
const { sendBulkEmail } = require('../lib/mailer');
const { CAMPAIGNS, getCurrentCampaign } = require('../lib/campaigns');
const { isAdminAuthorized } = require('../lib/adminAuth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const { SMTP_USER } = process.env;
  if (!SMTP_USER) {
    return res.status(500).json({ ok: false, error: 'SMTP is not configured on the server yet.' });
  }

  // Figure out what we're sending: a specific campaign, the current
  // rotation campaign, or a fully custom one-off subject + message.
  let subject, html, campaignId;

  if (body.mode === 'custom') {
    if (!body.subject || !body.message) {
      return res.status(400).json({ ok: false, error: 'Custom send needs a subject and message.' });
    }
    subject = body.subject;
    // Wrap the admin's plain message in the same footer/unsubscribe shell as the templates.
    html = `
      <div style="font-family:Arial,sans-serif; max-width:560px; margin:0 auto; padding:24px; color:#171A21; line-height:1.6;">
        ${body.message.replace(/\n/g, '<br>')}
        <p style="margin-top:28px; font-size:11.5px; color:#999;">
          FixIt Abuja &middot; JustServicesPro Management and Consulting Ltd &middot; Abuja, FCT<br>
          <a href="{{unsubscribe_url}}" style="color:#999;">Unsubscribe</a>
        </p>
      </div>`;
    campaignId = 'custom';
  } else {
    const campaign = body.campaignId
      ? CAMPAIGNS.find((c) => c.id === body.campaignId)
      : getCurrentCampaign();
    if (!campaign) {
      return res.status(400).json({ ok: false, error: 'Unknown campaignId.' });
    }
    subject = campaign.subject;
    html = campaign.html;
    campaignId = campaign.id;
  }

  const subResult = await fetchSubscribers();
  if (!subResult.ok) {
    return res.status(500).json({ ok: false, error: subResult.error });
  }
  if (subResult.subscribers.length === 0) {
    return res.status(200).json({ ok: true, sent: 0, failed: 0, message: 'No subscribers yet — nothing sent.' });
  }

  try {
    const result = await sendBulkEmail(subResult.subscribers, subject, html, SMTP_USER);
    await logCampaignSend(campaignId, result.sent, `sent:${result.sent} failed:${result.failed}`);
    return res.status(200).json({ ok: true, ...result, campaignId });
  } catch (err) {
    console.error('send-bulk-email error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to send bulk email.' });
  }
};
