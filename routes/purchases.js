const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchases');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, PurchaseController.createPurchase);
router.get('/total-spent', authMiddleware, PurchaseController.getTotalSpent);
router.get('/most-purchased', authMiddleware, PurchaseController.getMostPurchased);
router.get('/items-purchased', authMiddleware, PurchaseController.getItemsPurchased);
router.get('/avg-spend-per-purchase', authMiddleware, PurchaseController.getAvgSpendPerPurchase);
router.get('/largest-purchase', authMiddleware, PurchaseController.getLargestPurchase);
router.get('/avg-daily-spend', authMiddleware, PurchaseController.getAvgDailySpend);
router.get('/category-purchases', authMiddleware, PurchaseController.getCategoryPurchases);
router.get('/comparison-spent', authMiddleware, PurchaseController.getComparisonSpent);
router.get('/top-items-by-value', authMiddleware, PurchaseController.getTopItemsByValue);

module.exports = router;