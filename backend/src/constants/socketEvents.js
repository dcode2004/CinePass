/**
 * Centralized Socket.io event names shared across the realtime layer.
 * Keeping them in one place avoids typos and makes the contract explicit.
 */
export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_SHOW: 'show:join',
  LEAVE_SHOW: 'show:leave',

  // Server -> Client
  SEAT_UPDATE: 'seat:update',
  SHOW_STATE: 'show:state',
};

/**
 * Builds the room name for a given show. All clients viewing the same show
 * join this room so seat updates only reach relevant users.
 */
export const showRoom = (showId) => `show:${showId}`;
