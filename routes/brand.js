const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand');

router.post('/', BrandController.createBrand);
router.get('/all', BrandController.findAll);
router.put('/:brand_id', BrandController.updateBrand);
router.delete('/:brand_id', BrandController.deleteBrand);

module.exports = router;

