import { useState, useEffect } from 'react';
import { theaterService } from '../../services/theater.service.js';
import Loader from '../../components/Loader.jsx';

const EMPTY_FORM = { name: '', location: { city: '', address: '' }, rows: '', columns: '', amenities: '' };

const ManageTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchTheaters = async () => {
    const { data } = await theaterService.getAll();
    setTheaters(data.data.theaters);
    setLoading(false);
  };

  useEffect(() => { fetchTheaters(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, location: { ...p.location, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleEdit = (t) => {
    setEditId(t._id);
    setForm({ ...t, amenities: t.amenities?.join(', ') || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        rows: Number(form.rows),
        columns: Number(form.columns),
        amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editId) {
        await theaterService.update(editId, payload);
      } else {
        await theaterService.create(payload);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchTheaters();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save theater.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Theaters</h2>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM); }} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Theater'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-white mb-4">{editId ? 'Edit Theater' : 'Add Theater'}</h3>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Theater Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">City</label>
              <input name="location.city" value={form.location.city} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Address</label>
              <input name="location.address" value={form.location.address} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Rows</label>
              <input type="number" name="rows" value={form.rows} onChange={handleChange} className="input-field" min={1} required />
            </div>
            <div>
              <label className="label">Columns</label>
              <input type="number" name="columns" value={form.columns} onChange={handleChange} className="input-field" min={1} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Amenities (comma-separated)</label>
              <input name="amenities" value={form.amenities} onChange={handleChange} className="input-field" placeholder="Dolby, IMAX, Parking" />
            </div>
            <div>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theaters.map((t) => (
            <div key={t._id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-gray-400 text-sm">{t.location?.city} · {t.totalSeats} seats</p>
                  <p className="text-gray-500 text-xs mt-1">{t.location?.address}</p>
                </div>
                <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTheaters;
