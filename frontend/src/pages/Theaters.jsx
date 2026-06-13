import { useState, useEffect } from 'react';
import { theaterService } from '../services/theater.service.js';
import TheaterCard from '../components/TheaterCard.jsx';
import Loader from '../components/Loader.jsx';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await theaterService.getAll(city ? { city } : {});
        setTheaters(data.data.theaters);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [city]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Theaters</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>
      {loading ? (
        <Loader />
      ) : theaters.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No theaters found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {theaters.map((t) => <TheaterCard key={t._id} theater={t} />)}
        </div>
      )}
    </div>
  );
};

export default Theaters;
