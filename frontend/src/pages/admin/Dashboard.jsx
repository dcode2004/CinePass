import { useState, useEffect } from 'react';
import { movieService } from '../../services/movie.service.js';
import { theaterService } from '../../services/theater.service.js';
import { showService } from '../../services/show.service.js';
import { bookingService } from '../../services/booking.service.js';
import Loader from '../../components/Loader.jsx';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-6">
    <div className="flex items-center gap-4">
      <div className={`text-3xl p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      movieService.getAll({ limit: 1 }),
      theaterService.getAll(),
      showService.getAll(),
    ]).then(([moviesRes, theatersRes, showsRes]) => {
      setStats({
        movies: moviesRes.data.data.pagination?.total || moviesRes.data.data.movies.length,
        theaters: theatersRes.data.data.theaters.length,
        shows: showsRes.data.data.shows.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🎬" label="Total Movies" value={stats?.movies ?? 0} color="bg-red-900/50" />
        <StatCard icon="🏛️" label="Theaters" value={stats?.theaters ?? 0} color="bg-blue-900/50" />
        <StatCard icon="🎟️" label="Active Shows" value={stats?.shows ?? 0} color="bg-green-900/50" />
      </div>
      <div className="card p-6">
        <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/movies" className="btn-primary text-sm">+ Add Movie</a>
          <a href="/admin/theaters" className="btn-secondary text-sm">+ Add Theater</a>
          <a href="/admin/shows" className="btn-secondary text-sm">+ Add Show</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
