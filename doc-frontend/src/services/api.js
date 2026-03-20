import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  login: (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
  applyDoctor: (data) => client.post('/doctor-applications/apply', data),
  getPendingApplications: () => client.get('/doctor-applications/pending'),
  getAllApplications: () => client.get('/doctor-applications/all'),
  approveApplication: (id) => client.put(`/doctor-applications/${id}/approve`),
  rejectApplication: (id, reason) =>
    client.put(`/doctor-applications/${id}/reject`, null, { params: { reason } }),
  registerPatient: (data) => client.post('/patients/register', data),
  getPatientStatus: (id) => client.get(`/appointments/${id}/status`),
  bookAppointment: (patientId, doctorId, scheduledTime) =>
    client.post('/appointments/book', null, { params: { patientId, doctorId, scheduledTime } }),
  getQueue: (doctorId) => client.get(`/appointments/queue/${doctorId}`),
  markDone: (appointmentId) => client.put(`/appointments/${appointmentId}/done`),
  handleDelay: (doctorId, delayMinutes) =>
    client.put(`/appointments/delay/${doctorId}`, null, { params: { delayMinutes } }),
};