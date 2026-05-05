import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { V1_PATH } from './shared/constants.js';
import mainRoutes from './routes/index.js';

const app = express();

/**
 * ✅ CORS
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
 * ✅ Middleware
 */
app.use(express.json());
app.use(cookieParser());

/**
 * ✅ Routes
 */
app.use(V1_PATH, mainRoutes);

/**
 * ✅ Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API running 🚀' });
});

/**
 * ❌ REMOVE app.listen (NOT allowed on Vercel)
 * ❌ REMOVE direct mongoose.connect here
 */

/**
 * ✅ Lazy MongoDB connection (serverless safe)
 */
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;

  console.log("MongoDB connectedddd ✅");
}

/**
 * ✅ Export app (VERY IMPORTANT)
 */
export default app;