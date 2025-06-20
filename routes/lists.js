const express = require('express');
const router = express.Router();
const listController = require('../controllers/lists');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, listController.createList);
router.get('/find-all', authMiddleware, listController.findAllLists)
router.get('/:userId', authMiddleware, listController.findListsByUserId);
router.put('/:listId', authMiddleware, listController.updateList);
router.patch('/mark/:listId', authMiddleware, listController.markAsCompleted);
router.delete('/:listId', authMiddleware, listController.deleteList);

module.exports = router;