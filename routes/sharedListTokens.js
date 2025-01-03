const express = require('express');
const router = express.Router();
const listController = require('../controllers/sharedListTokens');

router.post('/generate-token', listController.generateToken);
router.get('/find-token/:token', listController.findToken);
router.get('/find-all-tokens', listController.findAllToken);
router.put('/grant-access', listController.grantAccess);
router.delete('/revoke-token/:token', listController.revokeToken);

module.exports = router;