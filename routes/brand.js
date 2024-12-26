const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand');

router.post('/', BrandController.createBrand);
router.put('/:brand_id', BrandController.updateBrand);
router.get('/all', BrandController.findAll);

module.exports = router;

