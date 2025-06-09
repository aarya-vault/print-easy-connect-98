
import express from 'express';
import { ChatService } from '../services/ChatService';
import { authenticateToken } from '../middleware/auth';
import socketService from '../services/socketService';

const router = express.Router();
const chatService = new ChatService();

// Get chat messages for an order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const messages = await chatService.getOrderMessages(
      req.params.orderId,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(400).json({ error: error.message || 'Failed to get messages' });
  }
});

// Send a message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const message = await chatService.sendMessage(req.user.id, req.body);

    // Send real-time notification via WebSocket
    socketService.sendNotification(req.body.recipientId, {
      type: 'new_message',
      orderId: req.body.orderId,
      message,
      senderName: req.user.name,
    });

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(400).json({ error: error.message || 'Failed to send message' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await chatService.getUnreadCount(req.user.id);

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark messages as read
router.patch('/order/:orderId/read', authenticateToken, async (req, res) => {
  try {
    await chatService.markMessagesAsRead(req.params.orderId, req.user.id);

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(400).json({ error: error.message || 'Failed to mark messages as read' });
  }
});

export default router;
