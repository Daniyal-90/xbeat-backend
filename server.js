const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//const { V1_PATH } = require('./shared/constants');
//const mainRoutes = require("./routes/index");

const app = express();

/**
 * CORS
 */
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ].filter(Boolean),
  credentials: true
}));

/**
 * Middleware
 */
app.use(express.json());
app.use(cookieParser());

/**
 * Routes
 */
//app.use(V1_PATH, mainRoutes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'API running 🚀'
  });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/**
 * ✅ IMPORTANT: export app only
 */
module.exports = app;