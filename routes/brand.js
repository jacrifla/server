const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand');

router.post('/', brandController.createBrand);
router.get('/all', brandController.findAll);
router.put('/:brandId', brandController.updateBrand);
router.delete('/:brandId', brandController.deleteBrand);

module.exports = router;

