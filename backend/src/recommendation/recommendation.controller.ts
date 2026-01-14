import { Router, Response } from 'express';
import { RecommendationService } from './recommendation.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { AppError } from '../middleware/error-handler';
import { cache, cacheKeys } from '../utils/cache';
import { parsePagination, createPaginationResult } from '../utils/pagination';
import { validateQuery } from '../middleware/validator';
import { paginationSchema } from '../validation/schemas';
import { logger } from '../utils/logger';
import { AnalyticsService } from '../analytics/analytics.service';

const router = Router();
const recommendationService = new RecommendationService();
const analyticsService = new AnalyticsService();

const getSessionId = (req: AuthRequest) => {
  const headerId = req.headers['x-session-id'];
  return typeof headerId === 'string' ? headerId : undefined;
};

// All recommendation routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/recommendations/students/{id}/paths:
 *   get:
 *     summary: Get career path recommendations for a student
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Career paths retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       403:
 *         description: Forbidden - can only access own recommendations
 */
router.get('/students/:id/paths', validateQuery(paginationSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const authenticatedId = req.studentId;

    // Ensure user can only get recommendations for their own account
    if (id !== authenticatedId) {
      throw new AppError(403, 'You can only view recommendations for your own account', 'FORBIDDEN');
    }

    // Check cache first
    const cacheKey = cacheKeys.studentRecommendations(id);
    const cached = cache.get<any[]>(cacheKey);
    
    // Parse pagination with defaults
    const pagination = parsePagination(req.query);
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    
    if (cached) {
      logger.debug('Returning cached recommendations', { studentId: id });
      
      // Apply pagination to cached data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = cached.slice(startIndex, endIndex);
      
      return res.json(createPaginationResult(
        paginatedData,
        cached.length,
        page,
        limit
      ));
    }

    // Fetch from service
    const paths = await recommendationService.getCareerPaths(id);
    
    // Cache for 1 hour (3600000 ms)
    cache.set(cacheKey, paths, 3600000);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = paths.slice(startIndex, endIndex);
    
    res.set('Cache-Control', 'public, max-age=3600'); // HTTP cache header
    await analyticsService.trackEvent({
      studentId: id,
      sessionId: getSessionId(req),
      name: 'recommendations_viewed',
      properties: {
        total: paths.length,
        page,
        limit
      }
    });
    res.json(createPaginationResult(
      paginatedData,
      paths.length,
      page,
      limit
    ));
  } catch (error) {
    next(error);
  }
});

export default router;
