# 🎬 CinePass

A portfolio-grade full-stack movie ticket booking platform built with the MERN stack — similar to BookMyShow.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router v6, TailwindCSS, Axios, Socket.io Client |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB, Mongoose (with transactions for booking concurrency) |
| Auth & Access Control | JWT (Access + Refresh Tokens), httpOnly refresh cookie, Role-based Access |
| Security & Validation | Helmet, CORS, cookie-parser, express-validator |
| Logging & DX | Morgan, Nodemon |

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
│   │   ├── seeds/        # Demo data seeding scripts and fixtures
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

### Architecture Notes
- **Backend seeds** provide repeatable demo data for users, movies, theaters, and shows, with separate scripts for seeding and destruction.
- **Frontend services** centralize API and socket interaction for pages/components.
- **Validators + middleware** handle request validation, auth/role checks, and standardized error responses.

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

## 🌱 Database Seeding

A complete demo data seeding system is available under `/backend/src/seeds`.

Run from `backend/`:

```bash
npm run seed          # Reset and seed demo data
npm run seed:destroy  # Remove all seeded data
```

### Demo Credentials (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@cinepass.com` | `admin123` |
| User | `user@cinepass.com` | `user123` |

> See `/backend/src/seeds/README.md` for full seeding details and generated dataset info.

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

Base URL: `/api` (except `/health`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Public | Logout user (clears refresh cookie) |
| GET | `/api/auth/me` | User | Get current user profile |
| GET | `/api/movies` | Public | List movies |
| GET | `/api/movies/:id` | Public | Movie details |
| POST | `/api/movies` | Admin | Create movie |
| PUT | `/api/movies/:id` | Admin | Update movie |
| DELETE | `/api/movies/:id` | Admin | Delete movie |
| GET | `/api/theaters` | Public | List theaters |
| GET | `/api/theaters/:id` | Public | Theater details |
| POST | `/api/theaters` | Admin | Create theater |
| PUT | `/api/theaters/:id` | Admin | Update theater |
| GET | `/api/shows` | Public | List shows |
| GET | `/api/shows/:id` | Public | Show details |
| POST | `/api/shows` | Admin | Create show |
| PUT | `/api/shows/:id` | Admin | Update show |
| POST | `/api/bookings` | User | Book tickets |
| GET | `/api/bookings/my` | User | Booking history |
| GET | `/api/bookings/:id` | User | Booking details |
| PATCH | `/api/bookings/:id/cancel` | User | Cancel booking and release seats |

## 🎯 MVP Features

### User
- Register and login with JWT-based authentication
- Token refresh flow using refresh tokens
- Browse movies, theaters, and show timings
- Real-time seat selection and synchronization with Socket.io
- Create bookings, view booking history, and cancel bookings

### Admin
- **Admin Dashboard** for management overview
- **ManageMovies** for full movie CRUD
- **ManageTheaters** for theater and seat-layout management
- **ManageShows** for scheduling and show updates
- Role-protected admin routes and APIs

## 🛡️ Security, Validation & Reliability

- **Helmet** hardens HTTP headers.
- **Request validation** is implemented using `express-validator`.
- **Error middleware** provides centralized 404 and global error handling.
- **MongoDB transactions** ensure concurrency-safe seat booking/cancellation.
- **Socket.io room-based broadcasting** keeps seat maps synchronized for active viewers.

## 🔮 Future Integrations

- **Razorpay** — Payment gateway integration
- **Redis** — Session & response caching

## ✅ Verify Your Setup

After starting backend and frontend:

1. **Check API health**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected: `{"success":true,"message":"CinePass API is running 🎬"}`

2. **Open frontend** at `http://localhost:5173` and ensure pages load.

3. **Verify auth + booking flow**
   - Login with seeded user credentials.
   - Open a show and select seats.
   - Confirm booking appears in Booking History.

4. **Verify admin flow**
   - Login with seeded admin credentials.
   - Visit `/admin` and confirm Dashboard, ManageMovies, ManageTheaters, and ManageShows load.

5. **Verify real-time seat sync**
   - Open the same show in two browser tabs/sessions.
   - Book/cancel seats in one tab and confirm seat state updates in the other tab.

## 📄 License

MIT