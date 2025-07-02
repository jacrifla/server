const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/markets');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, MarketController.createMarket);
router.get('/', MarketController.findAll);
router.put('/:id', authMiddleware, MarketController.updateMarket);
router.delete('/:id', authMiddleware, MarketController.deleteMarket);

module.exports = router;
