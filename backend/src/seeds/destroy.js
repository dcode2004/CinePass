import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Movie from '../models/movie.model.js';
import Theater from '../models/theater.model.js';
import Show from '../models/show.model.js';
import Booking from '../models/booking.model.js';

/**
 * Destroys all seeded data. Useful for a clean reset without re-seeding.
 */
const destroy = async () => {
  try {
    await connectDB();
    console.log('🧹 Destroying all data...');
    await Promise.all([
      Booking.deleteMany({}),
      Show.deleteMany({}),
      Movie.deleteMany({}),
      Theater.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('✅ All data destroyed.');
  } catch (error) {
    console.error('❌ Destroy failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

destroy();
