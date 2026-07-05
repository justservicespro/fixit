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
const FIXIT_SHEETS_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

// Your OneSignal App ID (already set — from onesignal.com dashboard).
const FIXIT_ONESIGNAL_APP_ID = "15289264-cd36-439d-a9b6-4e0b8a5266a1";
