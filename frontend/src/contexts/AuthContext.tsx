import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config';

interface Student {
  id: string;
  name: string;
  email: string;
  year?: number;
}

interface AuthContextType {
  student: Student | null;
  token: string | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, year?: number) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedStudent = localStorage.getItem('auth_student');

    if (storedToken && storedStudent) {
      setToken(storedToken);
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (e) {
        console.error('Failed to parse stored student:', e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_student');
      }
    }
    setLoading(false);
  }, []);

  // Verify token and fetch current user
  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
        localStorage.setItem('auth_student', JSON.stringify(data.student));
      } else {
        // Token invalid, clear auth
        signOut();
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      signOut();
    }
  };

  const signUp = async (name: string, email: string, password: string, year?: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, year })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign up');
      }

      const data = await response.json();
      setToken(data.token);
      setStudent(data.student);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_student', JSON.stringify(data.student));
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sign in');
      }

      const data = await response.json();
      setToken(data.token);
      setStudent(data.student);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_student', JSON.stringify(data.student));
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = () => {
    setToken(null);
    setStudent(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_student');
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        token,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!student && !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

