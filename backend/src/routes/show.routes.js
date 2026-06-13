import { Router } from 'express';
import { getAllShows, getShowById, createShow, updateShow } from '../controllers/show.controller.js';
import { createShowValidator } from '../validators/show.validator.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', getAllShows);
router.get('/:id', getShowById);
router.post('/', isAuthenticated, isAdmin, createShowValidator, createShow);
router.put('/:id', isAuthenticated, isAdmin, updateShow);

export default router;
