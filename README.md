# 🎬 CinePass

A portfolio-grade full-stack movie ticket booking platform built with the MERN stack — similar to BookMyShow.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router v6, TailwindCSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (Access + Refresh Tokens), Role-based Access |

## 📁 Project Structure

```
cinepass/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── config/       # DB & env config
│   │   ├── controllers/  # Route handlers
│   │   ├── routes/       # Express routers
│   │   ├── middleware/   # Auth, role, error middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Request validation
│   │   ├── utils/        # Helpers & utilities
│   │   ├── constants/    # App-wide constants
│   │   └── app.js        # Express app setup
│   └── server.js         # Entry point
└── frontend/         # React + Vite SPA
    └── src/
        ├── pages/        # Route-level page components
        ├── components/   # Reusable UI components
        ├── layouts/      # Page layout wrappers
        ├── hooks/        # Custom React hooks
        ├── services/     # Axios API service layer
        ├── context/      # React Context (Auth)
        ├── routes/       # App routing config
        └── utils/        # Frontend helpers
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT access token secret |
| `JWT_REFRESH_SECRET` | JWT refresh token secret |
| `JWT_EXPIRES_IN` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |

## 📡 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| GET | `/api/movies` | Public | List movies |
| GET | `/api/movies/:id` | Public | Movie details |
| POST | `/api/movies` | Admin | Create movie |
| PUT | `/api/movies/:id` | Admin | Update movie |
| DELETE | `/api/movies/:id` | Admin | Delete movie |
| GET | `/api/theaters` | Public | List theaters |
| POST | `/api/theaters` | Admin | Create theater |
| GET | `/api/shows` | Public | List shows |
| POST | `/api/shows` | Admin | Create show |
| POST | `/api/bookings` | User | Book tickets |
| GET | `/api/bookings/my` | User | Booking history |

## 🎯 MVP Features

**User:** Register · Login · Browse Movies · View Details · Browse Shows · Select Seats · Book Tickets · Booking History

**Admin:** Manage Movies (CRUD) · Manage Theaters · Manage Shows · Seat Layout Management

## 🔮 Future Integrations

- **Socket.io** — Real-time seat availability updates
- **Razorpay** — Payment gateway integration
- **Redis** — Session & response caching

## 📄 License

MIT
