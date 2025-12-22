const pool = require('../../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class UserModel {
  async create(userData) {
    const { username, email, password, avatar } = userData;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (id, username, email, password, avatar)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, avatar, created_at
    `;
    
    const result = await pool.query(query, [id, username, email, hashedPassword, avatar]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, email, avatar, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findAll() {
    const query = 'SELECT id, username, email, avatar, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  async update(id, userData) {
    const { username, email, avatar } = userData;
    const query = `
      UPDATE users 
      SET username = COALESCE($1, username),
          email = COALESCE($2, email),
          avatar = COALESCE($3, avatar)
      WHERE id = $4
      RETURNING id, username, email, avatar, created_at
    `;
    
    const result = await pool.query(query, [username, email, avatar, id]);
    return result.rows[0];
  }

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = $1 WHERE id = $2';
    await pool.query(query, [hashedPassword, id]);
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserModel();


