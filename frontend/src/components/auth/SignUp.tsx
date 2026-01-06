import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(name, email, password, year || undefined);
      navigate('/ucid');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-large">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-h1 mb-medium">Create Account</h1>
          <p className="text-body text-secondary mb-large">
            Sign up to get personalized career path recommendations
          </p>

          {error && (
            <div className="mb-medium p-medium bg-red-50 border border-red-200 rounded-subtle">
              <p className="text-small text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-medium">
            <div>
              <label htmlFor="name" className="block text-small font-medium mb-tiny">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-small font-medium mb-tiny">
                Email *
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
              <label htmlFor="year" className="block text-small font-medium mb-tiny">
                Year (Optional)
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : '')}
                className="input w-full"
              >
                <option value="">Select year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="5">Fifth Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-medium mb-tiny">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-small font-medium mb-tiny">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input w-full"
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-large text-center">
            <p className="text-small text-secondary">
              Already have an account?{' '}
              <a href="/signin" className="text-black font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

