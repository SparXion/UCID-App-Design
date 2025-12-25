import express from 'express';
import cors from 'cors';
import studentRoutes from './student/student.controller';
import recommendationRoutes from './recommendation/recommendation.controller';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

