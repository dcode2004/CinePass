import { useEffect } from 'react';
import socket from '../services/socket.js';

// Mirrors the backend socket event constants.
export const SOCKET_EVENTS = {
  JOIN_SHOW: 'show:join',
  LEAVE_SHOW: 'show:leave',
  SEAT_UPDATE: 'seat:update',
};

/**
 * Subscribes to realtime seat updates for a given show.
 *
 * Joins the show's room on mount, listens for `seat:update` events, and
 * cleans up (leaves room + removes listener) on unmount or when showId changes.
 *
 * @param {string} showId - The show to subscribe to.
 * @param {(payload: { showId: string, bookedSeats: string[], availableSeats: number, reason?: string }) => void} onSeatUpdate
 */
export const useShowSeats = (showId, onSeatUpdate) => {
  useEffect(() => {
    if (!showId) return undefined;

    socket.emit(SOCKET_EVENTS.JOIN_SHOW, showId);

    const handler = (payload) => {
      // Guard against stray events from other rooms
      if (payload?.showId === String(showId)) {
        onSeatUpdate(payload);
      }
    };

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, handler);

    return () => {
      socket.off(SOCKET_EVENTS.SEAT_UPDATE, handler);
      socket.emit(SOCKET_EVENTS.LEAVE_SHOW, showId);
    };
  }, [showId, onSeatUpdate]);
};
