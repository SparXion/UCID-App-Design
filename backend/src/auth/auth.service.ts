import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-secret-key-change-in-production');
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-refresh-secret-key-change-in-production');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Short-lived access token
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Long-lived refresh token

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}
if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required in production');
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  year?: number;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  student: {
    id: string;
    name: string;
    email: string;
    year?: number;
  };
}

export interface RefreshTokenResponse {
  token: string;
}

export class AuthService {
  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email: dto.email }
    });

    if (existingStudent) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create student
    const student = await prisma.student.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        ...(dto.year !== undefined && { year: dto.year }),
        embedding: '[]' // Empty embedding for new users
      }
    });

    // Generate tokens
    const token = this.generateToken(student.id);
    const refreshToken = this.generateRefreshToken(student.id);

    return {
      token,
      refreshToken,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        year: student.year || undefined
      }
    };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    // Find student by email (include password for verification)
    const student = await prisma.student.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        year: true
      }
    });

    if (!student || !student.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(dto.password, student.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const token = this.generateToken(student.id);
    const refreshToken = this.generateRefreshToken(student.id);

    return {
      token,
      refreshToken,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        year: student.year || undefined
      }
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      if (typeof decoded === 'object' && decoded !== null && 'studentId' in decoded) {
        const studentId = (decoded as { studentId: string }).studentId;
        
        // Verify student still exists
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: { id: true }
        });

        if (!student) {
          throw new Error('Student not found');
        }

        // Generate new access token
        const token = this.generateToken(studentId);
        return { token };
      }
      throw new Error('Invalid refresh token');
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async getStudentById(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        createdAt: true
      }
    });

    return student;
  }

  generateToken(studentId: string): string {
    return jwt.sign(
      { studentId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  generateRefreshToken(studentId: string): string {
    return jwt.sign(
      { studentId },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );
  }

  verifyToken(token: string): { studentId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === 'object' && decoded !== null && 'studentId' in decoded) {
        return decoded as { studentId: string };
      }
      throw new Error('Invalid token payload');
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
