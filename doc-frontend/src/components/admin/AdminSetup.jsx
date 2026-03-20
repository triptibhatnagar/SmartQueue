import React, { useState } from 'react';
import { api } from '../../services/api';

export default function AdminSetup() {
  const [form, setForm] = useState({
    name: '', specialization: '', phone: '',
    workStartTime: '10:00:00', workEndTime: '14:00:00',
    slotDurationMinutes: 15, maxPatientsPerDay: 20
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addDoctor(form);
      setSuccess(`Doctor added successfully — ID: ${res.data.id}`);
      setError('');
    } catch {
      setError('Failed to add doctor. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div className="page-header">
        <h2>Admin Setup</h2>
        <p>Register doctors and configure clinic settings</p>
      </div>

      <div className="card">
        <div className="card-label">Register New Doctor</div>
        {success && <div className="alert alert-success">✓ {success}</div>}
        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Doctor Name *</label>
              <input type="text" placeholder="e.g. Dr. Sharma" required
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input type="text" placeholder="e.g. General Physician"
                onChange={e => setForm({ ...form, specialization: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="e.g. 9876543210"
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Work Start Time</label>
              <input type="text" defaultValue="10:00:00"
                onChange={e => setForm({ ...form, workStartTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Work End Time</label>
              <input type="text" defaultValue="14:00:00"
                onChange={e => setForm({ ...form, workEndTime: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Slot Duration (mins)</label>
              <input type="number" defaultValue={15}
                onChange={e => setForm({ ...form, slotDurationMinutes: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Max Patients/Day</label>
              <input type="number" defaultValue={20}
                onChange={e => setForm({ ...form, maxPatientsPerDay: parseInt(e.target.value) })} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit">Add Doctor →</button>
        </form>
      </div>
    </div>
  );
}