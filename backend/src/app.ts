import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './features/auth/auth.routes.js';
import journalsRouter from './features/journals/journals.routes.js';
import articlesRouter from './features/articles/articles.routes.js';
import taxonomyRouter from './features/taxonomy/taxonomy.routes.js';
import bookmarksRouter from './features/bookmarks/bookmarks.routes.js';

import notificationsRouter from './features/notifications/notifications.routes.js';
import profileRouter from './features/profile/profile.routes.js';
import authorRouter from './features/author/author.routes.js';
import adminRouter from './features/admin/admin.routes.js';
import submissionsRouter from './features/submissions/submissions.routes.js';
import editorialRouter from './features/editorial/editorial.routes.js';
import { errorHandler } from './middleware/error.js';




const app = express();

// Standard middlewares
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOrigins = [
  frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl,
  frontendUrl.endsWith('/') ? frontendUrl : `${frontendUrl}/`
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and any vercel preview deployment
    if (origin.startsWith('http://localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow the configured frontend URL
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(null, false);
  },
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
app.use('/api', journalsRouter);
app.use('/api', articlesRouter);
app.use('/api', taxonomyRouter);
app.use('/api', bookmarksRouter);

app.use('/api', notificationsRouter);
app.use('/api', profileRouter);
app.use('/api', authorRouter);
app.use('/api', adminRouter);
app.use('/api', submissionsRouter);
app.use('/api', editorialRouter);






import path from 'path';

// Global error handler (must be registered after all other routes and middlewares)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(errorHandler);

export default app;
