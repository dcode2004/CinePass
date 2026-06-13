import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Movie from '../models/movie.model.js';
import Theater from '../models/theater.model.js';
import Show from '../models/show.model.js';
import Booking from '../models/booking.model.js';
import { users } from './data/users.data.js';
import { movies } from './data/movies.data.js';
import { theaters } from './data/theaters.data.js';

// Show timings used to generate multiple shows per movie
const SHOW_TIMES = ['10:00', '13:30', '17:00', '20:30'];
const PRICE_TIERS = [180, 220, 250, 300];
const DAYS_AHEAD = 5; // generate shows for the next N days

/**
 * Returns a date string (YYYY-MM-DD) offset by `daysFromNow` days.
 */
const getDateOffset = (daysFromNow) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const pick = (arr, index) => arr[index % arr.length];

const clearData = async () => {
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    Booking.deleteMany({}),
    Show.deleteMany({}),
    Movie.deleteMany({}),
    Theater.deleteMany({}),
    User.deleteMany({}),
  ]);
};

const seedUsers = async () => {
  console.log('👤 Seeding users...');
  // Use create() (not insertMany) so the pre-save hook hashes passwords
  const created = await User.create(users);
  console.log(`   → ${created.length} users created`);
  return created;
};

const seedMovies = async () => {
  console.log('🎬 Seeding movies...');
  const created = await Movie.insertMany(movies);
  console.log(`   → ${created.length} movies created`);
  return created;
};

const seedTheaters = async () => {
  console.log('🏛️  Seeding theaters...');
  const withTotals = theaters.map((t) => ({ ...t, totalSeats: t.rows * t.columns }));
  const created = await Theater.insertMany(withTotals);
  console.log(`   → ${created.length} theaters created`);
  return created;
};

const seedShows = async (createdMovies, createdTheaters) => {
  console.log('🎟️  Seeding shows...');
  const showsToCreate = [];

  createdMovies.forEach((movie, movieIdx) => {
    // Spread each movie across 2 theaters for variety
    const theaterA = pick(createdTheaters, movieIdx);
    const theaterB = pick(createdTheaters, movieIdx + 1);
    const assignedTheaters = [theaterA, theaterB];

    assignedTheaters.forEach((theater, tIdx) => {
      for (let day = 0; day < DAYS_AHEAD; day++) {
        // Two shows per theater per day to keep volume reasonable
        const times = [pick(SHOW_TIMES, movieIdx + tIdx), pick(SHOW_TIMES, movieIdx + tIdx + 2)];
        times.forEach((showTime, timeIdx) => {
          showsToCreate.push({
            movie: movie._id,
            theater: theater._id,
            showDate: getDateOffset(day),
            showTime,
            price: pick(PRICE_TIERS, movieIdx + timeIdx),
            availableSeats: theater.totalSeats,
            bookedSeats: [],
            isActive: true,
          });
        });
      }
    });
  });

  const created = await Show.insertMany(showsToCreate);
  console.log(`   → ${created.length} shows created`);
  return created;
};

const seed = async () => {
  try {
    await connectDB();
    await clearData();

    await seedUsers();
    const createdMovies = await seedMovies();
    const createdTheaters = await seedTheaters();
    await seedShows(createdMovies, createdTheaters);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔑 Demo credentials:');
    console.log('   Admin → admin@cinepass.com / admin123');
    console.log('   User  → user@cinepass.com / user123\n');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seed();
