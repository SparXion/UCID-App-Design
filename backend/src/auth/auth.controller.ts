import { Router, Response } from 'express';
import { AuthService } from './auth.service';
import { authenticateToken, AuthRequest } from './auth.middleware';
import { authLimiter } from '../middleware/rate-limiter';
import { validateBody } from '../middleware/validator';
import { signUpSchema, signInSchema, refreshTokenSchema } from '../validation/schemas';
import { AppError } from '../middleware/error-handler';
import { logger } from '../utils/logger';

const router = Router();
const authService = new AuthService();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               year:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 student:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post('/signup', authLimiter, validateBody(signUpSchema), async (req, res: Response, next) => {
  try {
    const result = await authService.signUp(req.body);
    logger.info('User signed up', { email: req.body.email });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      throw new AppError(409, error.message, 'EMAIL_ALREADY_EXISTS');
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Sign in with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 student:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/signin', authLimiter, validateBody(signInSchema), async (req, res: Response, next) => {
  try {
    const result = await authService.signIn(req.body);
    logger.info('User signed in', { email: req.body.email });
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      throw new AppError(401, error.message, 'INVALID_CREDENTIALS');
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', authLimiter, validateBody(refreshTokenSchema), async (req, res: Response, next) => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    logger.info('Token refreshed', { studentId: req.body.refreshToken });
    res.json(result);
  } catch (error: any) {
    throw new AppError(401, error.message, 'INVALID_REFRESH_TOKEN');
  }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const studentId = req.studentId!;
    const student = await authService.getStudentById(studentId);

    if (!student) {
      throw new AppError(404, 'Student not found', 'STUDENT_NOT_FOUND');
    }

    res.json({ student });
  } catch (error) {
    next(error);
  }
});

export default router;
