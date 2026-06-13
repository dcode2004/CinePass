import { getSeatLabel } from '../utils/helpers.js';

const SeatMap = ({ rows, columns, bookedSeats = [], selectedSeats = [], onSeatClick }) => {
  const getSeatStatus = (label) => {
    if (bookedSeats.includes(label)) return 'booked';
    if (selectedSeats.includes(label)) return 'selected';
    return 'available';
  };

  const seatStyles = {
    available: 'bg-gray-700 hover:bg-green-600 cursor-pointer border-gray-600',
    selected: 'bg-blue-600 border-blue-400 cursor-pointer',
    booked: 'bg-red-900 border-red-800 cursor-not-allowed opacity-60',
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Screen */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-gradient-to-b from-gray-400 to-gray-600 h-2 w-3/4 rounded-t-full opacity-60" />
        <p className="text-xs text-gray-500 mt-1">SCREEN</p>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-2">
        {Array.from({ length: rows }, (_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-1.5">
            {/* Row label */}
            <span className="text-xs text-gray-500 w-5 text-right">
              {String.fromCharCode(65 + rowIdx)}
            </span>
            {Array.from({ length: columns }, (_, colIdx) => {
              const label = getSeatLabel(rowIdx, colIdx);
              const status = getSeatStatus(label);
              return (
                <button
                  key={label}
                  onClick={() => status !== 'booked' && onSeatClick?.(label)}
                  disabled={status === 'booked'}
                  title={label}
                  className={`w-8 h-7 rounded text-xs font-medium border transition-colors duration-150 ${seatStyles[status]}`}
                >
                  {colIdx + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded bg-gray-700 border border-gray-600" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded bg-blue-600 border border-blue-400" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 rounded bg-red-900 border border-red-800" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
