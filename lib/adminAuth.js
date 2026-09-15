/**
 * Simple shared-secret check for the bulk-email admin endpoints.
 *
 * This mirrors the existing security model of this site: admin.html gates
 * access with a passcode checked in the browser (see ADMIN_PASSCODE near the
 * bottom of admin.html). That's fine for hiding the dashboard from casual
 * visitors, but it means the passcode is visible to anyone who views the
 * page source — so it is NOT a substitute for real authentication.
 *
 * These endpoints require the SAME passcode to be sent as a header, checked
 * here against the ADMIN_PASSCODE environment variable on Vercel (set it to
 * the exact same value as ADMIN_PASSCODE in admin.html: Its1984@1). This at
 * least stops a stranger from finding the URL and firing off bulk emails
 * without ever having seen the dashboard.
 *
 * For real security (recommended if this becomes business-critical), move
 * to a proper login system with hashed passwords and server-side sessions.
 */
function isAdminAuthorized(req) {
  const provided = req.headers['x-admin-passcode'] || (req.body && req.body.adminPasscode);
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) return false; // fail closed if not configured
  return provided === expected;
}

module.exports = { isAdminAuthorized };
