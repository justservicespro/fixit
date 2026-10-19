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
 *    (ADMIN_TOKEN below already has a working default — change it later if
 *    you want, just keep SHEETS_ADMIN_TOKEN on Vercel matching whatever you set.)
 * 4. Click Deploy → New deployment.
 *    - Click the gear icon next to "Select type" → choose "Web app".
 *    - Description: "FixIt Abuja form intake" (or anything).
 *    - Execute as: "Me".
 *    - Who has access: "Anyone".
 *    - Click Deploy, then authorize the script when Google prompts you
 *      (click "Advanced" → "Go to [project name] (unsafe)" if warned —
 *      this warning appears for all personal Apps Script projects, it's normal).
 * 5. Copy the "Web app URL" it gives you (ends in /exec).
 * 6. Open config.js (in the website files) and paste that URL as the value
 *    of FIXIT_SHEETS_ENDPOINT. Re-upload config.js.
 * 7. On Vercel, add environment variables — see the full default list in
 *    ENV_VARS.md (included alongside this file). The short version:
 *      SHEETS_ENDPOINT    = the web app URL from step 5
 *      SHEETS_ADMIN_TOKEN = WRjA1I_7c-NtDe5mju9024ticxM2V-p5   (matches ADMIN_TOKEN below)
 *
 * The script auto-creates tabs the first time each type of form is
 * submitted: "Bookings", "TechnicianApplications", "ContactRequests",
 * "Subscribers", "CampaignLog", "ArtisanListings" and "DirectoryContacts".
 *
 * ARTISAN DIRECTORY (find-artisan.html)
 *  - Every technician application is saved to "TechnicianApplications" (PRIVATE,
 *    never published) and emailed to you, exactly as before. Premium-skill
 *    applicants live ONLY there - they are never shown in the directory.
 *  - If the applicant picked General/Automotive skills AND ticked the public
 *    listing consent, a second row is created in "ArtisanListings" with
 *    Status = Pending. To publish: set Status to Approved (and Verified to Yes
 *    once you have checked their ID/skills). To hide again: set Status to
 *    Suspended. Only Approved rows are ever returned by ?action=artisans.
 *  - "DirectoryContacts" logs every Show-contact / Call / WhatsApp tap on the
 *    directory (no personal data of the visitor) so you can measure leads.
 *  - After pasting this updated script: Deploy > Manage deployments > edit >
 *    Version: New version > Deploy (the /exec URL stays the same).
 *
 * If you ever change form field names on the website, update the header
 * arrays in getHeadersFor() below to match.
 */

var ADMIN_TOKEN = 'WRjA1I_7c-NtDe5mju9024ticxM2V-p5'; // default — change if you want, just keep SHEETS_ADMIN_TOKEN on Vercel matching

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    if (data._honey) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
    }
    var sheetName = data._sheet || 'Submissions';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (sheetName === 'Subscribers') {
      // Manual add from the admin dashboard, or a direct subscribe call.
      addSubscriber_(ss, data.email || data.Email || '', data.name || data.Name || '', data.source || data.Source || 'manual');
    } else {
      appendRecord_(ss, sheetName, data, 'New');

      // Directory: a technician who picked public (General/Automotive) skills and
      // consented gets a PENDING listing row. Premium-only applicants never do.
      if (sheetName === 'TechnicianApplications' &&
          String(data['Public Listing Consent'] || '') === 'Yes' &&
          String(data['Listing Skill IDs'] || '').trim() !== '') {
        data['Listing ID'] = 'L' + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
        data['Verified'] = 'No';
        appendRecord_(ss, 'ArtisanListings', data, 'Pending');
      }

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

/**
 * Appends one record to a tab (creating it if needed). Any canonical column from
 * getHeadersFor() that an older tab is missing is added automatically, so new
 * form fields never get silently dropped. Unknown keys are ignored (keeps the
 * sheet from growing columns if someone posts junk).
 */
function appendRecord_(ss, sheetName, data, defaultStatus) {
  var canonical = getHeadersFor(sheetName);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(canonical);
    sheet.setFrozenRows(1);
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  canonical.forEach(function (h) {
    if (headers.indexOf(h) === -1) {
      headers.push(h);
      sheet.getRange(1, headers.length).setValue(h);
    }
  });
  var row = headers.map(function (h) {
    if (h === 'Timestamp') return new Date();
    if (h === 'Status') return defaultStatus || 'New';
    return data[h] !== undefined ? data[h] : '';
  });
  sheet.appendRow(row);
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
      return ['Timestamp', 'Status', 'Full Name', 'Phone Number', 'Email Address', 'Years of Experience', 'Areas of Expertise', 'Base Location in Abuja', 'Certifications', 'About Your Work', 'Profile Photo URL', 'Public Bio', 'Job Experience Photo URLs',
              'WhatsApp Number', 'Premium Skills', 'Listing Skills', 'Listing Skill IDs', 'Areas Served', 'Fee From', 'Fee To', 'Fee Basis', 'Public Listing Consent'];
    case 'ArtisanListings':
      return ['Timestamp', 'Status', 'Listing ID', 'Verified', 'Full Name', 'Phone Number', 'WhatsApp Number', 'Email Address', 'Years of Experience', 'Listing Skills', 'Listing Skill IDs', 'Base Location in Abuja', 'Areas Served', 'Fee From', 'Fee To', 'Fee Basis', 'Public Bio', 'Profile Photo URL', 'Job Experience Photo URLs', 'Certifications'];
    case 'DirectoryContacts':
      return ['Timestamp', 'Listing ID', 'Skill', 'Channel', 'Area', 'Query', 'Page'];
    case 'ContactRequests':
      return ['Timestamp', 'Status', 'Your Name', 'Your Phone Number', 'Job Details', 'Technician Requested'];
    case 'CampaignLog':
      return ['Timestamp', 'Campaign', 'Recipients', 'Result'];
    case 'EmailLog':
      return ['Timestamp', 'Type', 'Recipient', 'Subject', 'Status'];
    default:
      return ['Timestamp', 'Status', 'Data'];
  }
}

