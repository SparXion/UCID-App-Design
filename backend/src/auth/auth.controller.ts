import { Router, Request, Response } from 'express';
import { AuthService, SignUpDto, SignInDto } from './auth.service';
import { authenticateToken, AuthRequest } from './auth.middleware';

const router = Router();
const authService = new AuthService();

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const dto: SignUpDto = req.body;

    // Validate required fields
    if (!dto.name || !dto.email || !dto.password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (dto.password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const result = await authService.signUp(dto);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[Sign Up] Error:', error);
    if (error.message === 'Email already registered') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Sign in
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const dto: SignInDto = req.body;

    // Validate required fields
    if (!dto.email || !dto.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.signIn(dto);
    res.json(result);
  } catch (error: any) {
    console.error('[Sign In] Error:', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get current user (protected route)
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.studentId!;
    const student = await authService.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error: any) {
    console.error('[Get Me] Error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

export default router;

