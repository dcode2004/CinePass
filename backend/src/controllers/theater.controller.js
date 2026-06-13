import { validationResult } from 'express-validator';
import Theater from '../models/theater.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getAllTheaters = async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const theaters = await Theater.find(filter).sort({ name: 1 });
    return successResponse(res, 'Theaters fetched', { theaters });
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (!theater || !theater.isActive) return errorResponse(res, 'Theater not found', 404);
    return successResponse(res, 'Theater fetched', { theater });
  } catch (error) {
    next(error);
  }
};

export const createTheater = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }
    const { rows, columns } = req.body;
    const theater = await Theater.create({ ...req.body, totalSeats: rows * columns });
    return successResponse(res, 'Theater created', { theater }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theater) return errorResponse(res, 'Theater not found', 404);
    return successResponse(res, 'Theater updated', { theater });
  } catch (error) {
    next(error);
  }
};
