/**
 * FixIt Abuja — site-wide configuration.
 * Loaded by index.html, technicians.html, and book-a-service.html.
 *
 * Neither value here is a secret: the Sheets endpoint only accepts writes
 * (it can't be used to read your data back), and the OneSignal App ID is
 * meant to be public — it's how OneSignal's SDK identifies which app is
 * talking to it, not an authentication credential.
 */

// Paste your Google Apps Script Web App URL here after deploying
// google-apps-script.gs (see the setup instructions at the top of that file).
// Leave as-is if you haven't set up the Sheets backend yet — forms will keep
// working via email, they just won't also log to a spreadsheet.
const FIXIT_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzwELxLvngy7kiHMoiG6Bm9i8cTs4adPhuf1s-5Q5TEpTWzTMy3-fCSsltPU_cju2vT/exec";

// Your OneSignal App ID (already set — from onesignal.com dashboard).
const FIXIT_ONESIGNAL_APP_ID = "15289264-cd36-439d-a9b6-4e0b8a5266a1";

// WhatsApp Channel link — shown to technicians after they apply, so they can
// follow for job updates. Replace with your real channel URL once you've
// created one (WhatsApp app → Updates tab → Channels → your channel →
// Channel info → Invite via link).
const FIXIT_WHATSAPP_CHANNEL = "https://whatsapp.com/channel/REPLACE_WITH_YOUR_CHANNEL_ID";

// Keeps every WhatsApp Channel link on the page (the static banners on the
// homepage/technicians page, marked with data-whatsapp-channel) pointed at
// the same URL as the constant above — so updating FIXIT_WHATSAPP_CHANNEL
// once, here, is the only edit ever needed.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-whatsapp-channel]').forEach(function (el) {
    el.href = FIXIT_WHATSAPP_CHANNEL;
  });
});

/**
 * Sends a form via our own /api/send-email (Gmail SMTP, configured on Vercel)
 * instead of formsubmit.co. Falls back to the form's original formsubmit.co
 * action automatically if the API call fails for any reason (e.g. SMTP env
 * vars not yet set), so submissions are never silently lost.
 *
 * formType must be one of: "booking", "technician", "request" — used by
 * /api/send-email.js to pick the right subject line and autoresponse text,
 * and here to pick which confirmation message to show.
 */
function wireSmtpSubmit(formId, formType) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = { formType: formType };
    fd.forEach((value, key) => { payload[key] = value; });

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    // An email address may live under a few different field names depending
    // on which form this is (booking's "email" vs. the technician form's
    // "Email Address") — check all of them so the confirmation line below
    // only promises an email if one was actually given.
    const givenEmail = payload.email || payload.Email || payload['Email Address'] || '';

    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => { if (!r.ok) throw new Error('send-email failed'); return r.json(); })
      .then(() => {
        let successBox = form.querySelector('.smtp-success');
        if (!successBox) {
          successBox = document.createElement('div');
          successBox.className = 'smtp-success';
          successBox.style.cssText =
            'background:rgba(18,165,148,0.12); border:1px solid rgba(18,165,148,0.4); ' +
            'border-radius:8px; padding:16px 18px; margin-top:16px; font-size:14px; line-height:1.6;';

          const emailLine = givenEmail
            ? `We've also sent a confirmation email to <b>${givenEmail}</b> — check your inbox (and spam folder, just in case).`
            : "We'll reach out by phone or WhatsApp shortly.";

          if (formType === 'technician') {
            successBox.innerHTML =
              '<b>Thank you — your application has been sent.</b><br>' +
              emailLine + '<br><br>' +
              'While you wait, follow our WhatsApp Channel for new job leads as they come in:<br>' +
              `<a href="${FIXIT_WHATSAPP_CHANNEL}" target="_blank" rel="noopener" ` +
              'style="display:inline-block; margin-top:8px; background:#25D366; color:#fff; ' +
              'text-decoration:none; font-weight:700; padding:9px 16px; border-radius:6px;">' +
              '💬 Follow WhatsApp Channel for Job Updates</a>';
          } else {
            successBox.innerHTML =
              '<b>Thank you — your request has been sent.</b><br>' + emailLine;
          }
          form.appendChild(successBox);
        }
        form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = true; });
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(() => {
        // SMTP path failed — fall back to the form's original formsubmit.co
        // submission so the request still reaches the business.
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
        HTMLFormElement.prototype.submit.call(form);
      });
  });
}
