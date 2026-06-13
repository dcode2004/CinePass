import { useState, useEffect } from 'react';
import { showService } from '../services/show.service.js';
import ShowCard from '../components/ShowCard.jsx';
import Loader from '../components/Loader.jsx';
import { formatDate } from '../utils/helpers.js';

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await showService.getAll({ date });
        setShows(data.data.shows);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [date]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Shows</h1>
      <div className="mb-6">
        <label className="label">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>
      {loading ? (
        <Loader />
      ) : shows.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No shows available for {formatDate(date)}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shows.map((s) => <ShowCard key={s._id} show={s} />)}
        </div>
      )}
    </div>
  );
};

export default Shows;
