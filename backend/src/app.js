const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Routes
const userRoutes = require('./modules/users/user.routes');
const postRoutes = require('./modules/posts/post.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const likeRoutes = require('./modules/likes/like.routes');

const app = express();

/**
 * =========================
 * GLOBAL MIDDLEWARE
 * =========================
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

/**
 * ❗ QUAN TRỌNG:
 * Routes dùng multer (multipart/form-data)
 * PHẢI đặt TRƯỚC express.json()
 */
app.use('/api/posts', postRoutes);

/**
 * Body parser (SAU multer)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Static files
 * http://localhost:3000/uploads/posts/xxx.jpg
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/**
 * Other API routes
 */
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('🔥 Global error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

module.exports = app;
