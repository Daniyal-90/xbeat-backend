const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const routes = require('../routes');
const { V1_PATH } = require('../shared/constants');

require('dotenv').config();

const app = express();

if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
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
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bachat-bazaar');
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Connect DB on each request (for serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Use routes
app.use(V1_PATH, routes); // V1_PATH is /api/v1

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For Vercel serverless
module.exports = serverless(app);