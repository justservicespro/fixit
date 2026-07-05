/**
 * FixIt Abuja — Google Sheets backend for form submissions.
 *
 * WHAT THIS DOES
 * Every booking, technician application, and contact request submitted on the
 * website is already emailed to you via FormSubmit. This script ALSO writes
 * each submission as a row in a Google Sheet, so you have a searchable,
 * sortable, filterable list — a lightweight CRM with zero database setup.
 *
 * SETUP (about 5 minutes, one-time)
 * 1. Go to sheets.google.com and create a new blank spreadsheet.
 *    Name it something like "FixIt Abuja — Submissions".
 * 2. In the sheet, go to Extensions → Apps Script.
 * 3. Delete any starter code in the editor, and paste in this entire file.
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
 *    of FIXIT_SHEETS_ENDPOINT. Re-upload config.js. Done — every form on the
 *    site will now also write to this sheet.
 *
 * The script auto-creates three tabs the first time each type of form is
 * submitted: "Bookings", "TechnicianApplications", "ContactRequests".
 *
 * If you ever change form field names on the website, update the header
 * arrays in getHeadersFor() below to match.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data._sheet || 'Submissions';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getHeadersFor(sheetName) {
  switch (sheetName) {
    case 'Bookings':
      return ['Timestamp', 'Status', 'Full Name', 'Phone Number', 'Service Needed', 'Location in Abuja', 'Describe the Problem'];
    case 'TechnicianApplications':
      return ['Timestamp', 'Status', 'Full Name', 'Phone Number', 'Email Address', 'Years of Experience', 'Areas of Expertise', 'Base Location in Abuja', 'Certifications', 'About Your Work', 'Profile Photo URL', 'Public Bio', 'Job Experience Photo URLs'];
    case 'ContactRequests':
      return ['Timestamp', 'Status', 'Your Name', 'Your Phone Number', 'Job Details', 'Technician Requested'];
    default:
      return ['Timestamp', 'Status', 'Data'];
  }
}

/** Lets you sanity-check the deployment by visiting the web app URL directly in a browser. */
function doGet(e) {
  return ContentService.createTextOutput('FixIt Abuja intake endpoint is live. It only accepts POST requests from the website.');
}
