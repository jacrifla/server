const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.post('/', itemsController.createItem);
router.get('/all', itemsController.findAll);
router.get('/:item_id', itemsController.findById);
router.get('/', itemsController.searchAllWithPagination);
router.get('/search/name', itemsController.searchByName);
router.get('/search/barcode', itemsController.searchByBarcode);
router.put('/:item_id', itemsController.updateItem);
router.delete('/:item_id', itemsController.deleteItem);

module.exports = router;