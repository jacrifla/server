const express = require('express');
const router = express.Router();
const CategoriController = require('../controllers/category');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, CategoriController.createCategory);
router.get('/all', CategoriController.findAll);
router.put('/:categoryId', authMiddleware, CategoriController.updateCategory);
router.delete('/:categoryId', authMiddleware, CategoriController.deleteCategory);

module.exports = router;