const express = require('express');
const router = express.Router();
const priceHistoryController = require('../controllers/priceHistory');

router.post('/', priceHistoryController.createPriceHistory);
router.get('/:itemId', priceHistoryController.getPriceHistory);

module.exports = router;