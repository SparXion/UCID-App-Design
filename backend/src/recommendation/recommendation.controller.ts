import { Router, Response } from 'express';
import { RecommendationService } from './recommendation.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';

const router = Router();
const recommendationService = new RecommendationService();

// All recommendation routes require authentication
router.use(authenticateToken);

router.get('/students/:id/paths', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authenticatedId = req.studentId;

    // Ensure user can only get recommendations for their own account
    if (id !== authenticatedId) {
      return res.status(403).json({ error: 'You can only view recommendations for your own account' });
    }
    const paths = await recommendationService.getCareerPaths(id);
    res.json(paths);
  } catch (error: any) {
    console.error('Career paths error:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Failed to get career paths',
      details: error.message 
    });
  }
});

export default router;

