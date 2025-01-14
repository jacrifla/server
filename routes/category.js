const express = require('express');
const router = express.Router();
const CategoriController = require('../controllers/category');

router.post('/', CategoriController.createCategory);
router.get('/all', CategoriController.findAll);
router.put('/:categoryId', CategoriController.updateCategory);
router.delete('/:categoryId', CategoriController.deleteCategory);

module.exports = router;