import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('book');
  const [bookForm, setBookForm] = useState({ age: '', phone: '', emergency: false });
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [trackId, setTrackId] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const patientRes = await api.registerPatient({
        name: user.name,
        age: parseInt(bookForm.age),
        phone: bookForm.phone,
        email: '',
        emergency: bookForm.emergency
      });
      const scheduledTime = new Date().toISOString().slice(0, 19);
      const apptRes = await api.bookAppointment(patientRes.data.id, 1, scheduledTime);
      setAppointmentResult(apptRes.data);
    } catch (err) {
      setError(err.response?.data || 'Booking failed');
    }
    setLoading(false);
  };

  const handleTrack = async () => {
    if (!trackId) return;
    try {
      const res = await api.getPatientStatus(trackId);
      setStatus(res.data);
      setError('');
    } catch {
      setError('Appointment not found');
      setStatus(null);
    }
  };

  const badgeClass = {
    WAITING: 'badge-waiting',
    IN_PROGRESS: 'badge-progress',
    DONE: 'badge-done',
    NO_SHOW: 'badge-noshow'
  };

  return (
    <>
      <Navbar title="Patient Dashboard" />
      <div className="page">

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button className={`btn ${tab === 'book' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ width: 'auto' }} onClick={() => setTab('book')}>
            📋 Book Appointment
          </button>
          <button className={`btn ${tab === 'track' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ width: 'auto' }} onClick={() => setTab('track')}>
            🔍 Track Status
          </button>
        </div>

        {tab === 'book' && (
          <div className="card" style={{ maxWidth: 520 }}>
            <div className="card-label">Book Appointment</div>
            {appointmentResult ? (
              <div className="success-screen">
                <div className="success-check">✓</div>
                <h2>Appointment Confirmed!</h2>
                <div className="token-box">
                  <div className="token-label">Your Token</div>
                  <div className="token-number">#{appointmentResult.tokenNumber}</div>
                </div>
                <p style={{ color: '#4a5568', fontSize: '0.82rem' }}>
                  Appointment ID:
                  <span style={{ fontFamily: 'monospace' }}> {appointmentResult.id}</span>
                </p>
                <br />
                <button className="btn btn-outline"
                  onClick={() => { setAppointmentResult(null); setTab('track'); }}>
                  Track My Status →
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook}>
                {error && <div className="alert alert-error">⚠ {error}</div>}
                <div style={{ padding: '0.75rem 1rem', background: '#e8f0fc',
                  borderRadius: 8, marginBottom: '1rem', fontSize: '0.875rem' }}>
                  Booking as: <strong>{user?.name}</strong>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Age *</label>
                    <input type="number" placeholder="e.g. 35"
                      onChange={e => setBookForm({ ...bookForm, age: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" placeholder="9876543210"
                      onChange={e => setBookForm({ ...bookForm, phone: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <div className={`toggle-field ${bookForm.emergency ? 'active' : ''}`}
                    onClick={() => setBookForm({ ...bookForm, emergency: !bookForm.emergency })}>
                    <div className="toggle-field-label">
                      <span>🚨</span> Emergency Patient
                    </div>
                    <div className={`toggle ${bookForm.emergency ? 'on' : ''}`} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Booking...' : 'Confirm Appointment →'}
                </button>
              </form>
            )}
          </div>
        )}

        {tab === 'track' && (
          <div className="card" style={{ maxWidth: 520 }}>
            <div className="card-label">Track Queue Status</div>
            <div className="search-row">
              <input type="number" placeholder="Enter Appointment ID"
                value={trackId}
                onChange={e => setTrackId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()} />
              <button className="btn btn-primary" style={{ width: 'auto' }}
                onClick={handleTrack}>Track →</button>
            </div>
            {error && <div className="alert alert-error">⚠ {error}</div>}
            {status && (
              <>
                <div style={{ display: 'flex', alignItems: 'center',
                  gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="patient-avatar">
                    {status.patientName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{status.patientName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#8a96a8' }}>
                      Token #{status.tokenNumber}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span className={`badge ${badgeClass[status.status]}`}>
                      {status.status}
                    </span>
                  </div>
                </div>
                <div className="status-grid">
                  <div className="status-box">
                    <div className="status-box-label">Position</div>
                    <div className="status-box-value">{status.queuePosition} ahead</div>
                  </div>
                  <div className="status-box">
                    <div className="status-box-label">Est. Time</div>
                    <div className="status-box-value" style={{ fontSize: '1.1rem' }}>
                      {new Date(status.estimatedTime).toLocaleTimeString([],
                        { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8a96a8' }}>
                  🔄 Auto-refreshes every 30 seconds
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}