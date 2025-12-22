const express = require('express');
const router = express.Router();
const likeController = require('./like.controller');
const { authenticateToken } = require('../../middleware/auth');

// Public routes
router.get('/post/:postId', likeController.getLikesByPost.bind(likeController));
router.get('/post/:postId/count', likeController.getLikeCount.bind(likeController));

// Protected routes
router.post('/toggle', authenticateToken, likeController.toggleLike.bind(likeController));
router.get('/post/:postId/status', authenticateToken, likeController.checkLikeStatus.bind(likeController));
router.get('/user/me', authenticateToken, likeController.getMyLikes.bind(likeController));

module.exports = router;


