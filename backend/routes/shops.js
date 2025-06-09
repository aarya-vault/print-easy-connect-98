
const express = require('express');
const { Shop, User, Order } = require('../models');

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
    res.status(500).json({ error: 'Failed to get shops' });
  }
});

// Get shop by ID
router.get('/:shopId', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.shopId, {
      include: [{ model: User, as: 'owner', attributes: ['name', 'phone', 'email'] }]
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      success: true,
      shop
    });

  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: 'Failed to get shop' });
  }
});

module.exports = router;
