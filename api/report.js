const { fetchReport } = require('../lib/report');
const { isAdminAuthorized } = require('../lib/adminAuth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  // ?days=14 (default) controls the "since" window used for the sinceCount
  // figures — how many of each thing happened in that trailing window, not
  // just the all-time total.
  const days = Number(req.query.days) || 14;
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const report = await fetchReport(since);
  return res.status(report.ok ? 200 : 500).json(report);
};
