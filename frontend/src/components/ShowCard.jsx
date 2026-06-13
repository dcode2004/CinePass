import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../utils/helpers.js';

const ShowCard = ({ show }) => {
  const { _id, movie, theater, showDate, showTime, price, availableSeats } = show;

  return (
    <Link
      to={`/shows/${_id}/seats`}
      className={`card p-4 hover:border-red-600 transition-colors duration-200 block ${
        availableSeats === 0 ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">{showTime}</span>
        <span className="text-red-400 font-bold">{formatCurrency(price)}</span>
      </div>
      <p className="text-gray-400 text-sm">{formatDate(showDate)}</p>
      {theater?.name && <p className="text-gray-500 text-xs mt-1">{theater.name}</p>}
      <div className="mt-3 flex items-center justify-between">
        <span
          className={`badge text-xs ${
            availableSeats > 20
              ? 'bg-green-900 text-green-400'
              : availableSeats > 0
              ? 'bg-yellow-900 text-yellow-400'
              : 'bg-red-900 text-red-400'
          }`}
        >
          {availableSeats > 0 ? `${availableSeats} seats left` : 'Sold Out'}
        </span>
        {availableSeats > 0 && (
          <span className="text-xs text-red-500 font-medium">Book Now →</span>
        )}
      </div>
    </Link>
  );
};

export default ShowCard;
