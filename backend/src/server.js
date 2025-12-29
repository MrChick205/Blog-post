const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
