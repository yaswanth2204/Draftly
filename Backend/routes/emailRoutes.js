const express = require('express');
const { getUnreadEmails,sendReply } = require('../controllers/emailController');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get unread emails
router.get('/unread', requireAuth, getUnreadEmails);
router.post('/send-reply', requireAuth, sendReply);


module.exports = router;