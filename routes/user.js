const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/by-email', userController.findByEmail);
router.get('/all', authMiddleware, userController.getAllUsers);
router.get('/:userId', authMiddleware, userController.findById);
router.put('/:userId', authMiddleware, userController.updateUser);
router.patch('/reset-password', authMiddleware, userController.resetPasswordUser);
router.patch('/restore', userController.restoreUser);
router.delete('/:userId', authMiddleware, userController.deleteUser);

module.exports = router;