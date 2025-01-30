router.post('/compare-spending/:userId', listController.getTotalSpentByPeriod);
router.post('/compare-spending-category/:userId', listController.compareSpendingByCategory);
