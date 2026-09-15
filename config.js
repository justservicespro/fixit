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

/**
 * Sends a form via our own /api/send-email (Gmail SMTP, configured on Vercel)
 * instead of formsubmit.co. Falls back to the form's original formsubmit.co
 * action automatically if the API call fails for any reason (e.g. SMTP env
 * vars not yet set), so submissions are never silently lost.
 *
 * formType must be one of: "booking", "technician", "request" — used by
 * /api/send-email.js to pick the right subject line and autoresponse text.
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
            'border-radius:8px; padding:16px 18px; margin-top:16px; font-size:14px; line-height:1.5;';
          successBox.innerHTML =
            '<b>Thank you — your request has been sent.</b><br>' +
            "We'll reach out by phone or WhatsApp shortly. If you gave an email address, check your inbox for a confirmation.";
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
