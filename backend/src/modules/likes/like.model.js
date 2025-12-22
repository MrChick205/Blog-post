const pool = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

class LikeModel {
  async create(likeData) {
    const { user_id, post_id } = likeData;
    const id = uuidv4();
    
    const query = `
      INSERT INTO likes (id, user_id, post_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, user_id, post_id]);
    return result.rows[0];
  }

  async findByPostId(postId) {
    const query = `
      SELECT l.*, 
             u.username, u.email, u.avatar as user_avatar
      FROM likes l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.post_id = $1
      ORDER BY l.created_at DESC
    `;
    
    const result = await pool.query(query, [postId]);
    return result.rows;
  }

  async findByUserAndPost(userId, postId) {
    const query = 'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2';
    const result = await pool.query(query, [userId, postId]);
    return result.rows[0];
  }

  async delete(userId, postId) {
    const query = 'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING id';
    const result = await pool.query(query, [userId, postId]);
    return result.rows[0];
  }

  async countByPostId(postId) {
    const query = 'SELECT COUNT(*) as count FROM likes WHERE post_id = $1';
    const result = await pool.query(query, [postId]);
    return parseInt(result.rows[0].count);
  }

  async findByUserId(userId) {
    const query = `
      SELECT l.*, 
             p.title as post_title,
             u.username, u.email, u.avatar as user_avatar
      FROM likes l
      LEFT JOIN posts p ON l.post_id = p.id
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.user_id = $1
      ORDER BY l.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new LikeModel();


