import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService } from '../services/movie.service.js';
import { showService } from '../services/show.service.js';
import ShowCard from '../components/ShowCard.jsx';
import Loader from '../components/Loader.jsx';
import { formatDate, formatDuration } from '../utils/helpers.js';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          movieService.getById(id),
          showService.getAll({ movieId: id }),
        ]);
        setMovie(movieRes.data.data.movie);
        setShows(showsRes.data.data.shows);
      } catch {
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (error) return <p className="text-red-400 text-center py-20">{error}</p>;
  if (!movie) return null;

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Poster */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🎬</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-white mb-3">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre?.map((g) => (
              <span key={g} className="badge bg-red-900 text-red-300">{g}</span>
            ))}
            <span className="badge bg-gray-800 text-gray-300">{movie.language}</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
            <span>★ <span className="text-yellow-400 font-bold">{movie.rating?.toFixed(1)}</span> / 10</span>
            <span>⏱ {formatDuration(movie.duration)}</span>
            <span>📅 {formatDate(movie.releaseDate)}</span>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">{movie.description}</p>
          {movie.cast?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Cast</h3>
              <p className="text-gray-300 text-sm">{movie.cast.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Shows */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Available Shows</h2>
        {shows.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400">No shows available for this movie.</p>
            <Link to="/movies" className="btn-outline mt-4 inline-block">Browse Other Movies</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shows.map((show) => (
              <ShowCard key={show._id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
