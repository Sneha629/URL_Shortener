const { nanoid } = require('nanoid');
const Url = require('../models/Url');

// POST /api/shorten
const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({ shortCode: existing.shortCode });
    }

    const shortCode = nanoid(6);
    const newUrl = new Url({ originalUrl, shortCode });
    await newUrl.save();

    res.json({ shortCode, originalUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /:code → redirect
const redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

   const userAgent = req.headers['user-agent'] || '';
const device = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent) ? 'Mobile' : 'Desktop';
    const browser = req.headers['user-agent'] || 'Unknown';

    url.clicks += 1;
    url.analytics.push({ device, browser });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/analytics/:code
const getAnalytics = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      analytics: url.analytics,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectUrl, getAnalytics };