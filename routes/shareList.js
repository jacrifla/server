const express = require('express');
const router = express.Router();
const sharedListController = require('../controllers/shareList');

router.post('/', sharedListController.shareList);
router.get('/:user_id', sharedListController.getSharedLists);
router.delete('/:shared_list_id', sharedListController.deleteSharedList);

module.exports = router;