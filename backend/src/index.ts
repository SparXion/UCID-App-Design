import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.controller';
import studentRoutes from './student/student.controller';
import recommendationRoutes from './recommendation/recommendation.controller';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Parse CORS_ORIGIN - can be comma-separated string or single origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = corsOrigin.includes(',') 
  ? corsOrigin.split(',').map(o => o.trim())
  : corsOrigin;

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

// Auth routes (public)
app.use('/api/v1/auth', authRoutes);

// API routes (protected)
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

