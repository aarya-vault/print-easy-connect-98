
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userQuery = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
        const userResult = await db.query(userQuery, [decoded.userId]);
        
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }

        socket.user = userResult.rows[0];
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User ${socket.user.id} connected`);
      this.connectedUsers.set(socket.user.id, socket.id);

      // Join user to their specific rooms
      if (socket.user.role === 'shop_owner') {
        socket.join(`shop_${socket.user.shop_id}`);
      } else if (socket.user.role === 'customer') {
        socket.join(`customer_${socket.user.id}`);
      }

      // Handle chat messages
      socket.on('send_message', async (data) => {
        try {
          const { orderId, message, recipientId } = data;
          
          // Save message to database
          const messageQuery = `
            INSERT INTO chat_messages (order_id, sender_id, recipient_id, message, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
          `;
          const messageResult = await db.query(messageQuery, [orderId, socket.user.id, recipientId, message]);
          
          // Send message to recipient
          const recipientSocketId = this.connectedUsers.get(parseInt(recipientId));
          if (recipientSocketId) {
            this.io.to(recipientSocketId).emit('new_message', {
              ...messageResult.rows[0],
              senderName: socket.user.name
            });
          }
          
          // Confirm message sent
          socket.emit('message_sent', messageResult.rows[0]);
        } catch (error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { orderId, recipientId } = data;
        const recipientSocketId = this.connectedUsers.get(parseInt(recipientId));
        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit('user_typing', {
            userId: socket.user.id,
            userName: socket.user.name,
            orderId
          });
        }
      });

      socket.on('typing_stop', (data) => {
        const { orderId, recipientId } = data;
        const recipientSocketId = this.connectedUsers.get(parseInt(recipientId));
        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit('user_stopped_typing', {
            userId: socket.user.id,
            orderId
          });
        }
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.user.id} disconnected`);
        this.connectedUsers.delete(socket.user.id);
      });
    });
  }

  // Emit order status updates
  emitOrderUpdate(order, shopId) {
    if (this.io) {
      this.io.to(`shop_${shopId}`).emit('order_updated', order);
      this.io.to(`customer_${order.customer_id}`).emit('order_status_changed', order);
    }
  }

  // Emit new order notifications
  emitNewOrder(order, shopId) {
    if (this.io) {
      this.io.to(`shop_${shopId}`).emit('new_order', order);
    }
  }

  // Send notification to specific user
  sendNotification(userId, notification) {
    if (this.io) {
      const userSocketId = this.connectedUsers.get(userId);
      if (userSocketId) {
        this.io.to(userSocketId).emit('notification', notification);
      }
    }
  }
}

module.exports = new SocketService();
