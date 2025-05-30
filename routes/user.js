const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/by-email', userController.findByEmail);
router.get('/all', userController.getAllUsers);
router.get('/:userId', userController.findById);
router.put('/:userId', userController.updateUser);
router.patch('/reset-password', userController.resetPasswordUser);
router.patch('/restore', userController.restoreUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;