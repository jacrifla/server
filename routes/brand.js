const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, brandController.createBrand);
router.get('/', brandController.findAll);
router.delete('/:id', authMiddleware, brandController.deleteBrand);
router.put('/:id', authMiddleware, brandController.updateBrand);

module.exports = router;

