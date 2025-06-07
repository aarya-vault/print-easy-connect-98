
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get orders for shop owner
router.get('/shop', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const shopId = req.user.shop_id;
    
    if (!shopId) {
      return res.status(400).json({ error: 'Shop not found for user' });
    }

    const ordersQuery = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      WHERE o.shop_id = $1
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(ordersQuery, [shopId]);
    
    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders for customer
router.get('/customer', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const customerId = req.user.id;
    
    const ordersQuery = `
      SELECT o.*, s.name as shop_name, s.address as shop_address
      FROM orders o
      JOIN shops s ON o.shop_id = s.id
      WHERE o.customer_id = $1
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(ordersQuery, [customerId]);
    
    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', authenticateToken, authorizeRoles('customer'), [
  body('shopId').isInt().withMessage('Valid shop ID required'),
  body('orderType').isIn(['walk-in', 'uploaded-files']).withMessage('Valid order type required'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.user.id;
    const { shopId, orderType, description, instructions, services, pages, copies, paperType, binding, color } = req.body;

    // Verify shop exists
    const shopQuery = 'SELECT id FROM shops WHERE id = $1 AND is_active = true';
    const shopResult = await db.query(shopQuery, [shopId]);
    
    if (shopResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const insertQuery = `
      INSERT INTO orders (
        shop_id, customer_id, order_type, description, instructions, 
        services, pages, copies, paper_type, binding, color, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'new', NOW())
      RETURNING *
    `;

    const values = [
      shopId, customerId, orderType, description, instructions,
      JSON.stringify(services || []), pages, copies, paperType, binding, color
    ];

    const result = await db.query(insertQuery, values);
    const order = result.rows[0];

    // Get complete order data with customer and shop info
    const completeOrderQuery = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone, s.name as shop_name
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN shops s ON o.shop_id = s.id
      WHERE o.id = $1
    `;
    
    const completeOrderResult = await db.query(completeOrderQuery, [order.id]);

    res.status(201).json({
      success: true,
      order: completeOrderResult.rows[0]
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateToken, [
  body('status').isIn(['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']).withMessage('Valid status required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check if user has permission to update this order
    let orderQuery;
    let queryParams;

    if (req.user.role === 'shop_owner') {
      orderQuery = 'SELECT * FROM orders WHERE id = $1 AND shop_id = $2';
      queryParams = [orderId, req.user.shop_id];
    } else if (req.user.role === 'customer') {
      orderQuery = 'SELECT * FROM orders WHERE id = $1 AND customer_id = $2';
      queryParams = [orderId, userId];
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const orderResult = await db.query(orderQuery, queryParams);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = orderResult.rows[0];

    // Update order status
    const updateQuery = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const updateResult = await db.query(updateQuery, [status, orderId]);

    // Log status change
    const historyQuery = `
      INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, changed_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    await db.query(historyQuery, [orderId, currentOrder.status, status, req.user.role]);

    res.json({
      success: true,
      order: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle order urgency
router.patch('/:orderId/urgency', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const shopId = req.user.shop_id;

    const orderQuery = 'SELECT * FROM orders WHERE id = $1 AND shop_id = $2';
    const orderResult = await db.query(orderQuery, [orderId, shopId]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = orderResult.rows[0];
    const newUrgency = !currentOrder.is_urgent;

    const updateQuery = 'UPDATE orders SET is_urgent = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const result = await db.query(updateQuery, [newUrgency, orderId]);

    res.json({
      success: true,
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle urgency error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
