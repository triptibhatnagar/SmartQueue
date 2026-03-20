import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function JoinDoctor() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    specialization: '', licenseNumber: '', certificateInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.applyDoctor(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data || 'Application failed. Try again.');
    }
    setLoading(false);
  };

  if (submitted) return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="success-screen">
          <div className="success-check">✓</div>
          <h2>Application Submitted!</h2>
          <p style={{ color: '#4a5568', margin: '0.5rem 0 1rem' }}>
            Your application is under review. Admin will verify your credentials.
          </p>
          <p style={{ color: '#8a96a8', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Once approved, login with your email and password:
            <strong> Doctor@123</strong>
          </p>
          <Link to="/login">
            <button className="btn btn-outline" style={{ width: '100%' }}>
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <div className="logo-icon"
            style={{ width: 44, height: 44, fontSize: '1.3rem', margin: '0 auto 1rem' }}>
            🩺
          </div>
          <h2>Join as Doctor</h2>
          <p>Admin will review and approve your application</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Dr. Sharma"
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Specialization *</label>
              <input type="text" placeholder="General Physician"
                onChange={e => setForm({ ...form, specialization: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" placeholder="doctor@example.com"
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" placeholder="9876543210"
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Medical License Number *</label>
            <input type="text" placeholder="e.g. MH12345"
              onChange={e => setForm({ ...form, licenseNumber: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Degree / Certificate *</label>
            <input type="text" placeholder="e.g. MBBS - AIIMS Delhi"
              onChange={e => setForm({ ...form, certificateInfo: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application →'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already approved? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}