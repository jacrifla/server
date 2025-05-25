const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/markets');

router.post('/', MarketController.createMarket);
router.get('/', MarketController.getAllMarkets);
router.put('/:marketId', MarketController.updateMarket);
router.delete('/:marketId', MarketController.deleteMarket);

module.exports = router;
