import { useState } from 'react';
import { useMovies } from '../hooks/useMovies.js';
import MovieCard from '../components/MovieCard.jsx';
import Loader from '../components/Loader.jsx';
import { GENRES, LANGUAGES } from '../../constants/index.js';

const GENRE_LIST = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
const LANG_LIST = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

const Movies = () => {
  const [filters, setFilters] = useState({ genre: '', language: '', search: '' });
  const { movies, pagination, loading, error } = useMovies(filters);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Movies</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          className="input-field max-w-md"
        />
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {GENRE_LIST.map((g) => (
          <button
            key={g}
            onClick={() => handleFilter('genre', g)}
            className={`badge text-sm px-3 py-1 cursor-pointer transition-colors ${
              filters.genre === g ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Language Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {LANG_LIST.map((l) => (
          <button
            key={l}
            onClick={() => handleFilter('language', l)}
            className={`badge text-sm px-3 py-1 cursor-pointer transition-colors ${
              filters.language === l ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-400 text-center py-12">{error}</p>
      ) : movies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-gray-400">No movies found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{pagination?.total || movies.length} movies found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Movies;