/**
 * GET endpoint — three uses:
 *  - no params:                    health-check message.
 *  - ?action=subscribers&token=X:  returns JSON list of active subscribers (server-to-server only, needs the admin token).
 *  - ?action=unsubscribe&email=X:  public — flags that email as unsubscribed, returns a plain confirmation page.
 *  - ?action=artisans&token=X:     server-to-server - approved public artisan listings for the directory.
 *  - ?action=logCampaign&token=X:  server-to-server — records that a campaign was sent.
 *  - ?action=report&token=X:       server-to-server — aggregated stats + recent activity across every sheet, for the admin dashboard and the bi-weekly report email. Optional &since=ISO-date to count only rows after that date.
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

  if (action === 'artisans') {
    // Server-to-server (Vercel /api/artisans). Returns ONLY Approved listings and ONLY
    // the public fields - never email, certifications or anything from the private tab.
    if (e.parameter.token !== ADMIN_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var PUBLIC_FIELDS = ['Timestamp', 'Listing ID', 'Verified', 'Full Name', 'Phone Number', 'WhatsApp Number', 'Years of Experience', 'Listing Skill IDs', 'Base Location in Abuja', 'Areas Served', 'Fee From', 'Fee To', 'Fee Basis', 'Public Bio', 'Profile Photo URL', 'Job Experience Photo URLs'];
    var aSheet = ss.getSheetByName('ArtisanListings');
    var artisans = [];
    if (aSheet && aSheet.getLastRow() > 1) {
      var aHeaders = aSheet.getRange(1, 1, 1, aSheet.getLastColumn()).getValues()[0];
      var aRows = aSheet.getRange(2, 1, aSheet.getLastRow() - 1, aSheet.getLastColumn()).getValues();
      var statusIdx = aHeaders.indexOf('Status');
      aRows.forEach(function (r) {
        if (String(r[statusIdx]).trim().toLowerCase() !== 'approved') return;
        var o = {};
        PUBLIC_FIELDS.forEach(function (f) {
          var i = aHeaders.indexOf(f);
          if (i > -1) o[f] = r[i] instanceof Date ? r[i].toISOString() : r[i];
        });
        artisans.push(o);
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, artisans: artisans }))
      .setMimeType(ContentService.MimeType.JSON);
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

  if (action === 'report') {
    if (e.parameter.token !== ADMIN_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var sinceParam = e.parameter.since ? new Date(e.parameter.since) : null; // optional: only count rows after this date

    function summarize(sheetName, recentCols) {
      var sh = ss.getSheetByName(sheetName);
      if (!sh || sh.getLastRow() < 2) return { total: 0, sinceCount: 0, recent: [] };
      var lastRow = sh.getLastRow();
      var lastCol = sh.getLastColumn();
      var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
      var rows = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();
      var sinceCount = 0;
      var recent = [];
      for (var i = rows.length - 1; i >= 0; i--) {
        var row = rows[i];
        var ts = row[0];
        if (sinceParam && ts instanceof Date && ts > sinceParam) sinceCount++;
        if (recent.length < 8) {
          var obj = {};
          for (var c = 0; c < recentCols.length; c++) {
            var idx = headers.indexOf(recentCols[c]);
            if (idx > -1) obj[recentCols[c]] = row[idx] instanceof Date ? row[idx].toISOString() : row[idx];
          }
          recent.push(obj);
        }
      }
      if (!sinceParam) sinceCount = rows.length;
      return { total: rows.length, sinceCount: sinceCount, recent: recent };
    }

    var subSheet2 = ss.getSheetByName('Subscribers');
    var subTotal = 0, subActive = 0, subSinceCount = 0;
    if (subSheet2 && subSheet2.getLastRow() > 1) {
      var subRows = subSheet2.getRange(2, 1, subSheet2.getLastRow() - 1, 5).getValues();
      subTotal = subRows.length;
      subRows.forEach(function (r) {
        var unsub = r[4] === true || String(r[4]).toUpperCase() === 'TRUE';
        if (!unsub) subActive++;
        if (sinceParam && r[0] instanceof Date && r[0] > sinceParam) subSinceCount++;
      });
      if (!sinceParam) subSinceCount = subTotal;
    }

    var report = {
      ok: true,
      generatedAt: new Date().toISOString(),
      since: sinceParam ? sinceParam.toISOString() : null,
      bookings: summarize('Bookings', ['Timestamp', 'Full Name', 'Service Needed', 'Location in Abuja']),
      technicians: summarize('TechnicianApplications', ['Timestamp', 'Full Name', 'Areas of Expertise', 'Base Location in Abuja']),
      contactRequests: summarize('ContactRequests', ['Timestamp', 'Your Name', 'Technician Requested']),
      campaigns: summarize('CampaignLog', ['Timestamp', 'Campaign', 'Recipients', 'Result']),
      emails: summarize('EmailLog', ['Timestamp', 'Type', 'Recipient', 'Subject', 'Status']),
      subscribers: { total: subTotal, active: subActive, sinceCount: subSinceCount },
    };
    return ContentService.createTextOutput(JSON.stringify(report))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('FixIt Abuja intake endpoint is live. It only accepts POST requests from the website.');
}
