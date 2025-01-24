const express = require('express');
const router = express.Router();
const listController = require('../controllers/lists');

router.post('/', listController.createList);
router.get('/find-all', listController.findAllLists)
router.get('/:userId', listController.findListsByUserId);
router.put('/:listId', listController.updateList);
router.patch('/mark/:listId', listController.markAsCompleted);
router.delete('/:listId', listController.deleteList);

module.exports = router;