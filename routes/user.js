const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/create', userController.createUser);
router.post('/user/login', userController.loginUser);
router.get('/user', userController.findByEmail);
router.get('/user/:userId', userController.findById);
router.put('/user/:userId', userController.updateUser);
router.patch('/user/reset-password', userController.resetPasswordUser);
router.patch('/user', userController.restoreUser);
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;