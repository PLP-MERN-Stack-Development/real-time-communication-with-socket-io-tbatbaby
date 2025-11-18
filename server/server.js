import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import messageRoutes from './routes/messages.js';
import roomRoutes from './routes/rooms.js';
// Models
import User from './models/User.js';
import Message from './models/Message.js';
// Import and use routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store online users
const onlineUsers = new Map();

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    // Basic presence check; replace with JWT verification in production
    if (!token) {
      return next(new Error('Authentication error: missing token'));
    }

    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.userId = userId;
      next();
    } else {
      return next(new Error('Authentication error: missing userId'));
    }
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket connection handling
io.on('connection', async (socket) => {
  const username = socket.handshake.auth?.username || 'Unknown';
  console.log('User connected:', socket.id, socket.userId);

  try {
    // Update user online status
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date()
      });

      onlineUsers.set(socket.userId, {
        socketId: socket.id,
        username
      });

      // Join global room
      socket.join('global');

      // Notify others
      socket.to('global').emit('user-online', {
        userId: socket.userId,
        username
      });

      // Send online users list to the connected user
      const onlineUsersList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
        userId: id,
        username: data.username
      }));

      socket.emit('online-users', onlineUsersList);
    }

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const roomName = data?.room || 'global';
        const message = new Message({
          sender: socket.userId,
          content: data?.content,
          room: roomName,
          messageType: 'text'
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        // Emit to room
        io.to(roomName).emit('new-message', {
          _id: message._id,
          sender: message.sender,
          content: message.content,
          room: message.room,
          createdAt: message.createdAt
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const roomName = data?.room || 'global';
      socket.to(roomName).emit('user-typing', {
        userId: socket.userId,
        username,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data) => {
      const roomName = data?.room || 'global';
      socket.to(roomName).emit('user-typing', {
        userId: socket.userId,
        username,
        isTyping: false
      });
    });

    // Handle private messages
    socket.on('send-private-message', async (data) => {
      try {
        if (!data?.receiverId) {
          return socket.emit('private-message-error', { error: 'Missing receiverId' });
        }

        const message = new Message({
          sender: socket.userId,
          receiver: data.receiverId,
          content: data?.content,
          messageType: 'text'
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        const payload = {
          _id: message._id,
          sender: message.sender,
          content: message.content,
          receiver: data.receiverId,
          createdAt: message.createdAt
        };

        // Emit to sender
        socket.emit('new-private-message', payload);

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(data.receiverId)?.socketId;
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new-private-message', payload);
        }
      } catch (error) {
        console.error('Error sending private message:', error);
        socket.emit('private-message-error', { error: 'Failed to send private message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        // Update user status
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          socketId: null,
          lastSeen: new Date()
        });

        // Notify others
        socket.to('global').emit('user-offline', {
          userId: socket.userId,
          username
        });
      }
    });

  } catch (error) {
    console.error('Socket connection error:', error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    onlineUsers: onlineUsers.size,
    timestamp: new Date().toISOString()
  });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// MongoDB connection (fixed env var name)
mongoose.connect(process.env.MONGODB_ATLAS || 'mongodb://localhost:27017/realtime-chat')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Global process handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

export { io, onlineUsers };