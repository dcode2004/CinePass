import { validationResult } from 'express-validator';
import Show from '../models/show.model.js';
import Theater from '../models/theater.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllShows = async (req, res, next) => {
  try {
    const { movieId, theaterId, date } = req.query;
    const filter = { isActive: true };

    if (movieId) filter.movie = movieId;
    if (theaterId) filter.theater = theaterId;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.showDate = { $gte: start, $lt: end };
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration language')
      .populate('theater', 'name location')
      .sort({ showDate: 1, showTime: 1 });

    return successResponse(res, 'Shows fetched', { shows });
  } catch (error) {
    next(error);
  }
};

export const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');
    if (!show || !show.isActive) return errorResponse(res, 'Show not found', 404);
    return successResponse(res, 'Show fetched', { show });
  } catch (error) {
    next(error);
  }
};

export const createShow = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }

    const theater = await Theater.findById(req.body.theater);
    if (!theater) return errorResponse(res, 'Theater not found', 404);

    const show = await Show.create({
      ...req.body,
      availableSeats: theater.totalSeats,
    });

    return successResponse(res, 'Show created', { show }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!show) return errorResponse(res, 'Show not found', 404);
    return successResponse(res, 'Show updated', { show });
  } catch (error) {
    next(error);
  }
};
