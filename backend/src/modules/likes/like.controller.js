const likeModel = require('./like.model');

class LikeController {
  async toggleLike(req, res) {
    try {
      const { post_id } = req.body;
      const user_id = req.userId;

      if (!post_id) {
        return res.status(400).json({ error: 'post_id is required' });
      }

      // Check if like already exists
      const existingLike = await likeModel.findByUserAndPost(user_id, post_id);

      if (existingLike) {
        // Unlike
        await likeModel.delete(user_id, post_id);
        res.json({
          message: 'Post unliked successfully',
          liked: false
        });
      } else {
        // Like
        const like = await likeModel.create({ user_id, post_id });
        res.status(201).json({
          message: 'Post liked successfully',
          like,
          liked: true
        });
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'You have already liked this post' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLikesByPost(req, res) {
    try {
      const { postId } = req.params;
      const likes = await likeModel.findByPostId(postId);
      res.json(likes);
    } catch (error) {
      console.error('Get likes by post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLikeCount(req, res) {
    try {
      const { postId } = req.params;
      const count = await likeModel.countByPostId(postId);
      res.json({ post_id: postId, like_count: count });
    } catch (error) {
      console.error('Get like count error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkLikeStatus(req, res) {
    try {
      const { postId } = req.params;
      const user_id = req.userId;
      
      const like = await likeModel.findByUserAndPost(user_id, postId);
      res.json({ liked: !!like });
    } catch (error) {
      console.error('Check like status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyLikes(req, res) {
    try {
      const user_id = req.userId;
      const likes = await likeModel.findByUserId(user_id);
      res.json(likes);
    } catch (error) {
      console.error('Get my likes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new LikeController();


