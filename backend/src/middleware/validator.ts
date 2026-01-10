import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './error-handler';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR', formattedErrors);
      }
      next(error);
    }
  };
};

// Helper for validating request body only
export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR', formattedErrors);
      }
      next(error);
    }
  };
};

// Helper for validating query params only
export const validateQuery = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Query params are already parsed by Express, just validate them
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError(400, 'Validation failed', 'VALIDATION_ERROR', formattedErrors);
      }
      next(error);
    }
  };
};
