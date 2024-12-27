const express = require('express');
const router = express.Router();
const priceHistoryController = require('../controllers/priceHistory');

router.post('/', priceHistoryController.createPriceHistory);
router.get('/:item_id', priceHistoryController.getPriceHistory);

module.exports = router;