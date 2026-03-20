import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const statusMap = {
  WAITING: { label: 'Waiting', cls: 'badge-waiting', icon: '⏳' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-progress', icon: '🔵' },
  DONE: { label: 'Done', cls: 'badge-done', icon: '✅' },
  NO_SHOW: { label: 'No Show', cls: 'badge-noshow', icon: '❌' },
};

export default function PatientStatus() {
  const [id, setId] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    if (!id) return;
    try {
      const res = await api.getPatientStatus(id);
      setStatus(res.data);
      setError('');
    } catch {
      setError('No appointment found with this ID.');
      setStatus(null);
    }
  };

  useEffect(() => {
    if (!status) return;
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [status, id]);

  const s = status ? statusMap[status.status] : null;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-header">
        <h2>Track Your Queue</h2>
        <p>Enter your appointment ID to see your live position</p>
      </div>

      <div className="card">
        <div className="search-row">
          <input type="number" placeholder="Enter your Appointment ID"
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchStatus()} />
          <button className="btn btn-primary" style={{ width: 'auto', whiteSpace: 'nowrap' }}
            onClick={fetchStatus}>
            Track →
          </button>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {status && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="patient-avatar">{status.patientName?.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{status.patientName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Appointment #{status.appointmentId}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className={`badge ${s.cls}`}>{s.icon} {s.label}</span>
              </div>
            </div>

            <div className="status-grid">
              <div className="status-box">
                <div className="status-box-label">Token Number</div>
                <div className="status-box-value" style={{ color: 'var(--blue)', fontSize: '1.75rem' }}>
                  #{status.tokenNumber}
                </div>
              </div>
              <div className="status-box">
                <div className="status-box-label">Queue Position</div>
                <div className="status-box-value">{status.queuePosition} ahead</div>
              </div>
              <div className="status-box" style={{ gridColumn: '1 / -1' }}>
                <div className="status-box-label">Estimated Time</div>
                <div className="status-box-value" style={{ fontSize: '1.1rem' }}>
                  {new Date(status.estimatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)' }}>
              🔄 Auto-refreshes every 30 seconds
            </p>
          </>
        )}
      </div>
    </div>
  );
}