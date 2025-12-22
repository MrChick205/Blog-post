const pool = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

class CommentModel {
  async create(commentData) {
    const { content, user_id, post_id } = commentData;
    const id = uuidv4();
    
    const query = `
      INSERT INTO comments (id, content, user_id, post_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, content, user_id, post_id]);
    return result.rows[0];
  }

  async findByPostId(postId) {
    const query = `
      SELECT c.*, 
             u.username, u.email, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `;
    
    const result = await pool.query(query, [postId]);
    return result.rows;
  }

  async findById(id) {
    const query = `
      SELECT c.*, 
             u.username, u.email, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, content) {
    const query = `
      UPDATE comments 
      SET content = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [content, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM comments WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = `
      SELECT c.*, 
             p.title as post_title,
             u.username, u.email, u.avatar as user_avatar
      FROM comments c
      LEFT JOIN posts p ON c.post_id = p.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new CommentModel();


