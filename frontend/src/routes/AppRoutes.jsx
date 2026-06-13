import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Public pages
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Movies from '../pages/Movies.jsx';
import MovieDetail from '../pages/MovieDetail.jsx';
import Theaters from '../pages/Theaters.jsx';
import Shows from '../pages/Shows.jsx';
import SeatSelection from '../pages/SeatSelection.jsx';
import BookingConfirmation from '../pages/BookingConfirmation.jsx';
import BookingHistory from '../pages/BookingHistory.jsx';

// Admin pages
import Dashboard from '../pages/admin/Dashboard.jsx';
import ManageMovies from '../pages/admin/ManageMovies.jsx';
import ManageTheaters from '../pages/admin/ManageTheaters.jsx';
import ManageShows from '../pages/admin/ManageShows.jsx';

const AppRoutes = () => (
  <Routes>
    {/* Public routes with main layout */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetail />} />
      <Route path="/theaters" element={<Theaters />} />
      <Route path="/shows" element={<Shows />} />

      {/* Protected user routes */}
      <Route
        path="/shows/:showId/seats"
        element={
          <ProtectedRoute>
            <SeatSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/confirm"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Admin routes */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="movies" element={<ManageMovies />} />
      <Route path="theaters" element={<ManageTheaters />} />
      <Route path="shows" element={<ManageShows />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
