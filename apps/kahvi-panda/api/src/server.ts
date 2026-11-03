import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { CONFIG } from './config';
import routes from './routes';
import prisma from './db';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (CONFIG.CORS_ORIGIN.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked by Kahvi Panda security policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// JSON body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (CONFIG.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Global API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again in a few minutes.' }
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Kahvi Panda API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount /api/v1 router
app.use(CONFIG.API_PREFIX, routes);

// Global 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found on Kahvi Panda API' });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(CONFIG.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Server bootstrap with safe port fallback in local development
const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`🐼 Kahvi Panda API is purring at http://localhost:${port}${CONFIG.API_PREFIX}`);
    console.log(`☕ Environment: ${CONFIG.NODE_ENV} | Target WhatsApp: ${CONFIG.WHATSAPP.OFFICIAL_DISPLAY}`);
  });

  server.on('error', async (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Retrying on ${fallbackPort}.`);
      startServer(fallbackPort);
      return;
    }

    console.error('Failed to start Kahvi Panda API server.', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server and database pool...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });
};

startServer(Number(process.env.PORT || CONFIG.PORT));

export default app;
