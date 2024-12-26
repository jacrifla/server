const express = require('express');
const router = express.Router();
const CategoriController = require('../controllers/category');

router.post('/category', CategoriController.createCategory);
router.get('/category/all', CategoriController.findAll);
router.put('/category/:category_id', CategoriController.updateCategory);

module.exports = router;