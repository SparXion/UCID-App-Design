import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/ucid');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-large">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-h1 mb-medium">Sign In</h1>
          <p className="text-body text-secondary mb-large">
            Sign in to access your personalized career paths
          </p>

          {error && (
            <div className="mb-medium p-medium bg-red-50 border border-red-200 rounded-subtle">
              <p className="text-small text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-medium">
            <div>
              <label htmlFor="email" className="block text-small font-medium mb-tiny">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="your.email@uc.edu"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-medium mb-tiny">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-large text-center">
            <p className="text-small text-secondary">
              Don't have an account?{' '}
              <a href="/signup" className="text-black font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

