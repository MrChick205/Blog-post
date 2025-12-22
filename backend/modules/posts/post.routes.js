const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public routes
router.get('/', postController.getAllPosts.bind(postController));
router.get('/:id', postController.getPostById.bind(postController));

// Protected routes
router.post('/', authenticateToken, postController.createPost.bind(postController));
router.put('/:id', authenticateToken, postController.updatePost.bind(postController));
router.delete('/:id', authenticateToken, postController.deletePost.bind(postController));
router.get('/user/me', authenticateToken, postController.getMyPosts.bind(postController));

module.exports = router;


