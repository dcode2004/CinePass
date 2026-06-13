import { Link } from 'react-router-dom';
import { formatDuration } from '../utils/helpers.js';

const MovieCard = ({ movie }) => {
  const { _id, title, genre, language, duration, rating, posterUrl, releaseDate } = movie;

  return (
    <Link to={`/movies/${_id}`} className="card group hover:border-red-600 transition-colors duration-200 block">
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎬</div>
        )}
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">
          ★ {rating?.toFixed(1) || 'N/A'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-2">{title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {genre?.slice(0, 2).map((g) => (
            <span key={g} className="badge bg-gray-800 text-gray-300">{g}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{language}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
