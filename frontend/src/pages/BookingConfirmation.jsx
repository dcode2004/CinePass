import { useLocation, Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../utils/helpers.js';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">No booking data found.</p>
        <Link to="/movies" className="btn-primary">Browse Movies</Link>
      </div>
    );
  }

  const { show, seats, totalAmount, status } = booking;
  const movie = show?.movie;
  const theater = show?.theater;

  return (
    <div className="max-w-lg mx-auto">
      <div className="card p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-8">Your tickets have been booked successfully.</p>

        <div className="bg-gray-800 rounded-xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Movie</span>
            <span className="text-white font-medium">{movie?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Theater</span>
            <span className="text-white">{theater?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Date & Time</span>
            <span className="text-white">{formatDate(show?.showDate)} at {show?.showTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Seats</span>
            <span className="text-white">{seats?.join(', ')}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-3">
            <span className="text-gray-400 text-sm font-semibold">Total Paid</span>
            <span className="text-red-400 font-bold text-lg">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Status</span>
            <span className="badge bg-green-900 text-green-400">{status}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/bookings" className="btn-secondary flex-1 text-center py-2.5">My Bookings</Link>
          <Link to="/movies" className="btn-primary flex-1 text-center py-2.5">Book More</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
