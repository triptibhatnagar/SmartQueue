import React, { useState, useEffect } from 'react';
import PatientRegister from './components/patient/PatientRegister';
import PatientStatus from './components/patient/PatientStatus';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import AdminSetup from './components/admin/AdminSetup';
import './App.css';

const tabs = [
  { id: 'book', label: 'Book Appointment'},
  { id: 'status', label: 'Track Status' },
  { id: 'doctor', label: 'Doctor Dashboard'},
  { id: 'admin', label: 'Admin'},
];

export default function App() {
  const [tab, setTab] = useState('book');
  const [online, setOnline] = useState(null); // null = checking

  const checkBackend = async () => {
    try {
      await fetch('http://localhost:8080/api/doctors/1', { method: 'GET' });
      setOnline(true);
    } catch {
      setOnline(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000); // har 15 sec check
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    if (tab === 'book') return <PatientRegister />;
    if (tab === 'status') return <PatientStatus />;
    if (tab === 'doctor') return <DoctorDashboard />;
    if (tab === 'admin') return <AdminSetup />;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-icon">⚕</div>
          <h1>SmartQueue</h1>
          <span>· Clinic Management</span>
        </div>

        <div className="nav-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── STATUS INDICATOR ── */}
        {online === null && (
          <div className="nav-status" style={{ color: 'var(--text-3)' }}>
            <div className="status-dot" style={{ background: 'var(--text-3)', animation: 'none' }} />
            Checking...
          </div>
        )}
        {online === true && (
          <div className="nav-status">
            <div className="status-dot" />
            System Online
          </div>
        )}
        {online === false && (
          <div className="nav-status" style={{ color: 'var(--red)' }}>
            <div className="status-dot" style={{ background: 'var(--red)' }} />
            System Offline
          </div>
        )}
      </nav>

      <div className="page">
        {renderPage()}
      </div>
    </>
  );
}