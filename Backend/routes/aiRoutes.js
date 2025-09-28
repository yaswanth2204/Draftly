const express = require('express');
const { generateReply, regenerateReply } = require('../controllers/aiController');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

router.post('/generate-reply', requireAuth, generateReply);
router.post('/regenerate-reply', requireAuth, regenerateReply);

module.exports = router;