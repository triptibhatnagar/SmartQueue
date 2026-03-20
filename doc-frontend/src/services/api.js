import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const api = {
    registerPatient: (data) =>
        axios.post(`${BASE_URL}/patients/register`, data),

    getPatientStatus: (id) =>
        axios.get(`${BASE_URL}/appointments/${id}/status`),

    addDoctor: (data) =>
        axios.post(`${BASE_URL}/doctors/add`, data),

    bookAppointment: (patientId, doctorId, scheduledTime) =>
        axios.post(`${BASE_URL}/appointments/book`, null, {
            params: { patientId, doctorId, scheduledTime }
        }),

    getQueue: (doctorId) =>
        axios.get(`${BASE_URL}/appointments/queue/${doctorId}`),

    markDone: (appointmentId) =>
        axios.put(`${BASE_URL}/appointments/${appointmentId}/done`),

    handleDelay: (doctorId, delayMinutes) =>
        axios.put(`${BASE_URL}/appointments/delay/${doctorId}`, null, {
            params: { delayMinutes }
        }),
};