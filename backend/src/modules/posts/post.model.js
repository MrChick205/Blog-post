const pool = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

class PostModel {
  async create(postData) {
    const { title, content, image, user_id } = postData;
    const id = uuidv4();
    
    const query = `
      INSERT INTO posts (id, title, content, image, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, title, content, image, user_id]);
    return result.rows[0];
  }

  async findAll(options = {}) {
    const { limit = 10, offset = 0, user_id } = options;
    let query = `
      SELECT p.*, 
             u.username, u.email, u.avatar as user_avatar,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
    `;
    
    const params = [];
    if (user_id) {
      query += ' WHERE p.user_id = $1';
      params.push(user_id);
    }
    
    query += ' GROUP BY p.id, u.username, u.email, u.avatar';
    query += ' ORDER BY p.created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    params.push(limit, offset);
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const query = `
      SELECT p.*, 
             u.username, u.email, u.avatar as user_avatar,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, u.email, u.avatar
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, postData) {
    const { title, content, image } = postData;
    const query = `
      UPDATE posts 
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          image = COALESCE($3, image),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, content, image, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = `
      SELECT p.*, 
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new PostModel();


