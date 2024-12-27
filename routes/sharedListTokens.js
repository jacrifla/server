const express = require('express');
const router = express.Router();
const listController = require('../controllers/sharedListTokens');

router.post('/share/:listId', listController.shareList);
router.get('/token/:token', listController.findToken);
router.get('/all', listController.findAlltoken);
router.delete('/token/:token', listController.deleteToken);

module.exports = router;