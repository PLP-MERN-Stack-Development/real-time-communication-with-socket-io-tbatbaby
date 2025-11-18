import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

describe('Messages API', () => {
  let user1, user2, token1, token2;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/realtime-chat-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear data
    await User.deleteMany({});
    await Message.deleteMany({});

    // Create test users
    user1 = await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: 'Password123'
    });

    user2 = await User.create({
      username: 'user2',
      email: 'user2@example.com',
      password: 'Password123'
    });

    // Get tokens
    const login1 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'Password123'
      });

    const login2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user2@example.com',
        password: 'Password123'
      });

    token1 = login1.body.data.token;
    token2 = login2.body.data.token;
  });

  describe('GET /api/messages', () => {
    beforeEach(async () => {
      // Create test messages
      await Message.create([
        {
          sender: user1._id,
          content: 'Hello from user1',
          room: 'global'
        },
        {
          sender: user2._id,
          content: 'Hello from user2',
          room: 'global'
        },
        {
          sender: user1._id,
          receiver: user2._id,
          content: 'Private message'
        }
      ]);
    });

    it('should get global messages', async () => {
      const response = await request(app)
        .get('/api/messages?room=global')
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messages).toHaveLength(2);
      expect(response.body.data.messages[0].content).toBe('Hello from user1');
    });

    it('should get private messages', async () => {
      const response = await request(app)
        .get('/api/messages?room=user_' + user2._id)
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messages).toHaveLength(1);
      expect(response.body.data.messages[0].content).toBe('Private message');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/messages?room=global&page=1&limit=1')
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messages).toHaveLength(1);
      expect(response.body.data.hasMore).toBe(true);
    });
  });

  describe('POST /api/messages', () => {
    it('should send a global message', async () => {
      const messageData = {
        content: 'Test global message',
        room: 'global'
      };

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send(messageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message.content).toBe(messageData.content);
      expect(response.body.data.message.room).toBe('global');
      expect(response.body.data.message.sender).toBe(user1._id.toString());
    });

    it('should send a private message', async () => {
      const messageData = {
        content: 'Test private message',
        receiverId: user2._id.toString()
      };

      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send(messageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message.content).toBe(messageData.content);
      expect(response.body.data.message.receiver).toBe(user2._id.toString());
    });

    it('should validate message content', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({ content: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not send message without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({ content: 'Test message' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/messages/:id', () => {
    let message;

    beforeEach(async () => {
      message = await Message.create({
        sender: user1._id,
        content: 'Message to delete',
        room: 'global'
      });
    });

    it('should delete own message', async () => {
      const response = await request(app)
        .delete(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify message is deleted
      const deletedMessage = await Message.findById(message._id);
      expect(deletedMessage).toBeNull();
    });

    it('should not delete other user\'s message', async () => {
      const response = await request(app)
        .delete(`/api/messages/${message._id}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});