
import express from 'express';
import { OrderService } from '../services/OrderService';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const orderService = new OrderService();

// Get orders for shop owner
router.get('/shop', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const shopId = req.user.shop_id;
    
    if (!shopId) {
      return res.status(400).json({ error: 'Shop not found for user' });
    }

    const result = await orderService.getShopOrders(shopId, req.query);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get orders for customer
router.get('/customer', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const result = await orderService.getCustomerOrders(req.user.id, req.query);
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get single order
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await orderService.findOrderById(
      req.params.orderId,
      req.user.id,
      req.user.role
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Create new order
router.post('/', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await orderService.updateOrderStatus(
      orderId, 
      status, 
      req.user.role,
      req.body.notes
    );

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({ error: error.message || 'Failed to update order status' });
  }
});

// Toggle order urgency
router.patch('/:orderId/urgency', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const order = await orderService.toggleOrderUrgency(req.params.orderId);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Toggle urgency error:', error);
    res.status(400).json({ error: error.message || 'Failed to toggle urgency' });
  }
});

// Delete order
router.delete('/:orderId', authenticateToken, async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.orderId);

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete order' });
  }
});

export default router;
