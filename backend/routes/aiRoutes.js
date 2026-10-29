const express = require('express');
const router = express.Router();
const { matchWorkers, parseRequirement, suggestSalary, chatAssistant, analyzeSentiment } = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/match', protect, matchWorkers);
router.post('/parse-requirement', optionalAuth, parseRequirement);
router.post('/salary-suggestion', optionalAuth, suggestSalary);
router.post('/assistant', optionalAuth, chatAssistant);
router.post('/sentiment', protect, analyzeSentiment);

module.exports = router;
