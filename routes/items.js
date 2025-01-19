const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.post('/', itemsController.createItem);
router.put('/:itemId', itemsController.updateItem);
router.delete('/:itemId', itemsController.deleteItem);
router.get('/search/:searchTerm', itemsController.getItemByBarcodeNameOrId);
router.get('/all', itemsController.getAllItems);

module.exports = router;