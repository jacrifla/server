const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/markets');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, MarketController.createMarket);
router.get('/', MarketController.getAllMarkets);
router.put('/:marketId', authMiddleware, MarketController.updateMarket);
router.delete('/:marketId', authMiddleware, MarketController.deleteMarket);

module.exports = router;
