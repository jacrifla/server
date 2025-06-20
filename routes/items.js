const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, itemsController.createItem);
router.put('/:itemId', authMiddleware, itemsController.updateItem);
router.delete('/:itemId', authMiddleware, itemsController.deleteItem);
router.get('/search/:searchTerm', itemsController.getItemByBarcodeName);
router.get('/all', authMiddleware, itemsController.getAllItems);
router.get('/id/:itemId', authMiddleware, itemsController.getItemById);
router.patch('/:id/restore', authMiddleware, itemsController.getItemById);

module.exports = router;