
const express = require('express');
const { Shop, User, Order } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all shops
router.get('/', async (req, res) => {
  try {
    const shops = await Shop.findAll({
      where: { is_active: true },
      include: [{ model: User, as: 'owner', attributes: ['name', 'phone', 'email'] }],
      order: [['rating', 'DESC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      shops
    });

  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get shops',
      message: 'Unable to retrieve shop list'
    });
  }
});

// Get visited shops for customer (for reorder logic)
router.get('/visited', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Only customers can access visited shops'
      });
    }

    // Find shops where customer has placed orders
    const visitedShops = await Shop.findAll({
      include: [
        {
          model: Order,
          as: 'orders',
          where: { customer_id: req.user.id },
          attributes: [], // Don't return order details, just use for filtering
          required: true // Inner join - only shops with orders
        },
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'phone', 'email']
        }
      ],
      where: { is_active: true },
      order: [['rating', 'DESC'], ['name', 'ASC']],
      distinct: true // Remove duplicates
    });

    console.log(`✅ Found ${visitedShops.length} visited shops for customer ${req.user.id}`);

    res.json({
      success: true,
      shops: visitedShops,
      message: visitedShops.length === 0 ? 'No previous orders found. You can order from any shop.' : `Found ${visitedShops.length} shops you've ordered from before.`
    });

  } catch (error) {
    console.error('Get visited shops error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get visited shops',
      message: 'Unable to retrieve your order history'
    });
  }
});

// Get shop by ID
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.shopId, {
      include: [{ model: User, as: 'owner', attributes: ['name', 'phone', 'email'] }]
    });

    if (!shop) {
      return res.status(404).json({ 
        success: false,
        error: 'Shop not found',
        message: 'The requested shop does not exist'
      });
    }

    res.json({
      success: true,
      shop
    });

  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get shop',
      message: 'Unable to retrieve shop information'
    });
  }
});

module.exports = router;
