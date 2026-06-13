import { formatDate, formatCurrency } from '../utils/helpers.js';

const statusColors = {
  confirmed: 'bg-green-900 text-green-400',
  pending: 'bg-yellow-900 text-yellow-400',
  cancelled: 'bg-red-900 text-red-400',
};

const BookingCard = ({ booking }) => {
  const { show, seats, totalAmount, status, bookingDate } = booking;
  const movie = show?.movie;
  const theater = show?.theater;

  return (
    <div className="card p-5">
      <div className="flex gap-4">
        {/* Poster */}
        <div className="w-16 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          {movie?.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{movie?.title || 'Unknown Movie'}</h3>
            <span className={`badge text-xs flex-shrink-0 ${statusColors[status] || 'bg-gray-800 text-gray-400'}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">{theater?.name}</p>
          <p className="text-gray-500 text-xs">{theater?.location?.city}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>📅 {formatDate(show?.showDate)} at {show?.showTime}</span>
            <span>💺 Seats: {seats?.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">Booked on {formatDate(bookingDate)}</span>
        <span className="font-bold text-white">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
};

export default BookingCard;
