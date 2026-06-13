import { body } from 'express-validator';

export const createTheaterValidator = [
  body('name').trim().notEmpty().withMessage('Theater name is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('rows').isInt({ min: 1 }).withMessage('Rows must be a positive integer'),
  body('columns').isInt({ min: 1 }).withMessage('Columns must be a positive integer'),
  body('amenities').optional().isArray(),
];
