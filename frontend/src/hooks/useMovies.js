import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movie.service.js';

export const useMovies = (params = {}) => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await movieService.getAll(params);
      setMovies(data.data.movies);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, pagination, loading, error, refetch: fetchMovies };
};
