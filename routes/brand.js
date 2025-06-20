const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, brandController.createBrand);
router.get('/all', brandController.findAll);
router.put('/:brandId', authMiddleware, brandController.updateBrand);
router.delete('/:brandId', authMiddleware, brandController.deleteBrand);

module.exports = router;

