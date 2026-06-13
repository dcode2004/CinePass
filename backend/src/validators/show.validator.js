import { body } from 'express-validator';

export const createShowValidator = [
  body('movie').notEmpty().withMessage('Movie ID is required').isMongoId().withMessage('Invalid movie ID'),
  body('theater').notEmpty().withMessage('Theater ID is required').isMongoId().withMessage('Invalid theater ID'),
  body('showDate')
    .notEmpty().withMessage('Show date is required')
    .isISO8601().withMessage('Show date must be a valid date'),
  body('showTime')
    .notEmpty().withMessage('Show time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Show time must be in HH:MM format'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
];
