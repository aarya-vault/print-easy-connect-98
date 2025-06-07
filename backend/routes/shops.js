
const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all active shops
router.get('/', async (req, res) => {
  try {
    const shopsQuery = `
      SELECT id, name, slug, address, phone, opening_time, closing_time, 
             rating, total_reviews, is_active
      FROM shops 
      WHERE is_active = true
      ORDER BY name
    `;
    
    const result = await db.query(shopsQuery);
    
    res.json({
      success: true,
      shops: result.rows
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shop by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const shopQuery = `
      SELECT * FROM shops 
      WHERE (id = $1 OR slug = $1) AND is_active = true
    `;
    
    const result = await db.query(shopQuery, [identifier]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    res.json({
      success: true,
      shop: result.rows[0]
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shop details (shop owner only)
router.put('/:shopId', authenticateToken, authorizeRoles('shop_owner'), [
  body('name').optional().isLength({ min: 2 }).withMessage('Shop name must be at least 2 characters'),
  body('address').optional().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('phone').optional().matches(/^\+?[0-9\s-]{10,15}$/).withMessage('Valid phone number required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shopId } = req.params;
    const userShopId = req.user.shop_id;

    // Verify user owns this shop
    if (parseInt(shopId) !== userShopId) {
      return res.status(403).json({ error: 'Access denied to this shop' });
    }

    const { name, address, phone, opening_time, closing_time } = req.body;
    
    const updateQuery = `
      UPDATE shops 
      SET name = COALESCE($1, name),
          address = COALESCE($2, address),
          phone = COALESCE($3, phone),
          opening_time = COALESCE($4, opening_time),
          closing_time = COALESCE($5, closing_time),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [name, address, phone, opening_time, closing_time, shopId]);
    
    res.json({
      success: true,
      shop: result.rows[0]
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
