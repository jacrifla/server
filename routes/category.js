const express = require('express');
const router = express.Router();
const CategoriController = require('../controllers/category');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, CategoriController.createCategory);
router.get('/', CategoriController.findAll);
router.put('/:id', authMiddleware, CategoriController.updateCategory);
router.delete('/:id', authMiddleware, CategoriController.deleteCategory);

module.exports = router;