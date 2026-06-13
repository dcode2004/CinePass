import { Router } from 'express';
import authRoutes from './auth.routes.js';
import movieRoutes from './movie.routes.js';
import theaterRoutes from './theater.routes.js';
import showRoutes from './show.routes.js';
import bookingRoutes from './booking.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theaters', theaterRoutes);
router.use('/shows', showRoutes);
router.use('/bookings', bookingRoutes);

export default router;
