import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showService } from '../services/show.service.js';
import { bookingService } from '../services/booking.service.js';
import { useShowSeats } from '../hooks/useShowSeats.js';
import SeatMap from '../components/SeatMap.jsx';
import Loader from '../components/Loader.jsx';
import { formatDate, formatCurrency } from '../utils/helpers.js';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    showService.getById(showId)
      .then(({ data }) => setShow(data.data.show))
      .catch(() => setError('Failed to load show details.'))
      .finally(() => setLoading(false));
  }, [showId]);

  // Apply realtime seat updates broadcast by the server
  const handleSeatUpdate = useCallback((payload) => {
    setShow((prev) =>
      prev ? { ...prev, bookedSeats: payload.bookedSeats, availableSeats: payload.availableSeats } : prev
    );

    // Prevent stale selections: drop any selected seat that just got booked elsewhere
    setSelectedSeats((prev) => {
      const conflicting = prev.filter((s) => payload.bookedSeats.includes(s));
      if (conflicting.length > 0) {
        setNotice(`Seat(s) ${conflicting.join(', ')} were just booked by someone else and removed from your selection.`);
      }
      return prev.filter((s) => !payload.bookedSeats.includes(s));
    });
  }, []);

  useShowSeats(showId, handleSeatUpdate);

  const toggleSeat = (label) => {
    setNotice('');
    setSelectedSeats((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) return;
    setBooking(true);
    setError('');
    try {
      const { data } = await bookingService.create({ showId, seats: selectedSeats });
      navigate('/bookings/confirm', { state: { booking: data.data.booking } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error && !show) return <p className="text-red-400 text-center py-20">{error}</p>;
  if (!show) return null;

  const theater = show.theater;
  const movie = show.movie;
  const total = selectedSeats.length * show.price;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{movie?.title}</h1>
        <p className="text-gray-400 mt-1">
          {theater?.name} · {formatDate(show.showDate)} at {show.showTime}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {notice && (
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm px-4 py-3 rounded-lg mb-6">
          {notice}
        </div>
      )}

      {/* Seat Map */}
      <div className="card p-6 mb-6">
        <SeatMap
          rows={theater?.rows || 8}
          columns={theater?.columns || 10}
          bookedSeats={show.bookedSeats}
          selectedSeats={selectedSeats}
          onSeatClick={toggleSeat}
        />
      </div>

      {/* Booking Summary */}
      <div className="card p-6">
        <h2 className="font-semibold text-white mb-4">Booking Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Selected Seats</span>
            <span className="text-white">
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Price per seat</span>
            <span className="text-white">{formatCurrency(show.price)}</span>
          </div>
          <div className="flex justify-between font-bold text-white border-t border-gray-700 pt-2 mt-2">
            <span>Total</span>
            <span className="text-red-400">{formatCurrency(total)}</span>
          </div>
        </div>
        <button
          onClick={handleBook}
          disabled={selectedSeats.length === 0 || booking}
          className="btn-primary w-full mt-6 py-3"
        >
          {booking ? 'Booking...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
