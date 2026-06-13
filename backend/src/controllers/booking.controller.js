import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import Show from '../models/show.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/index.js';

export const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return errorResponse(res, 'showId and seats array are required', 400);
    }

    const show = await Show.findById(showId).session(session);
    if (!show || !show.isActive) {
      await session.abortTransaction();
      return errorResponse(res, 'Show not found or inactive', 404);
    }

    // Check seat availability
    const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      await session.abortTransaction();
      return errorResponse(res, `Seats already booked: ${alreadyBooked.join(', ')}`, 409);
    }

    if (seats.length > show.availableSeats) {
      await session.abortTransaction();
      return errorResponse(res, 'Not enough available seats', 409);
    }

    // Mark seats as booked atomically
    show.bookedSeats.push(...seats);
    show.availableSeats -= seats.length;
    await show.save({ session });

    const totalAmount = seats.length * show.price;
    const [booking] = await Booking.create(
      [{ user: req.user._id, show: showId, seats, totalAmount, status: BOOKING_STATUS.CONFIRMED, paymentStatus: PAYMENT_STATUS.PAID }],
      { session }
    );

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: 'show', populate: [{ path: 'movie', select: 'title posterUrl' }, { path: 'theater', select: 'name location' }] });

    return successResponse(res, 'Booking confirmed', { booking: populatedBooking }, 201);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'show', populate: [{ path: 'movie', select: 'title posterUrl duration' }, { path: 'theater', select: 'name location' }] })
      .sort({ createdAt: -1 });
    return successResponse(res, 'Bookings fetched', { bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate({ path: 'show', populate: [{ path: 'movie' }, { path: 'theater' }] });
    if (!booking) return errorResponse(res, 'Booking not found', 404);
    return successResponse(res, 'Booking fetched', { booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).session(session);
    if (!booking) {
      await session.abortTransaction();
      return errorResponse(res, 'Booking not found', 404);
    }
    if (booking.status === BOOKING_STATUS.CANCELLED) {
      await session.abortTransaction();
      return errorResponse(res, 'Booking already cancelled', 400);
    }

    // Release seats
    const show = await Show.findById(booking.show).session(session);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((s) => !booking.seats.includes(s));
      show.availableSeats += booking.seats.length;
      await show.save({ session });
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    await booking.save({ session });

    await session.commitTransaction();
    return successResponse(res, 'Booking cancelled and seats released', { booking });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
