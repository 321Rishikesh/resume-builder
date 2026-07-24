const express = require('express');
const { protect } = require('../middleware/auth');
const { analyzeResume } = require('../controllers/aiController');

const router = express.Router();

router.post('/analyze', protect, analyzeResume);

module.exports = router;
