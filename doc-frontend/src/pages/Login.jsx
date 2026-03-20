import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form);
      login(res.data);
      if (res.data.role === 'ADMIN') navigate('/admin');
      else if (res.data.role === 'DOCTOR') navigate('/doctor');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon"
            style={{ width: 44, height: 44, fontSize: '1.3rem', margin: '0 auto 1rem' }}>
            ⚕
          </div>
          <h2>SmartQueue</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>New patient? <Link to="/register">Create account</Link></p>
          <p>Are you a doctor? <Link to="/join-doctor">Apply to join</Link></p>
        </div>
      </div>
    </div>
  );
}