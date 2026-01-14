import { Router, Response } from 'express';
import { optionalAuth, authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { AnalyticsService } from './analytics.service';
import { validateBody, validateQuery } from '../middleware/validator';
import { eventSchema, surveySchema, promptSchema, analyticsQuerySchema } from '../validation/schemas';
import { AppError } from '../middleware/error-handler';

const router = Router();
const analyticsService = new AnalyticsService();

const getSessionId = (req: AuthRequest) => {
  const headerId = req.headers['x-session-id'];
  if (typeof headerId === 'string') return headerId;
  return undefined;
};

const requireAdmin = (req: AuthRequest) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return;
  const provided = req.headers['x-admin-key'];
  if (provided !== adminKey) {
    throw new AppError(403, 'Admin access required', 'FORBIDDEN');
  }
};

// Track event
router.post('/events', optionalAuth, validateBody(eventSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const sessionId = getSessionId(req);
    const event = await analyticsService.trackEvent({
      studentId: req.studentId || null,
      sessionId,
      name: req.body.name,
      properties: req.body.properties || null
    });
    res.status(201).json({ id: event.id });
  } catch (error) {
    next(error);
  }
});

// Save survey response
router.post('/surveys', optionalAuth, validateBody(surveySchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const sessionId = getSessionId(req);
    const response = await analyticsService.saveSurvey({
      studentId: req.studentId || null,
      sessionId,
      type: req.body.type,
      responses: req.body.responses
    });
    res.status(201).json({ id: response.id });
  } catch (error) {
    next(error);
  }
});

// Save prompt response
router.post('/prompts', optionalAuth, validateBody(promptSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const sessionId = getSessionId(req);
    const response = await analyticsService.savePrompt({
      studentId: req.studentId || null,
      sessionId,
      promptKey: req.body.promptKey,
      rating: req.body.rating ?? null,
      responseText: req.body.responseText || null
    });
    res.status(201).json({ id: response.id });
  } catch (error) {
    next(error);
  }
});

// KPI summary (admin)
router.get('/analytics/kpis', authenticateToken, validateQuery(analyticsQuerySchema), async (req: AuthRequest, res: Response, next) => {
  try {
    requireAdmin(req);
    const start = req.query.start ? new Date(req.query.start as string) : undefined;
    const end = req.query.end ? new Date(req.query.end as string) : undefined;
    const kpis = await analyticsService.getKpis(start, end);
    res.json(kpis);
  } catch (error) {
    next(error);
  }
});

// CSV export (admin)
router.get('/analytics/export', authenticateToken, validateQuery(analyticsQuerySchema), async (req: AuthRequest, res: Response, next) => {
  try {
    requireAdmin(req);
    const type = (req.query.type as string) || 'events';
    if (!['events', 'surveys', 'prompts'].includes(type)) {
      throw new AppError(400, 'Invalid export type', 'VALIDATION_ERROR');
    }
    const start = req.query.start ? new Date(req.query.start as string) : undefined;
    const end = req.query.end ? new Date(req.query.end as string) : undefined;
    const csv = await analyticsService.exportCsv(type as any, start, end);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;
