import { Link } from 'react-router-dom';

const TheaterCard = ({ theater }) => {
  const { _id, name, location, totalSeats, amenities } = theater;

  return (
    <Link to={`/theaters/${_id}`} className="card hover:border-red-600 transition-colors duration-200 block p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{name}</h3>
          <p className="text-gray-400 text-sm mt-0.5">📍 {location?.city}</p>
          <p className="text-gray-500 text-xs mt-0.5">{location?.address}</p>
        </div>
        <span className="badge bg-gray-800 text-gray-300 text-xs">{totalSeats} seats</span>
      </div>
      {amenities?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {amenities.slice(0, 4).map((a) => (
            <span key={a} className="badge bg-gray-800 text-gray-400 text-xs">{a}</span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default TheaterCard;
