const postModel = require('./post.model');

class PostController {
  async createPost(req, res) {
    try {
      const { title, content, image } = req.body;
      const user_id = req.userId;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const post = await postModel.create({ title, content, image, user_id });
      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllPosts(req, res) {
    try {
      const { limit = 10, offset = 0, user_id } = req.query;
      const posts = await postModel.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        user_id: user_id || null
      });
      res.json(posts);
    } catch (error) {
      console.error('Get all posts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Get post by id error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content, image } = req.body;
      const user_id = req.userId;

      // Check if post exists and belongs to user
      const existingPost = await postModel.findById(id);
      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.user_id !== user_id) {
        return res.status(403).json({ error: 'You can only update your own posts' });
      }

      const post = await postModel.update(id, { title, content, image });
      res.json({
        message: 'Post updated successfully',
        post
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      // Check if post exists and belongs to user
      const existingPost = await postModel.findById(id);
      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.user_id !== user_id) {
        return res.status(403).json({ error: 'You can only delete your own posts' });
      }

      await postModel.delete(id);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyPosts(req, res) {
    try {
      const user_id = req.userId;
      const posts = await postModel.findByUserId(user_id);
      res.json(posts);
    } catch (error) {
      console.error('Get my posts error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new PostController();


