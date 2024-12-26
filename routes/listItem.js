const express = require('express');
const router = express.Router();
const listItemsController = require('../controllers/listItem');

router.post('/', listItemsController.createItem);
router.get('/', listItemsController.getAllItems);
router.get('/:listItemId', listItemsController.getItemById);
router.put('/:list_item_id', listItemsController.updateItem);
router.delete('/:listItemId', listItemsController.deleteItem);
router.patch('/purchased/:list_item_id', listItemsController.markAsPurchased);

module.exports = router;
