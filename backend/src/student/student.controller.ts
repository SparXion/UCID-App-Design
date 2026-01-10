import { Router, Response } from 'express';
import { StudentProfileService } from './student.service';
import { QuizSubmissionDto } from './dto/quiz-submission.dto';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { quizLimiter } from '../middleware/rate-limiter';
import { validateBody } from '../middleware/validator';
import { quizSubmissionSchema } from '../validation/schemas';
import { AppError } from '../middleware/error-handler';
import { cache, cacheKeys } from '../utils/cache';
import { logger } from '../utils/logger';

const router = Router();
const studentService = new StudentProfileService();
const prisma = new PrismaClient();

// All student routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/v1/students/{id}/quiz:
 *   post:
 *     summary: Submit quiz results (talents and interests)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - talents
 *               - interests
 *             properties:
 *               talents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     measuredScore:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 100
 *               interests:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     topic:
 *                       type: string
 *                     strength:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 5
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - can only submit quiz for own account
 */
router.post('/:id/quiz', quizLimiter, validateBody(quizSubmissionSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const authenticatedId = req.studentId;

    // Ensure user can only submit quiz for their own account
    if (id !== authenticatedId) {
      throw new AppError(403, 'You can only submit quiz for your own account', 'FORBIDDEN');
    }
    
    const dto = req.body as QuizSubmissionDto;
    
    logger.info('Quiz submission started', { studentId: id, talentsCount: dto.talents?.length || 0, interestsCount: dto.interests?.length || 0 });
    
    await studentService.submitQuiz(id, dto);
    
    // Invalidate cache for this student's recommendations
    cache.delete(cacheKeys.studentRecommendations(id));
    cache.delete(cacheKeys.studentProfile(id));
    
    logger.info('Quiz submission successful', { studentId: id });
    res.json({ success: true });
  } catch (error) {
    logger.error('Quiz submission failed', { error: (error as Error).message, studentId: req.params.id });
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/students/{id}/quiz-status:
 *   get:
 *     summary: Check if student has completed quiz
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Quiz status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasQuiz:
 *                   type: boolean
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 */
router.get('/:id/quiz-status', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const authenticatedId = req.studentId;

    // Ensure user can only check quiz status for their own account
    if (id !== authenticatedId) {
      throw new AppError(403, 'You can only check quiz status for your own account', 'FORBIDDEN');
    }
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        interests: true,
        talents: true
      }
    });

    if (!student) {
      throw new AppError(404, 'Student not found', 'STUDENT_NOT_FOUND');
    }

    const hasQuiz = student.interests.length > 0 || student.talents.length > 0;
    res.json({ hasQuiz });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 talents:
 *                   type: array
 *                 interests:
 *                   type: array
 *                 hybridMode:
 *                   type: string
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 */
router.get('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const authenticatedId = req.studentId;

    // Ensure user can only get their own data
    if (id !== authenticatedId) {
      throw new AppError(403, 'You can only access your own data', 'FORBIDDEN');
    }
    
    // Check cache
    const cacheKey = cacheKeys.studentProfile(id);
    const cached = cache.get<any>(cacheKey);
    
    if (cached) {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      return res.json(cached);
    }
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        interests: true,
        talents: true
      }
    });

    if (!student) {
      throw new AppError(404, 'Student not found', 'STUDENT_NOT_FOUND');
    }

    const response = {
      id: student.id,
      name: student.name,
      email: student.email,
      year: student.year,
      talents: student.talents,
      interests: student.interests,
      hybridMode: student.hybridMode
    };
    
    // Cache for 5 minutes
    cache.set(cacheKey, response, 300000);
    res.set('Cache-Control', 'public, max-age=300');
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
