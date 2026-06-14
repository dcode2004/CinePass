import { io } from 'socket.io-client';

/**
 * Socket.io server origin. The API base URL ends in `/api`, but Socket.io
 * connects to the server root, so we strip the `/api` suffix.
 */
const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

// Single shared connection for the whole app (lazy, autoConnect).
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

export default socket;
