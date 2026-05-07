const express = require('express');
const router = express.Router();
const { shortenUrl, getAnalytics, redirectUrl } = require('../controllers/urlController');

// Shorten a URL
router.post('/shorten', shortenUrl);

// Get analytics for a short code
router.get('/analytics/:code', getAnalytics);

// Redirect short code to original URL
router.get('/:code', redirectUrl);

module.exports = router;