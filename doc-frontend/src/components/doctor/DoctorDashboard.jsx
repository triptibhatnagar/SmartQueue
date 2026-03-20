import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [delay, setDelay] = useState('');
  const doctorId = 1;

  const fetchQueue = async () => {
    try {
      const res = await api.getQueue(doctorId);
      setQueue(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDone = async (id) => {
    await api.markDone(id);
    fetchQueue();
  };

  const handleDelay = async () => {
    if (!delay) return;
    await api.handleDelay(doctorId, parseInt(delay));
    setDelay('');
    fetchQueue();
    alert(`All patient slots shifted by ${delay} minutes`);
  };

  const current = queue.find(a => a.status === 'IN_PROGRESS');
  const waiting = queue.filter(a => a.status === 'WAITING');
  const done = queue.filter(a => a.status === 'DONE');
  const noshow = queue.filter(a => a.status === 'NO_SHOW');

  const initials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div>
      <div className="page-header">
        <h2>Doctor Dashboard</h2>
        <p>Live queue — refreshes every 15 seconds</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-label">Waiting</div>
          <div className="stat-card-value" style={{ color: 'var(--amber)' }}>{waiting.length}</div>
          <div className="stat-card-sub">in queue</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>{done.length}</div>
          <div className="stat-card-sub">today</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">No Shows</div>
          <div className="stat-card-value" style={{ color: 'var(--red)' }}>{noshow.length}</div>
          <div className="stat-card-sub">auto-detected</div>
        </div>
      </div>

      {/* Current Patient */}
      <div className="card" style={{ marginBottom: '1rem', borderLeft: '3px solid var(--green)' }}>
        <div className="card-label">Current Patient</div>
        {current ? (
          <div className="patient-row is-current" style={{ border: 'none', padding: '0.5rem 0', background: 'transparent' }}>
            <div className="patient-avatar" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
              {initials(current.patient.name)}
            </div>
            <div className="patient-details">
              <div className="patient-name">{current.patient.name}</div>
              <div className="patient-meta">
                Age {current.patient.age} · Token #{current.tokenNumber}
                {current.patient.emergency && <span className="badge badge-emergency" style={{ marginLeft: 6 }}>Emergency</span>}
              </div>
            </div>
            <button className="btn btn-success" onClick={() => handleDone(current.id)}>
              ✓ Done — Next
            </button>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">👨‍⚕️</div>
            No patient currently in progress
          </div>
        )}
      </div>

      {/* Delay + Queue side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem', alignItems: 'start' }}>
        <div className="card">
          <div className="card-label">Running Late?</div>
          <div className="form-group">
            <label>Minutes of delay</label>
            <input type="number" placeholder="e.g. 15"
              value={delay}
              onChange={e => setDelay(e.target.value)} />
          </div>
          <button className="btn btn-ghost" onClick={handleDelay} style={{ width: '100%' }}>
            ⏱ Shift All Slots
          </button>
        </div>

        <div className="card">
          <div className="card-label">Waiting Queue — {waiting.length} patients</div>
          {waiting.length === 0
            ? <div className="empty"><div className="empty-icon">🎉</div>Queue is empty</div>
            : <div className="patient-list">
              {waiting.map((appt, i) => (
                <div key={appt.id} className={`patient-row ${appt.patient.emergency ? 'is-emergency' : ''}`}>
                  <span className="patient-number">{i + 1}</span>
                  <div className="patient-avatar">{initials(appt.patient.name)}</div>
                  <div className="patient-details">
                    <div className="patient-name">{appt.patient.name}</div>
                    <div className="patient-meta">
                      Age {appt.patient.age} · Token #{appt.tokenNumber}
                    </div>
                  </div>
                  <div className="patient-right">
                    {appt.patient.emergency && <span className="badge badge-emergency">🚨 Emergency</span>}
                    <span className="badge badge-waiting">Waiting</span>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}