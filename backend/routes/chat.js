
const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const socketService = require('../services/socketService');

const router = express.Router();

// Get chat messages for an order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify user has access to this order
    const orderQuery = `
      SELECT * FROM orders 
      WHERE id = $1 AND (customer_id = $2 OR shop_id IN (SELECT id FROM shops WHERE owner_id = $2))
    `;
    const orderResult = await db.query(orderQuery, [orderId, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    // Get messages
    const messagesQuery = `
      SELECT m.*, u.name as sender_name
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.order_id = $1
      ORDER BY m.created_at ASC
    `;
    const messagesResult = await db.query(messagesQuery, [orderId]);

    // Mark messages as read for the current user
    await db.query(`
      UPDATE chat_messages 
      SET is_read = true 
      WHERE order_id = $1 AND recipient_id = $2
    `, [orderId, req.user.id]);

    res.json({
      success: true,
      messages: messagesResult.rows
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message
router.post('/send', authenticateToken, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('message').isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('recipientId').isInt().withMessage('Valid recipient ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, message, recipientId } = req.body;

    // Verify order exists and user has access
    const orderQuery = `
      SELECT * FROM orders 
      WHERE id = $1 AND (customer_id = $2 OR shop_id IN (SELECT id FROM shops WHERE owner_id = $2))
    `;
    const orderResult = await db.query(orderQuery, [orderId, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    // Save message
    const messageQuery = `
      INSERT INTO chat_messages (order_id, sender_id, recipient_id, message, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const messageResult = await db.query(messageQuery, [orderId, req.user.id, recipientId, message]);
    const savedMessage = messageResult.rows[0];

    // Send real-time notification via WebSocket
    socketService.sendNotification(parseInt(recipientId), {
      type: 'new_message',
      orderId,
      message: savedMessage,
      senderName: req.user.name
    });

    res.json({
      success: true,
      message: savedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const countQuery = `
      SELECT COUNT(*) as unread_count
      FROM chat_messages
      WHERE recipient_id = $1 AND is_read = false
    `;
    const countResult = await db.query(countQuery, [req.user.id]);

    res.json({
      success: true,
      unreadCount: parseInt(countResult.rows[0].unread_count)
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
