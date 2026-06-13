import { useState, useEffect } from 'react';
import { showService } from '../../services/show.service.js';
import { movieService } from '../../services/movie.service.js';
import { theaterService } from '../../services/theater.service.js';
import Loader from '../../components/Loader.jsx';
import { formatDate, formatCurrency } from '../../utils/helpers.js';

const EMPTY_FORM = { movie: '', theater: '', showDate: '', showTime: '', price: '' };

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    const [showsRes, moviesRes, theatersRes] = await Promise.all([
      showService.getAll(),
      movieService.getAll({ limit: 100 }),
      theaterService.getAll(),
    ]);
    setShows(showsRes.data.data.shows);
    setMovies(moviesRes.data.data.movies);
    setTheaters(theatersRes.data.data.theaters);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await showService.create({ ...form, price: Number(form.price) });
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create show.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Shows</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Show'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-white mb-4">Create Show</h3>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Movie</label>
              <select name="movie" value={form.movie} onChange={handleChange} className="input-field" required>
                <option value="">Select movie</option>
                {movies.map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Theater</label>
              <select name="theater" value={form.theater} onChange={handleChange} className="input-field" required>
                <option value="">Select theater</option>
                {theaters.map((t) => <option key={t._id} value={t._id}>{t.name} - {t.location?.city}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Show Date</label>
              <input type="date" name="showDate" value={form.showDate} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Show Time (HH:MM)</label>
              <input type="time" name="showTime" value={form.showTime} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Ticket Price (INR)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" min={0} required />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Creating...' : 'Create Show'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="pb-3 pr-4">Movie</th>
                <th className="pb-3 pr-4">Theater</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3">Seats Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {shows.map((s) => (
                <tr key={s._id} className="text-gray-300">
                  <td className="py-3 pr-4 font-medium text-white">{s.movie?.title}</td>
                  <td className="py-3 pr-4">{s.theater?.name}</td>
                  <td className="py-3 pr-4">{formatDate(s.showDate)}</td>
                  <td className="py-3 pr-4">{s.showTime}</td>
                  <td className="py-3 pr-4">{formatCurrency(s.price)}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${
                      s.availableSeats > 20 ? 'bg-green-900 text-green-400' :
                      s.availableSeats > 0 ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>{s.availableSeats}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageShows;
