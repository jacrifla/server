const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.post('/', itemsController.createItem);
router.get('/all', itemsController.findAll);
router.get('/:itemId', itemsController.findById);
router.get('/', itemsController.searchAllWithPagination);
router.get('/search/name', itemsController.searchByName);
router.get('/search/barcode', itemsController.searchByBarcode);
router.put('/:itemId', itemsController.updateItem);
router.delete('/:itemId', itemsController.deleteItem);

module.exports = router;