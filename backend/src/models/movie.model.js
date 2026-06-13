import mongoose from 'mongoose';
import { GENRES, LANGUAGES } from '../constants/index.js';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    genre: {
      type: [String],
      enum: GENRES,
      required: [true, 'At least one genre is required'],
    },
    language: {
      type: String,
      enum: LANGUAGES,
      required: [true, 'Language is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    posterUrl: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    cast: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// `language_override: 'none'` prevents MongoDB from treating the document's
// `language` field (e.g. 'Telugu', 'Tamil') as a text-index language override,
// which would otherwise throw "language override unsupported".
movieSchema.index(
  { title: 'text', description: 'text' },
  { language_override: 'none' }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
