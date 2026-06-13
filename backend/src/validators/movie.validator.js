import { body } from 'express-validator';
import { GENRES, LANGUAGES } from '../constants/index.js';

export const createMovieValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('genre')
    .isArray({ min: 1 }).withMessage('At least one genre is required')
    .custom((genres) => genres.every((g) => GENRES.includes(g)))
    .withMessage(`Genre must be one of: ${GENRES.join(', ')}`),
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(LANGUAGES).withMessage(`Language must be one of: ${LANGUAGES.join(', ')}`),
  body('duration')
    .isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)'),
  body('releaseDate')
    .notEmpty().withMessage('Release date is required')
    .isISO8601().withMessage('Release date must be a valid date'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
];

export const updateMovieValidator = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('genre')
    .optional()
    .isArray({ min: 1 })
    .custom((genres) => genres.every((g) => GENRES.includes(g))),
  body('language').optional().isIn(LANGUAGES),
  body('duration').optional().isInt({ min: 1 }),
  body('releaseDate').optional().isISO8601(),
  body('rating').optional().isFloat({ min: 0, max: 10 }),
];
