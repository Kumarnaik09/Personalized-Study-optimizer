import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const ok = await register(email, username, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="db-nav-logo-icon" style={{ width: '3rem', height: '3rem', fontSize: '1.4rem', borderRadius: '.75rem' }}>P</div>
          <h1 className="auth-title">StudyOptimizer</h1>
        </div>
        <p className="auth-sub">Create your personal learning account</p>

        {error && <div className="auth-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Display Name</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. KumarNaik" />
          </div>
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
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁'}</button>
            </div>
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" />
          </div>
          <button type="submit" className="db-btn-primary" style={{ width: '100%', marginTop: '.5rem' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
