
const express = require('express');
const { Message, User, Order } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Get messages for an order
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify user has access to this order
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is customer or shop owner for this order
    if (order.customer_id !== req.user.id && order.shop_id !== req.user.shop_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.findAll({
      where: { order_id: orderId },
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { orderId, message, recipientId } = req.body;

    if (!orderId || !message || !recipientId) {
      return res.status(400).json({ error: 'Order ID, message, and recipient ID are required' });
    }

    // Verify order exists and user has access
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer_id !== req.user.id && order.shop_id !== req.user.shop_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const newMessage = await Message.create({
      order_id: orderId,
      sender_id: req.user.id,
      message,
      is_read: false
    });

    const messageWithSender = await Message.findByPk(newMessage.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }]
    });

    res.json({
      success: true,
      message: messageWithSender
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get unread message count
router.get('/unread-count', async (req, res) => {
  try {
    const unreadCount = await Message.count({
      where: { 
        sender_id: { [require('sequelize').Op.ne]: req.user.id },
        is_read: false
      },
      include: [{
        model: Order,
        as: 'order',
        where: req.user.role === 'customer' 
          ? { customer_id: req.user.id }
          : { shop_id: req.user.shop_id }
      }]
    });

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark message as read
router.patch('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.update(
      { is_read: true },
      { where: { id: messageId } }
    );

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;
