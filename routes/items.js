const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.post('/', itemsController.createItem);
router.get('/all', itemsController.findAll);
router.get('/:item_id', itemsController.findById);
router.delete('/:item_id', itemsController.deleteItem);
router.put('/:item_id', itemsController.updateItem);
router.get('/', itemsController.searchAllWithPagination);
router.get('/search/name', itemsController.searchByName);
router.get('/search/barcode', itemsController.searchByBarcode);

module.exports = router;