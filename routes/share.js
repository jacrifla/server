const express = require('express');
const router = express.Router();
const shareController = require('../controllers/share');

router.post('/generate-token', shareController.generateShareToken);
router.post('/accept-token', shareController.acceptShareToken);

module.exports = router;