const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchases');

router.post('/', PurchaseController.createPurchase);
router.get('/total-spent', PurchaseController.getTotalSpent);
router.get('/most-purchased', PurchaseController.getMostPurchased);
router.get('/items-purchased', PurchaseController.getItemsPurchased);

module.exports = router;