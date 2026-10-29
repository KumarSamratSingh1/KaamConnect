const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
  });

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🔌 Socket connected: ${socket.user.name} (${userId})`);

    // Join personal room
    socket.join(`user_${userId}`);

    // Update last seen
    User.findByIdAndUpdate(userId, { lastSeen: new Date() }).exec();

    // Join conversation rooms
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing', {
        userId,
        name: socket.user.name,
        isTyping
      });
    });

    // Location update (for real-time tracking)
    socket.on('location_update', ({ bookingId, coordinates }) => {
      socket.to(`booking_${bookingId}`).emit('worker_location', { coordinates, timestamp: new Date() });
    });

    // Join booking room
    socket.on('join_booking', (bookingId) => {
      socket.join(`booking_${bookingId}`);
    });

    // Online status
    socket.on('set_status', (status) => {
      io.emit('user_status_change', { userId, status });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
      User.findByIdAndUpdate(userId, { lastSeen: new Date() }).exec();
      io.emit('user_status_change', { userId, status: 'offline' });
    });
  });

  console.log('🔌 Socket.io initialized');
  return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
