const express = require('express');
const router = express.Router();
const commentController = require('./comment.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public routes
router.get('/post/:postId', commentController.getCommentsByPost.bind(commentController));
router.get('/:id', commentController.getCommentById.bind(commentController));

// Protected routes
router.post('/', authenticateToken, commentController.createComment.bind(commentController));
router.put('/:id', authenticateToken, commentController.updateComment.bind(commentController));
router.delete('/:id', authenticateToken, commentController.deleteComment.bind(commentController));
router.get('/user/me', authenticateToken, commentController.getMyComments.bind(commentController));

module.exports = router;


