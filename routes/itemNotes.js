const express = require('express');
const router = express.Router();
const itemNotesController = require('../controllers/itemNotes');

router.post('/', itemNotesController.createNote);
router.get('/:item_id', itemNotesController.getNotes);
router.put('/update', itemNotesController.updateNote);
router.delete('/delete', itemNotesController.deleteNote);

module.exports = router;