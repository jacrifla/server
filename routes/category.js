const express = require('express');
const router = express.Router();
const CategoriController = require('../controllers/category');

router.post('/', CategoriController.createCategory);
router.get('/all', CategoriController.findAll);
router.put('/:category_id', CategoriController.updateCategory);
router.delete('/:category_id', CategoriController.deleteCategory);

module.exports = router;