import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="db-nav-logo-icon" style={{ width: '3rem', height: '3rem', fontSize: '1.4rem', borderRadius: '.75rem' }}>P</div>
          <h1 className="auth-title">StudyOptimizer</h1>
        </div>
        <p className="auth-sub">Sign in to your learning account</p>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁'}</button>
            </div>
          </div>
          <button type="submit" className="db-btn-primary" style={{ width: '100%', marginTop: '.5rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
