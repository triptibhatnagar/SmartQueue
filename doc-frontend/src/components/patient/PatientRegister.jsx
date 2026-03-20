import React, { useState } from 'react';
import { api } from '../../services/api';

export default function PatientRegister() {
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '', emergency: false
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initials = form.name
    ? form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const patientRes = await api.registerPatient({ ...form, age: parseInt(form.age) });
      const scheduledTime = new Date().toISOString().slice(0, 19);
      const apptRes = await api.bookAppointment(patientRes.data.id, 1, scheduledTime);
      setResult(apptRes.data);
    } catch (err) {
      setError(err.response?.data || 'Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (result) return (
    <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="success-screen">
        <div className="success-check">✓</div>
        <h2>Appointment Confirmed</h2>
        <p>Your appointment has been booked successfully</p>
        <div className="token-box">
          <div className="token-label">Your Token</div>
          <div className="token-number">#{result.tokenNumber}</div>
        </div>
        <p style={{ color: 'var(--text-2)', fontSize: '0.82rem' }}>Save your Appointment ID</p>
        <div className="appt-id">ID: {result.id}</div>
        <br /><br />
        <button className="btn btn-outline" onClick={() => setResult(null)}>
          Book Another Appointment
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-header">
        <h2>Book an Appointment</h2>
        <p>Fill in the details below to get your queue token</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div className="patient-avatar" style={{ width: 48, height: 48, fontSize: '1.1rem' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                {form.name || 'New Patient'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Patient Registration</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input type="number" placeholder="e.g. 35"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="optional"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div
              className={`toggle-field ${form.emergency ? 'active' : ''}`}
              onClick={() => setForm({ ...form, emergency: !form.emergency })}
            >
              <div className="toggle-field-label">
                <span>🚨</span>
                Emergency Patient — will be prioritised in queue
              </div>
              <div className={`toggle ${form.emergency ? 'on' : ''}`} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Appointment →'}
          </button>
        </form>
      </div>
    </div>
  );
}