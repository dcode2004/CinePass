import { useState, useEffect } from 'react';
import { movieService } from '../../services/movie.service.js';
import Loader from '../../components/Loader.jsx';
import { formatDate } from '../../utils/helpers.js';

const EMPTY_FORM = {
  title: '', description: '', genre: [], language: 'English',
  duration: '', releaseDate: '', posterUrl: '', rating: '', cast: '',
};

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
const LANGS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchMovies = async () => {
    const { data } = await movieService.getAll({ limit: 100 });
    setMovies(data.data.movies);
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleGenre = (g) => {
    setForm((p) => ({
      ...p,
      genre: p.genre.includes(g) ? p.genre.filter((x) => x !== g) : [...p.genre, g],
    }));
  };

  const handleEdit = (movie) => {
    setEditId(movie._id);
    setForm({
      ...movie,
      releaseDate: movie.releaseDate?.split('T')[0] || '',
      cast: movie.cast?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie?')) return;
    await movieService.delete(id);
    fetchMovies();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        rating: Number(form.rating),
        cast: form.cast.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editId) {
        await movieService.update(editId, payload);
      } else {
        await movieService.create(payload);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Movies</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM); }} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-white mb-4">{editId ? 'Edit Movie' : 'Add New Movie'}</h3>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} required />
            </div>
            <div>
              <label className="label">Language</label>
              <select name="language" value={form.language} onChange={handleChange} className="input-field">
                {LANGS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Release Date</label>
              <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Rating (0-10)</label>
              <input type="number" name="rating" value={form.rating} onChange={handleChange} className="input-field" min={0} max={10} step={0.1} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Poster URL</label>
              <input name="posterUrl" value={form.posterUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="label">Cast (comma-separated)</label>
              <input name="cast" value={form.cast} onChange={handleChange} className="input-field" placeholder="Actor 1, Actor 2" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Genres</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {GENRES.map((g) => (
                  <button type="button" key={g} onClick={() => toggleGenre(g)}
                    className={`badge px-3 py-1 cursor-pointer ${
                      form.genre.includes(g) ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : editId ? 'Update Movie' : 'Create Movie'}
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
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Language</th>
                <th className="pb-3 pr-4">Release</th>
                <th className="pb-3 pr-4">Rating</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {movies.map((m) => (
                <tr key={m._id} className="text-gray-300">
                  <td className="py-3 pr-4 font-medium text-white">{m.title}</td>
                  <td className="py-3 pr-4">{m.language}</td>
                  <td className="py-3 pr-4">{formatDate(m.releaseDate)}</td>
                  <td className="py-3 pr-4">{m.rating?.toFixed(1)}</td>
                  <td className="py-3 flex gap-2">
                    <button onClick={() => handleEdit(m)} className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(m._id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Delete</button>
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

export default ManageMovies;
