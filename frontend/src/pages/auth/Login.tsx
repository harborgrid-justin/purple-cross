import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';

interface LocationState {
  from?: { pathname?: string };
}

const Login = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.DASHBOARD;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        aria-labelledby="login-heading"
        style={{
          width: '100%',
          maxWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: 'var(--radius-md, 8px)',
          background: 'var(--bg-primary, #fff)',
        }}
      >
        <h1 id="login-heading" style={{ margin: 0, fontSize: '1.5rem' }}>
          Purple Cross
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary, #64748b)' }}>
          Sign in to your account
        </p>

        {error && (
          <div role="alert" style={{ color: 'var(--color-error, #dc2626)' }}>
            {error}
          </div>
        )}

        <label htmlFor="email" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span>Email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </label>

        <label
          htmlFor="password"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          <span>Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
};

export default Login;
