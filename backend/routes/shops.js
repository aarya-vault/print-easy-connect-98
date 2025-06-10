
const express = require('express');
const { Shop, User, Order } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all shops with optional filtering
router.get('/', async (req, res) => {
  try {
    const { city, services, rating, sort = 'rating', limit = 20 } = req.query;
    
    const whereClause = { is_active: true };
    
    if (city) {
      whereClause.address = { [Op.iLike]: `%${city}%` };
    }
    
    const orderClause = [];
    switch (sort) {
      case 'rating':
        orderClause.push(['rating', 'DESC']);
        break;
      case 'name':
        orderClause.push(['name', 'ASC']);
        break;
      default:
        orderClause.push(['created_at', 'DESC']);
    }

    const shops = await Shop.findAll({
      where: whereClause,
      order: orderClause,
      limit: parseInt(limit),
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'phone']
        }
      ]
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

// ADDED: Get shop by slug for public access
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('🔍 Looking for shop with slug:', slug);

    const shop = await Shop.findOne({
      where: { 
        slug: slug,
        is_active: true 
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'phone', 'email']
        }
      ]
    });

    if (!shop) {
      console.log('❌ Shop not found for slug:', slug);
      return res.status(404).json({
        success: false,
        error: 'Shop not found',
        message: 'The requested shop does not exist or is inactive'
      });
    }

    console.log('✅ Shop found:', shop.name);

    res.json({
      success: true,
      shop
    });

  } catch (error) {
    console.error('Get shop by slug error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get shop',
      message: 'Unable to retrieve shop information'
    });
  }
});

// Get visited shops for a customer
router.get('/visited', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get shops where user has placed orders
    const visitedShops = await Shop.findAll({
      include: [
        {
          model: Order,
          as: 'orders',
          where: { customer_id: userId },
          attributes: [],
          required: true
        }
      ],
      group: ['Shop.id'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      shops: visitedShops
    });

  } catch (error) {
    console.error('Get visited shops error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get visited shops',
      message: 'Unable to retrieve your shop history'
    });
  }
});

module.exports = router;
