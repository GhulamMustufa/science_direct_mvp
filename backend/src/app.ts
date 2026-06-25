import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './features/auth/auth.routes.js';
import { errorHandler } from './middleware/error.js';

// Load environment variables
dotenv.config();

const app = express();

// Standard middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API routes
app.use('/api/auth', authRouter);

// Global error handler (must be registered after all other routes and middlewares)
app.use(errorHandler);

export default app;
