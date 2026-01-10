import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoutes from './auth/auth.controller';
import studentRoutes from './student/student.controller';
import recommendationRoutes from './recommendation/recommendation.controller';
import quizResultRoutes from './quiz-result/quiz-result.controller';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limiter';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Swagger/OpenAPI configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UCID App API',
      version: '1.0.0',
      description: 'API documentation for the UCID (University Career & Industry Discovery) App',
      contact: {
        name: 'UCID API Support',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Parse CORS_ORIGIN - can be comma-separated string or single origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = corsOrigin.includes(',') 
  ? corsOrigin.split(',').map(o => o.trim())
  : corsOrigin;

// Middleware
app.use(compression()); // Compress responses
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (Array.isArray(allowedOrigins)) {
      if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => {
        // Support wildcard patterns like *.netlify.app
        if (allowed.includes('*')) {
          const pattern = allowed.replace('*', '.*');
          return new RegExp(`^${pattern}$`).test(origin);
        }
        return allowed === origin;
      })) {
        return callback(null, true);
      }
    } else if (allowedOrigins === origin || allowedOrigins === '*') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check with database status
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message });
    res.status(503).json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Apply rate limiting to all API routes
app.use('/api/v1', apiLimiter);

// Auth routes (public)
app.use('/api/v1/auth', authRoutes);

// API routes (protected)
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/quiz-results', quizResultRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on http://0.0.0.0:${PORT}`);
  logger.info(`API Documentation available at http://0.0.0.0:${PORT}/api-docs`);
});
