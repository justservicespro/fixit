const nodemailer = require('nodemailer');

const SITE_NAME = 'FixIt Abuja';
const UNSUB_BASE_ACTION = 'action=unsubscribe&email=';

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing SMTP configuration environment variables.');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function unsubscribeUrlFor(email) {
  const { SHEETS_ENDPOINT } = process.env;
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_YOUR') === 0) {
    // Sheets backend not configured — fall back to a mailto so the request
    // still reaches a human instead of a dead link.
    return `mailto:info@justservices.pro?subject=Unsubscribe&body=Please%20unsubscribe%20${encodeURIComponent(email)}`;
  }
  return `${SHEETS_ENDPOINT}?${UNSUB_BASE_ACTION}${encodeURIComponent(email)}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends one HTML email (subject + html template containing {{unsubscribe_url}})
 * to every subscriber, in small BCC batches with a short pause between
 * batches — this keeps us well under Gmail's sending limits and avoids
 * looking like spam to Google's own servers.
 *
 * subscribers: [{ email, name }]
 * Returns { sent, failed, batches }
 */
async function sendBulkEmail(subscribers, subject, htmlTemplate, fromUser) {
  const transporter = getTransporter();
  const BATCH_SIZE = 40; // safely under Gmail's per-message recipient guidance
  const PAUSE_MS = 2000; // gap between batches so we don't trip rate limits

  let sent = 0;
  let failed = 0;
  const batches = [];
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    batches.push(subscribers.slice(i, i + BATCH_SIZE));
  }

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    // Each recipient needs THEIR OWN unsubscribe link, so within a batch we
    // still send individually rather than one BCC blast with a shared link.
    const results = await Promise.allSettled(
      batch.map((sub) => {
        const html = htmlTemplate.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrlFor(sub.email));
        return transporter.sendMail({
          from: `"${SITE_NAME}" <${fromUser}>`,
          to: sub.email,
          subject,
          html,
        });
      })
    );
    results.forEach((r) => (r.status === 'fulfilled' ? sent++ : failed++));
    if (b < batches.length - 1) await sleep(PAUSE_MS);
  }

  return { sent, failed, batches: batches.length };
}

module.exports = { getTransporter, sendBulkEmail, unsubscribeUrlFor };
