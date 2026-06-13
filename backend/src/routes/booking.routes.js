import { Router } from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking } from '../controllers/booking.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router();

router.use(isAuthenticated); // All booking routes require auth

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
