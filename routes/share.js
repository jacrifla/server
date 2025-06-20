const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate-token', authMiddleware, shareController.generateShareToken);
router.post('/accept-token', shareController.acceptShareToken);

module.exports = router;