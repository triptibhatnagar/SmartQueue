import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState('pending');
  const [rejectReason, setRejectReason] = useState({});

  const fetchApplications = async () => {
    try {
      const res = tab === 'pending'
        ? await api.getPendingApplications()
        : await api.getAllApplications();
      setApplications(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchApplications(); }, [tab]);

  const handleApprove = async (id) => {
    await api.approveApplication(id);
    fetchApplications();
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id] || 'Application rejected';
    await api.rejectApplication(id, reason);
    fetchApplications();
  };

  const statusColors = {
    PENDING: 'badge-waiting',
    APPROVED: 'badge-done',
    REJECTED: 'badge-noshow'
  };

  return (
    <>
      <Navbar title="Admin Panel" />
      <div className="page">
        <div className="page-header">
          <h2>Doctor Applications</h2>
          <p>Review and manage doctor verification requests</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`btn ${tab === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ width: 'auto' }}
            onClick={() => setTab('pending')}>
            Pending
          </button>
          <button
            className={`btn ${tab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ width: 'auto' }}
            onClick={() => setTab('all')}>
            All Applications
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon">📋</div>
              No applications found
            </div>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="patient-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>
                    {app.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{app.name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#8a96a8' }}>{app.specialization}</div>
                  </div>
                </div>
                <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
              </div>

              <hr />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
                <div><span style={{ color: '#8a96a8' }}>Email: </span>{app.email}</div>
                <div><span style={{ color: '#8a96a8' }}>Phone: </span>{app.phone}</div>
                <div><span style={{ color: '#8a96a8' }}>License: </span>{app.licenseNumber}</div>
                <div><span style={{ color: '#8a96a8' }}>Degree: </span>{app.certificateInfo}</div>
              </div>

              {app.status === 'PENDING' && (
                <>
                  <hr />
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input type="text"
                      placeholder="Rejection reason (optional)"
                      style={{ flex: 1, margin: 0 }}
                      onChange={e => setRejectReason({ ...rejectReason, [app.id]: e.target.value })} />
                    <button className="btn btn-success" style={{ whiteSpace: 'nowrap' }}
                      onClick={() => handleApprove(app.id)}>
                      ✓ Approve
                    </button>
                    <button className="btn"
                      style={{ background: '#e53e3e', color: 'white', whiteSpace: 'nowrap' }}
                      onClick={() => handleReject(app.id)}>
                      ✗ Reject
                    </button>
                  </div>
                </>
              )}

              {app.adminNote && (
                <div className="alert alert-error" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  Rejection reason: {app.adminNote}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}