import { useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service.js';
import BookingCard from '../components/BookingCard.jsx';
import Loader from '../components/Loader.jsx';
import { Link } from 'react-router-dom';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    bookingService.getMyBookings()
      .then(({ data }) => setBookings(data.data.bookings))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingService.cancel(id);
      setBookings((prev) =>
        prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-400 text-center py-12">{error}</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎟️</p>
          <p className="text-gray-400 mb-6">No bookings yet. Start by browsing movies!</p>
          <Link to="/movies" className="btn-primary">Browse Movies</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id}>
              <BookingCard booking={booking} />
              {booking.status === 'confirmed' && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="text-xs text-red-500 hover:text-red-400 font-medium"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
