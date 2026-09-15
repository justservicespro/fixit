/**
 * FixIt Abuja — Google Sheets backend for form submissions + subscribers.
 *
 * WHAT THIS DOES
 * Every booking, technician application, and contact request submitted on the
 * website is already emailed to you via SMTP. This script ALSO writes each
 * submission as a row in a Google Sheet, so you have a searchable, sortable,
 * filterable list — a lightweight CRM with zero database setup.
 *
 * It ALSO maintains a deduped "Subscribers" sheet: any time a form submission
 * includes an email address, that address is automatically added to the
 * subscriber list (if not already there). The admin dashboard's bulk-email
 * feature reads this list to send the bi-weekly campaign.
 *
 * SETUP (about 5 minutes, one-time)
 * 1. Go to sheets.google.com and create a new blank spreadsheet.
 *    Name it something like "FixIt Abuja — Submissions".
 * 2. In the sheet, go to Extensions → Apps Script.
 * 3. Delete any starter code in the editor, and paste in this entire file.
 * 4. Change ADMIN_TOKEN below to your own secret value (any random string —
 *    it protects the subscriber-list and unsubscribe endpoints from strangers).
 * 5. Click Deploy → New deployment.
 *    - Click the gear icon next to "Select type" → choose "Web app".
 *    - Description: "FixIt Abuja form intake" (or anything).
 *    - Execute as: "Me".
 *    - Who has access: "Anyone".
 *    - Click Deploy, then authorize the script when Google prompts you
 *      (click "Advanced" → "Go to [project name] (unsafe)" if warned —
 *      this warning appears for all personal Apps Script projects, it's normal).
 * 6. Copy the "Web app URL" it gives you (ends in /exec).
 * 7. Open config.js (in the website files) and paste that URL as the value
 *    of FIXIT_SHEETS_ENDPOINT. Re-upload config.js.
 * 8. On Vercel, add TWO environment variables so the admin dashboard's bulk
 *    email feature can talk to this sheet on the server side:
 *      SHEETS_ENDPOINT = the same web app URL from step 6
 *      SHEETS_ADMIN_TOKEN = the same value you set for ADMIN_TOKEN below
 *
 * The script auto-creates tabs the first time each type of form is
 * submitted: "Bookings", "TechnicianApplications", "ContactRequests",
 * "Subscribers", and "CampaignLog".
 *
 * If you ever change form field names on the website, update the header
 * arrays in getHeadersFor() below to match.
 */

var ADMIN_TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING'; // must match SHEETS_ADMIN_TOKEN on Vercel

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data._sheet || 'Submissions';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (sheetName === 'Subscribers') {
      // Manual add from the admin dashboard, or a direct subscribe call.
      addSubscriber_(ss, data.email || data.Email || '', data.name || data.Name || '', data.source || data.Source || 'manual');
    } else {
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(getHeadersFor(sheetName));
        sheet.setFrozenRows(1);
      }
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var row = headers.map(function (h) {
        if (h === 'Timestamp') return new Date();
        if (h === 'Status') return 'New';
        return data[h] !== undefined ? data[h] : '';
      });
      sheet.appendRow(row);

      // Auto-capture: if this submission carried an email address, add it
      // to the subscriber list too (deduped), regardless of which form it came from.
      var email = data.email || data.Email || data['Email Address'] || '';
      if (email) {
        addSubscriber_(ss, email, data['Full Name'] || data['Your Name'] || '', sheetName);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Adds an email to the Subscribers sheet if it isn't already there (case-insensitive). No-op on empty/invalid email. */
function addSubscriber_(ss, email, name, source) {
  email = String(email || '').trim().toLowerCase();
  if (!email || email.indexOf('@') === -1) return;

  var sheet = ss.getSheetByName('Subscribers');
  if (!sheet) {
    sheet = ss.insertSheet('Subscribers');
    sheet.appendRow(['Timestamp', 'Email', 'Name', 'Source', 'Unsubscribed']);
    sheet.setFrozenRows(1);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // column B = Email
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0] || '').trim().toLowerCase() === email) return; // already subscribed
    }
  }

  sheet.appendRow([new Date(), email, name || '', source || '', false]);
}

function getHeadersFor(sheetName) {
  switch (sheetName) {
    case 'Bookings':
      return ['Timestamp', 'Status', 'Full Name', 'Phone Number', 'Email', 'Service Needed', 'Location in Abuja', 'Describe the Problem'];
    case 'TechnicianApplications':
      return ['Timestamp', 'Status', 'Full Name', 'Phone Number', 'Email Address', 'Years of Experience', 'Areas of Expertise', 'Base Location in Abuja', 'Certifications', 'About Your Work', 'Profile Photo URL', 'Public Bio', 'Job Experience Photo URLs'];
    case 'ContactRequests':
      return ['Timestamp', 'Status', 'Your Name', 'Your Phone Number', 'Job Details', 'Technician Requested'];
    case 'CampaignLog':
      return ['Timestamp', 'Campaign', 'Recipients', 'Result'];
    default:
      return ['Timestamp', 'Status', 'Data'];
  }
}

/**
 * GET endpoint — three uses:
 *  - no params:                    health-check message.
 *  - ?action=subscribers&token=X:  returns JSON list of active subscribers (server-to-server only, needs the admin token).
 *  - ?action=unsubscribe&email=X:  public — flags that email as unsubscribed, returns a plain confirmation page.
 *  - ?action=logCampaign&token=X:  server-to-server — records that a campaign was sent.
 */
function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'subscribers') {
    if (e.parameter.token !== ADMIN_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var sheet = ss.getSheetByName('Subscribers');
    var list = [];
    if (sheet && sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
      rows.forEach(function (r) {
        var unsubscribed = r[4] === true || String(r[4]).toUpperCase() === 'TRUE';
        if (r[1] && !unsubscribed) {
          list.push({ email: r[1], name: r[2] || '', source: r[3] || '' });
        }
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, subscribers: list }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'unsubscribe') {
    var email = String(e.parameter.email || '').trim().toLowerCase();
    var subSheet = ss.getSheetByName('Subscribers');
    if (subSheet && email) {
      var lastRow = subSheet.getLastRow();
      if (lastRow > 1) {
        var emails = subSheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0] || '').trim().toLowerCase() === email) {
            subSheet.getRange(i + 2, 5).setValue(true);
            break;
          }
        }
      }
    }
    return HtmlService.createHtmlOutput(
      '<div style="font-family:Arial,sans-serif; max-width:480px; margin:60px auto; text-align:center; color:#171A21;">' +
      '<h2>You have been unsubscribed</h2>' +
      '<p>' + (email || 'This address') + ' will not receive FixIt Abuja emails again. ' +
      'You can still reach us any time on WhatsApp or by phone.</p></div>'
    );
  }

  if (action === 'logCampaign') {
    if (e.parameter.token !== ADMIN_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var logSheet = ss.getSheetByName('CampaignLog');
    if (!logSheet) {
      logSheet = ss.insertSheet('CampaignLog');
      logSheet.appendRow(getHeadersFor('CampaignLog'));
      logSheet.setFrozenRows(1);
    }
    logSheet.appendRow([new Date(), e.parameter.campaign || '', e.parameter.recipients || '0', e.parameter.result || '']);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('FixIt Abuja intake endpoint is live. It only accepts POST requests from the website.');
}
