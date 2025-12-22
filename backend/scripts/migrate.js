const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function migrate() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../config/db-init.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();


