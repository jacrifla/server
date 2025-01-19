const express = require('express');
const router = express.Router();
const listItemsController = require('../controllers/listItem');

router.post('/', listItemsController.createItem);
router.get('/:listId', listItemsController.getItemsByListId);
router.put('/:itemListId', listItemsController.updateItem);
router.delete('/:itemListId', listItemsController.deleteItem);
router.post('/purchase', listItemsController.markAsPurchased);

module.exports = router;
