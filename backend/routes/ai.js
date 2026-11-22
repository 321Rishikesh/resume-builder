const express = require('express');
const { protect } = require('../middleware/auth');
const { analyzeResume, generateResume } = require('../controllers/aiController');

const router = express.Router();

router.post('/analyze', protect, analyzeResume);
router.post('/generate', protect, generateResume);

module.exports = router;
