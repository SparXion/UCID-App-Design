import { Router, Request, Response } from 'express';
import { RecommendationService } from './recommendation.service';

const router = Router();
const recommendationService = new RecommendationService();

router.get('/students/:id/paths', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paths = await recommendationService.getCareerPaths(id);
    res.json(paths);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get career paths' });
  }
});

export default router;

