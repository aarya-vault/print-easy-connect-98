
const express = require('express');
const { Order, User, Shop, File } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Generate order ID
const generateOrderId = async (orderType) => {
  const prefix = orderType === 'uploaded-files' ? 'UF' : 'WI';
  const count = await Order.count({ where: { order_type: orderType } });
  return `${prefix}${String(count + 1).padStart(6, '0')}`;
};

// Create new order
router.post('/', authenticateToken, upload.array('files'), async (req, res) => {
  try {
    const {
      shopId,
      orderType = 'uploaded-files',
      customerName,
      customerPhone,
      description
    } = req.body;

    // Generate order ID
    const orderId = await generateOrderId(orderType);

    // Create order
    const order = await Order.create({
      id: orderId,
      shop_id: shopId,
      customer_id: req.user.id,
      customer_name: customerName || req.user.name,
      customer_phone: customerPhone || req.user.phone,
      order_type: orderType,
      description,
      status: 'received'
    });

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await File.create({
          order_id: orderId,
          filename: file.filename,
          original_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype
        });
      }
    }

    // Get complete order data
    const completeOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer' },
        { model: Shop, as: 'shop' },
        { model: File, as: 'files' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get customer orders
router.get('/customer', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      include: [
        { model: Shop, as: 'shop' },
        { model: File, as: 'files' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get shop orders
router.get('/shop', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    // Get shop owned by user
    const shop = await Shop.findOne({ where: { owner_id: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const orders = await Order.findAll({
      where: { shop_id: shop.id },
      include: [
        { model: User, as: 'customer' },
        { model: File, as: 'files' }
      ],
      order: [['is_urgent', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const [updatedRows] = await Order.update(
      { status },
      { where: { id: orderId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer' },
        { model: Shop, as: 'shop' },
        { model: File, as: 'files' }
      ]
    });

    res.json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Toggle order urgency
router.patch('/:orderId/urgency', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await Order.update(
      { is_urgent: !order.is_urgent },
      { where: { id: orderId } }
    );

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer' },
        { model: Shop, as: 'shop' },
        { model: File, as: 'files' }
      ]
    });

    res.json({
      success: true,
      message: 'Order urgency toggled',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Toggle urgency error:', error);
    res.status(500).json({ error: 'Failed to toggle urgency' });
  }
});

module.exports = router;
