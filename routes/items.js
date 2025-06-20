const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.post('/', itemsController.createItem);
router.put('/:itemId', itemsController.updateItem);
router.delete('/:itemId', itemsController.deleteItem);
router.get('/search/:searchTerm', itemsController.getItemByBarcodeName);
router.get('/all', itemsController.getAllItems);
router.get('/id/:itemId', itemsController.getItemById);
router.patch('/:id/restore', itemsController.getItemById);

module.exports = router;