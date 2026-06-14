import { Server } from 'socket.io';
import env from './env.js';
import { SOCKET_EVENTS, showRoom } from '../constants/socketEvents.js';

let io = null;

/**
 * Initializes Socket.io on the given HTTP server and registers connection
 * handlers. Clients join a per-show room so seat updates are scoped to the
 * show they are currently viewing.
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    if (env.nodeEnv === 'development') {
      console.log(`🔌 Socket connected: ${socket.id}`);
    }

    // Join a show room to receive its seat updates
    socket.on(SOCKET_EVENTS.JOIN_SHOW, (showId) => {
      if (!showId) return;
      socket.join(showRoom(showId));
    });

    // Leave a show room (e.g. when navigating away)
    socket.on(SOCKET_EVENTS.LEAVE_SHOW, (showId) => {
      if (!showId) return;
      socket.leave(showRoom(showId));
    });

    socket.on('disconnect', () => {
      if (env.nodeEnv === 'development') {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      }
    });
  });

  return io;
};

/**
 * Returns the active Socket.io instance. Throws if called before init.
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket() first.');
  }
  return io;
};

/**
 * Broadcasts the latest seat state for a show to everyone in its room.
 * Safe to call even if Socket.io is not initialized (no-op with a warning),
 * so REST flows never fail because of the realtime layer.
 *
 * @param {string} showId
 * @param {{ bookedSeats: string[], availableSeats: number, reason?: string }} payload
 */
export const emitSeatUpdate = (showId, payload) => {
  if (!io) {
    console.warn('emitSeatUpdate called before Socket.io init; skipping broadcast.');
    return;
  }
  io.to(showRoom(showId)).emit(SOCKET_EVENTS.SEAT_UPDATE, {
    showId: String(showId),
    ...payload,
  });
};
