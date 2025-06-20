const express = require('express');
const router = express.Router();
const listItemsController = require('../controllers/listItem');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, listItemsController.createItem);
router.get('/:listId', authMiddleware, listItemsController.getItemsByListId);
router.put('/:itemListId', authMiddleware, listItemsController.updateItem);
router.delete('/:itemListId', authMiddleware, listItemsController.deleteItem);
router.post('/purchase', authMiddleware, listItemsController.markAsPurchased);

module.exports = router;
