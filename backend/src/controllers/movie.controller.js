import { validationResult } from 'express-validator';
import Movie from '../models/movie.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllMovies = async (req, res, next) => {
  try {
    const { genre, language, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (genre) filter.genre = { $in: [genre] };
    if (language) filter.language = language;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [movies, total] = await Promise.all([
      Movie.find(filter).sort({ releaseDate: -1 }).skip(skip).limit(Number(limit)),
      Movie.countDocuments(filter),
    ]);

    return successResponse(res, 'Movies fetched', {
      movies,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) {
      return errorResponse(res, 'Movie not found', 404);
    }
    return successResponse(res, 'Movie fetched', { movie });
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }
    const movie = await Movie.create(req.body);
    return successResponse(res, 'Movie created', { movie }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return errorResponse(res, 'Movie not found', 404);
    return successResponse(res, 'Movie updated', { movie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!movie) return errorResponse(res, 'Movie not found', 404);
    return successResponse(res, 'Movie deleted');
  } catch (error) {
    next(error);
  }
};
