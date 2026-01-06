import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export interface AuthRequest extends Request {
  studentId?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = authService.verifyToken(token);
    req.studentId = decoded.studentId;
    next();
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid token' });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = authService.verifyToken(token);
      req.studentId = decoded.studentId;
    }
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

