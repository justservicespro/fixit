/**
 * FixIt Abuja — send-email API route (Vercel serverless function).
 *
 * Sends two emails per form submission via Gmail SMTP:
 *   1. A notification to the business inbox with the submitted details.
 *   2. An autoresponse to the person who submitted (if they gave an email),
 *      confirming receipt and linking our Terms & Conditions.
 *
 * Reads credentials from environment variables set on Vercel:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * Optional:
 *   BUSINESS_EMAIL — where notifications land (defaults to SMTP_USER)
 *
 * SMTP_PASS should be a 16-character Gmail "App Password", not the normal
 * account password — Gmail blocks plain-password SMTP logins for
 * third-party apps. Generate one at https://myaccount.google.com/apppasswords
 * (requires 2-Step Verification to be turned on for the Gmail account).
 */

const nodemailer = require('nodemailer');
const { logEmailSent } = require('../lib/report');

const TERMS_URL = 'https://fixit.justservices.pro/terms.html';
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbB4t4eCBtxGCQD2BP1M'; // keep in sync with FIXIT_WHATSAPP_CHANNEL in config.js
const SITE_NAME = 'FixIt Abuja';

const SUBJECTS = {
  booking:    'New repair request — FixIt Abuja website',
  technician: 'New technician application — FixIt Abuja',
  request:    'Technician contact request — FixIt Abuja',
};

const AUTORESPONSES = {
  booking:
    "Thank you for contacting FixIt Abuja. We've received your request and " +
    "will confirm your quote by phone or WhatsApp shortly.\n\n" +
    "FixIt Abuja dispatches verified technicians with competence to attend to and provide " +
    "repairs, maintenance and related services on-call at your home or place of business within Abuja.\n\n" +
    "By contacting us for services, you agree to our Terms and Conditions: " + TERMS_URL,
  technician:
    "Thank you for applying to join the FixIt Abuja technician network. " +
    "We'll review your application and reach out by phone or WhatsApp.\n\n" +
    "While you wait, follow our WhatsApp Channel for new job leads as they come in: " + WHATSAPP_CHANNEL_URL + "\n\n" +
    "By contacting or engaging FixIt Abuja as a technician, you agree to our Terms and " +
    "Conditions, including that technicians work as independent contractors: " + TERMS_URL,
  request:
    "Thank you for reaching out to FixIt Abuja. We've passed your details to the " +
    "technician you requested and will connect you both shortly.\n\n" +
    "By contacting us for services, you agree to our Terms and Conditions: " + TERMS_URL,
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildNotificationHtml(fields, formType) {
  const rows = Object.entries(fields)
    .filter(([k]) => !k.startsWith('_'))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;background:#F6F2E9;border:1px solid #eee;">${escapeHtml(k)}</td>` +
        `<td style="padding:6px 12px;border:1px solid #eee;">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  return `
    <div style="font-family:Arial,sans-serif;">
      <h2 style="color:#171A21;">${escapeHtml(SUBJECTS[formType] || 'New message')}</h2>
      <table style="border-collapse:collapse;">${rows}</table>
    </div>
  `;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const formType = body.formType && SUBJECTS[body.formType] ? body.formType : 'booking';
  const fields = { ...body };
  delete fields.formType;

  // Basic honeypot check (mirrors the hidden "_honey" field already on the forms).
  if (fields._honey) {
    return res.status(200).json({ ok: true }); // silently accept, do nothing
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BUSINESS_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP configuration environment variables.');
    return res.status(500).json({ ok: false, error: 'Email service is not configured.' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const toBusiness = BUSINESS_EMAIL || SMTP_USER;
  const clientEmail = fields.email || fields.Email || fields['Email Address'] || null;

  try {
    // 1. Notify the business.
    await transporter.sendMail({
      from: `"${SITE_NAME} Website" <${SMTP_USER}>`,
      to: toBusiness,
      replyTo: clientEmail || undefined,
      subject: SUBJECTS[formType],
      html: buildNotificationHtml(fields, formType),
    });
    await logEmailSent(formType, toBusiness, SUBJECTS[formType], 'sent');

    // 2. Autoresponse to the submitter, if they gave an email.
    if (clientEmail) {
      const linkify = (p) =>
        escapeHtml(p)
          .replace(TERMS_URL, `<a href="${TERMS_URL}">${TERMS_URL}</a>`)
          .replace(WHATSAPP_CHANNEL_URL, `<a href="${WHATSAPP_CHANNEL_URL}">${WHATSAPP_CHANNEL_URL}</a>`);
      await transporter.sendMail({
        from: `"${SITE_NAME}" <${SMTP_USER}>`,
        to: clientEmail,
        subject: `Thanks for contacting ${SITE_NAME}`,
        text: AUTORESPONSES[formType],
        html: `<div style="font-family:Arial,sans-serif; line-height:1.6; color:#171A21;">
                 ${AUTORESPONSES[formType]
                   .split('\n\n')
                   .map((p) => `<p>${linkify(p)}</p>`)
                   .join('')}
               </div>`,
      });
      await logEmailSent(formType + '-autoresponse', clientEmail, `Thanks for contacting ${SITE_NAME}`, 'sent');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-email error:', err);
    await logEmailSent(formType, toBusiness, SUBJECTS[formType], 'failed');
    return res.status(500).json({ ok: false, error: 'Failed to send email.' });
  }
};
