const commentModel = require('./comment.model');

class CommentController {
  async createComment(req, res) {
    try {
      const { content, post_id } = req.body;
      const user_id = req.userId;

      if (!content || !post_id) {
        return res.status(400).json({ error: 'Content and post_id are required' });
      }

      const comment = await commentModel.create({ content, user_id, post_id });
      const commentWithUser = await commentModel.findById(comment.id);
      
      res.status(201).json({
        message: 'Comment created successfully',
        comment: commentWithUser
      });
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      const comments = await commentModel.findByPostId(postId);
      res.json(comments);
    } catch (error) {
      console.error('Get comments by post error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCommentById(req, res) {
    try {
      const { id } = req.params;
      const comment = await commentModel.findById(id);
      
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json(comment);
    } catch (error) {
      console.error('Get comment by id error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = req.userId;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Check if comment exists and belongs to user
      const existingComment = await commentModel.findById(id);
      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (existingComment.user_id !== user_id) {
        return res.status(403).json({ error: 'You can only update your own comments' });
      }

      const comment = await commentModel.update(id, content);
      const commentWithUser = await commentModel.findById(id);
      
      res.json({
        message: 'Comment updated successfully',
        comment: commentWithUser
      });
    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      // Check if comment exists and belongs to user
      const existingComment = await commentModel.findById(id);
      if (!existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (existingComment.user_id !== user_id) {
        return res.status(403).json({ error: 'You can only delete your own comments' });
      }

      await commentModel.delete(id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyComments(req, res) {
    try {
      const user_id = req.userId;
      const comments = await commentModel.findByUserId(user_id);
      res.json(comments);
    } catch (error) {
      console.error('Get my comments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CommentController();


