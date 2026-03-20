import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-icon">⚕</div>
        <h1>SmartQueue</h1>
        <span>· Clinic Management</span>
      </div>

      <div style={{ flex: 1, paddingLeft: '2rem' }}>
        <span style={{ fontWeight: 600, color: '#4a5568' }}>{title}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.72rem', color: '#8a96a8',
            textTransform: 'uppercase', letterSpacing: '1px' }}>
            {user?.role}
          </div>
        </div>
        <button className="btn btn-ghost"
          style={{ width: 'auto', padding: '0.5rem 1rem' }}
          onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}