import { useState, useCallback, useEffect, createContext, useContext } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://personalized-study-optimizer-backend.onrender.com';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('so_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('so_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('so_token', token);
    else localStorage.removeItem('so_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('so_user', JSON.stringify(user));
    else localStorage.removeItem('so_user');
  }, [user]);

  const register = useCallback(async (email, username, password) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      setToken(data.access_token);
      setUser(data.user);
      return true;
    } catch (e) { setError(e.message); return false; }
    finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      setToken(data.access_token);
      setUser(data.user);
      return true;
    } catch (e) { setError(e.message); return false; }
    finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    setToken(null); setUser(null);
  }, []);

  const updateUsername = useCallback(async (username) => {
    if (!token) return;
    await fetch(`${API}/api/auth/username`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username }),
    });
    setUser(u => ({ ...u, username }));
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, updateUsername, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export const API_BASE = API;
