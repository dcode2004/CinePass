import { Link } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies.js';
import MovieCard from '../components/MovieCard.jsx';
import Loader from '../components/Loader.jsx';

const Home = () => {
  const { movies, loading } = useMovies({ limit: 8 });

  return (
    <div>
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-20 px-8 mb-12 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200')] bg-cover bg-center" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Book Your <span className="text-red-500">Perfect</span> Movie Experience
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Discover the latest movies, choose your seats, and book tickets in seconds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/movies" className="btn-primary text-base px-8 py-3">
              Browse Movies
            </Link>
            <Link to="/register" className="btn-outline text-base px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Now Showing */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Now Showing</h2>
          <Link to="/movies" className="text-red-500 hover:text-red-400 text-sm font-medium">View All →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🎬', title: 'Latest Movies', desc: 'Browse the newest releases and upcoming films.' },
          { icon: '💺', title: 'Choose Your Seat', desc: 'Interactive seat map to pick your perfect spot.' },
          { icon: '🎟️', title: 'Instant Booking', desc: 'Confirm your booking in seconds, no hassle.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="card p-6 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
