const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand');

router.post('/', BrandController.createBrand);
router.get('/all', BrandController.findAll);
router.put('/:brandId', BrandController.updateBrand);
router.delete('/:brandId', BrandController.deleteBrand);

module.exports = router;

