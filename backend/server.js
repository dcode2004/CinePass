import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/config/socket.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Wrap Express in an HTTP server so Socket.io can share the same port
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`🚀 CinePass server running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`⚡ Realtime seat updates enabled via Socket.io`);
  });
};

startServer();
