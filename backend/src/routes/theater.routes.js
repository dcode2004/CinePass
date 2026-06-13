import { Router } from 'express';
import { getAllTheaters, getTheaterById, createTheater, updateTheater } from '../controllers/theater.controller.js';
import { createTheaterValidator } from '../validators/theater.validator.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);
router.post('/', isAuthenticated, isAdmin, createTheaterValidator, createTheater);
router.put('/:id', isAuthenticated, isAdmin, updateTheater);

export default router;
