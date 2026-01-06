import { Router, Response } from 'express';
import { QuizResultService, SaveQuizResultDto } from './quiz-result.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';

const router = Router();
const quizResultService = new QuizResultService();

// All routes require authentication
router.use(authenticateToken);

// Save quiz result
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.studentId!;
    const dto: SaveQuizResultDto = req.body;
    
    if (!dto.quizData) {
      return res.status(400).json({ error: 'Quiz data is required' });
    }
    
    const result = await quizResultService.saveQuizResult(studentId, dto);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[Save Quiz Result] Error:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// Get all results for current student
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.studentId!;
    const results = await quizResultService.getStudentResults(studentId);
    res.json(results);
  } catch (error: any) {
    console.error('[Get Quiz Results] Error:', error);
    res.status(500).json({ error: 'Failed to get quiz results' });
  }
});

// Get specific result by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.studentId!;
    const { id } = req.params;
    
    const result = await quizResultService.getResultById(id, studentId);
    
    if (!result) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('[Get Quiz Result] Error:', error);
    res.status(500).json({ error: 'Failed to get quiz result' });
  }
});

// Delete a result
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.studentId!;
    const { id } = req.params;
    
    const deleted = await quizResultService.deleteResult(id, studentId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('[Delete Quiz Result] Error:', error);
    res.status(500).json({ error: 'Failed to delete quiz result' });
  }
});

// Admin endpoint - get all results (for analytics)
// Note: In production, add admin authentication check
router.get('/admin/all', async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    
    const results = await quizResultService.getAllResults(limit, offset);
    const total = await quizResultService.getResultsCount();
    
    res.json({
      results,
      total,
      limit,
      offset
    });
  } catch (error: any) {
    console.error('[Get All Quiz Results] Error:', error);
    res.status(500).json({ error: 'Failed to get all quiz results' });
  }
});

export default router;

