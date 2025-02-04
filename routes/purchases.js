const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchases');

router.post('/', PurchaseController.createPurchase);
router.get('/total-spent', PurchaseController.getTotalSpent);
router.get('/most-purchased', PurchaseController.getMostPurchased);
router.get('/items-purchased', PurchaseController.getItemsPurchased);
router.get('/avg-spend-per-purchase', PurchaseController.getAvgSpendPerPurchase);
router.get('/largest-purchase', PurchaseController.getLargestPurchase);
router.get('/avg-daily-spend', PurchaseController.getAvgDailySpend);
router.get('/category-purchases', PurchaseController.getCategoryPurchases);
router.get('/comparison-spent', PurchaseController.getComparisonSpent);
router.get('/top-items-by-value', PurchaseController.getTopItemsByValue);

module.exports = router;