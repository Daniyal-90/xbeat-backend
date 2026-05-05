const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const routes = require('../routes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now, adjust as needed
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
app.use('/', routes);