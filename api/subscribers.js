const { fetchSubscribers } = require('../lib/subscribers');
const { getCurrentCampaign } = require('../lib/campaigns');
const { isAdminAuthorized } = require('../lib/adminAuth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const result = await fetchSubscribers();
  const current = getCurrentCampaign();

  return res.status(200).json({
    ok: result.ok,
    error: result.ok ? undefined : result.error,
    count: result.subscribers.length,
    preview: result.subscribers.slice(0, 25), // don't ship the whole list to the browser needlessly
    currentCampaign: { id: current.id, subject: current.subject },
  });
};
