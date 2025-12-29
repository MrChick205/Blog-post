const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { authenticateToken } = require('../../middleware/auth');
const uploadPostImage = require('../../middleware/upload');

router.get('/', postController.getAllPosts.bind(postController));

router.get('/user/me', authenticateToken, postController.getMyPosts.bind(postController));

router.get('/:id', postController.getPostById.bind(postController));

router.post(
  '/',
  authenticateToken,
  uploadPostImage.single('image'),
  (req, res, next) => {
    console.log('AFTER MULTER');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    next();
  },
  postController.createPost.bind(postController)
);

router.put(
  '/:id',
  authenticateToken,
  uploadPostImage.single('image'),
  postController.updatePost.bind(postController)
);

router.delete(
  '/:id',
  authenticateToken,
  postController.deletePost.bind(postController)
);


module.exports = router;


