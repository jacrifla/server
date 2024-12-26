const express = require('express');
const router = express.Router();
const listController = require('../controllers/shoppingList');

router.post('/', listController.createList);
router.get('/all', listController.findAllLists)
router.get('/:userId', listController.findListsByUserId);
router.put('/:listId', listController.updateList);
router.patch('/mark/:listId', listController.markAsCompleted);
router.delete('/:listId', listController.deleteList);

module.exports = router;