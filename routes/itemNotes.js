const express = require('express');
const router = express.Router();
const itemNotesController = require('../controllers/itemNotes');

router.post('/', itemNotesController.createNote);
router.get('/:itemId', itemNotesController.getNotes);
router.put('/update', itemNotesController.updateNote);

module.exports = router;