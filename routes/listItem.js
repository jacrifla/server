const express = require('express');
const router = express.Router();
const listItemsController = require('../controllers/listItem');

router.post('/', listItemsController.createItem);
router.get('/', listItemsController.getAllItems);
router.get('/:listId', listItemsController.getListById);
router.put('/:itemListId', listItemsController.updateItem);
router.delete('/:itemListId', listItemsController.deleteItem);
router.patch('/purchased/:itemListId', listItemsController.markAsPurchased);

module.exports = router;
