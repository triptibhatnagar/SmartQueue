# ⚕ SmartQueue — Intelligent Doctor Appointment & Queue Management System

> A real-world clinic management system that solves the problem of chaotic OPD queues in small hospitals and clinics across India.

🌐 **Live Demo:** [smartqueue-frontend-gray.vercel.app](https://smartqueue-frontend-gray.vercel.app)  
⚙️ **Backend API:** [smartqueue-backend-nhtk.onrender.com](https://smartqueue-backend-nhtk.onrender.com)

---

## 💡 Problem Statement

Small clinics in India have zero tech for queue management. Patients show up, wait 2-3 hours with no updates. Doctors sit idle when patients are no-shows. Emergencies don't get priority. This project solves exactly that.

---

## 🚀 What Makes This Unique

Most appointment systems stop at booking. **SmartQueue starts after booking.**

| Feature | What I Built |
|--------|-------------|
| **Priority Score Algorithm** | Custom weighted formula — emergency, age, wait time all factor in |
| **Dynamic Wait Time Engine** | Real-time recalculation when doctor is delayed |
| **No-Show Auto Detection** | Spring `@Scheduled` job runs every 5 min, auto-recovers idle slots |
| **Overbooking Algorithm** | Airline-style yield management — overbooks by 20% based on historical no-show rate |
| **JWT Auth + Role System** | Admin, Doctor, Patient — each with protected routes |
| **Doctor Verification Flow** | Doctors can't self-signup — admin reviews license and approves |

---

## 🏗️ System Architecture

```
Patient  →  Books appointment  →  Gets token + live queue position
Doctor   →  Applies to join   →  Admin verifies → Account activated
Admin    →  Manages doctors   →  Reviews applications, approves/rejects
```

```
Frontend (React + Vite)
        ↓
Backend (Java + Spring Boot)
        ↓
Queue Engine (Priority Queue + Scheduler)
        ↓
Database (PostgreSQL on Render / MySQL locally)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3 |
| Auth | Spring Security + JWT |
| Database | PostgreSQL (prod) / MySQL (local) |
| Frontend | React 18, Vite |
| HTTP Client | Axios |
| Routing | React Router DOM |
| State | React Context API |
| Deployment | Render (backend) + Vercel (frontend) |
| Containerization | Docker |

---

## ✨ Core Features

### 👨‍💼 Admin
- Login with secure JWT auth
- View all doctor applications
- Approve or reject with reason
- Doctor account auto-created on approval

### 🩺 Doctor
- Apply to join with license and certificate details
- Login after admin approval
- View live priority queue
- Mark patient as done — next patient auto-pulled
- Report running late — all slots shift automatically

### 🧑 Patient
- Register and login
- Book appointment — token assigned instantly
- Track live queue position
- See dynamic estimated time
- Emergency flag — bumps priority automatically

---

## 🧠 Queue Engine — The Core Logic

```java
// Priority Score Formula (my own algorithm)
int score = 10;                          // base
if (patient.isEmergency()) score += 50; // emergency
if (patient.getAge() >= 60) score += 20; // senior citizen
if (patient.getAge() <= 10) score += 10; // child
score += (minutesWaiting / 10);          // wait time bonus
```

```java
// Overbooking — Airline Logic Applied to Healthcare
int allowedBookings = (int) Math.ceil(maxSlots / (1 - 0.20));
// 20 slots → allows 25 bookings → statistically ~20 show up
```

```java
// No-Show Auto Detection — runs every 5 minutes
@Scheduled(fixedRate = 300000)
public void detectNoShows() {
    // If patient hasn't checked in 10 mins after slot → NO_SHOW
    // Next patient automatically pulled from queue
}
```

---

## 📁 Project Structure

```
SmartQueue/
├── src/                          # Spring Boot Backend
│   └── main/java/com/hey/doc/
│       ├── controller/           # REST APIs
│       ├── service/              # Business logic
│       │   └── QueueEngineService.java  ← Core algorithm
│       ├── model/                # JPA entities
│       ├── repository/           # Data access
│       ├── security/             # JWT + Spring Security
│       └── dto/                  # Request/Response objects
├── doc-frontend/                 # React Frontend
│   └── src/
│       ├── pages/                # Login, Register, Dashboards
│       ├── components/           # Navbar, ProtectedRoute
│       ├── context/              # AuthContext (JWT state)
│       └── services/             # API calls (Axios)
└── Dockerfile                    # Docker containerization
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register     → Patient signup
POST /api/auth/login        → Login (all roles)
```

### Doctor Applications
```
POST /api/doctor-applications/apply       → Doctor apply (public)
GET  /api/doctor-applications/pending     → Admin: view pending
PUT  /api/doctor-applications/{id}/approve → Admin: approve
PUT  /api/doctor-applications/{id}/reject  → Admin: reject
```

### Appointments
```
POST /api/appointments/book              → Book appointment
GET  /api/appointments/queue/{doctorId}  → Live queue
GET  /api/appointments/{id}/status       → Patient status
PUT  /api/appointments/{id}/done         → Doctor: mark done
PUT  /api/appointments/delay/{doctorId}  → Doctor: report delay
```

---

## 🏃 Run Locally

### Prerequisites
- Java 21
- Maven
- MySQL
- Node.js 18+

### Backend

```bash
# Clone repo
git clone https://github.com/triptibhatnagar/SmartQueue.git
cd SmartQueue

# Create application.properties (see application-example.properties)
cp src/main/resources/application-example.properties src/main/resources/application.properties
# Fill in your MySQL credentials

# Run
mvn spring-boot:run
```

### Frontend

```bash
cd doc-frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### Default Admin Login
```
Email    : admin@smartqueue.com
Password : Admin@123
```

---

## 🐳 Docker

```bash
docker build -t smartqueue-backend .
docker run -p 8080:8080 smartqueue-backend
```

---

## 🌱 Future Improvements

- SMS/Email notifications when patient's turn is near
- Multiple doctors per clinic
- Analytics dashboard for clinic owner
- Mobile app (React Native)

---

> *"Most appointment apps stop at booking. SmartQueue starts there."*
