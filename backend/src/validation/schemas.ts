import { z } from 'zod';

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  year: z.number().int().min(1).max(10).optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Quiz submission schema
export const talentSchema = z.object({
  name: z.string().min(1, 'Talent name is required'),
  measuredScore: z.number().int().min(0).max(100),
});

export const interestSchema = z.object({
  topic: z.string().min(1, 'Interest topic is required'),
  strength: z.number().int().min(1).max(5),
});

export const quizSubmissionSchema = z.object({
  talents: z.array(talentSchema).min(1, 'At least one talent is required'),
  interests: z.array(interestSchema).min(1, 'At least one interest is required'),
});

// Pagination schema - query params come as strings
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1)).optional().or(z.number().int().min(1).optional()),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100)).optional().or(z.number().int().min(1).max(100).optional()),
});

// Analytics schemas
export const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  properties: z.record(z.string(), z.any()).optional(),
});

export const surveySchema = z.object({
  type: z.enum(['PRE', 'POST']),
  responses: z.record(z.string(), z.any())
});

export const promptSchema = z.object({
  promptKey: z.string().min(1, 'Prompt key is required'),
  rating: z.number().int().min(1).max(5).optional(),
  responseText: z.string().max(2000).optional()
});

export const analyticsQuerySchema = z.object({
  type: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional()
});
