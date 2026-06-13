import { Router } from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/movie.controller.js';
import { createMovieValidator, updateMovieValidator } from '../validators/movie.validator.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', isAuthenticated, isAdmin, createMovieValidator, createMovie);
router.put('/:id', isAuthenticated, isAdmin, updateMovieValidator, updateMovie);
router.delete('/:id', isAuthenticated, isAdmin, deleteMovie);

export default router;
