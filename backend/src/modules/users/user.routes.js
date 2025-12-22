const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public routes
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));

// Protected routes
router.get('/profile/me', authenticateToken, userController.getProfile.bind(userController));
router.put('/profile/me', authenticateToken, userController.updateProfile.bind(userController));
router.delete('/profile/me', authenticateToken, userController.deleteUser.bind(userController));

module.exports = router;


