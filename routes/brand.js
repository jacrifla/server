const express = require('express');
const router = express.Router();
const BrandController = require('../controllers/brand');

router.post('/brand', BrandController.createBrand);
router.put('/brand/:brand_id', BrandController.updateBrand);
router.get('/brand/all', BrandController.findAll);

module.exports = router;

