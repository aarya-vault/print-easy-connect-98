
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Phone-based login for customers
router.post('/phone-login', [
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    // Check if user exists
    let userQuery = 'SELECT * FROM users WHERE phone = $1';
    let userResult = await db.query(userQuery, [phone]);
    
    let user;
    if (userResult.rows.length === 0) {
      // Create new customer
      const insertQuery = `
        INSERT INTO users (phone, role, created_at) 
        VALUES ($1, 'customer', NOW()) 
        RETURNING *
      `;
      const insertResult = await db.query(insertQuery, [phone]);
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        needsNameUpdate: !user.name
      }
    });
  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email/password login for shop owners and admins
router.post('/email-login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const userQuery = `
      SELECT u.*, s.id as shop_id, s.name as shop_name 
      FROM users u 
      LEFT JOIN shops s ON u.id = s.owner_id 
      WHERE u.email = $1 AND u.is_active = true
    `;
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        shopId: user.shop_id,
        shopName: user.shop_name
      }
    });
  } catch (error) {
    console.error('Email login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.patch('/update-profile', authenticateToken, [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const userId = req.user.id;

    const updateQuery = 'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const result = await db.query(updateQuery, [name, userId]);

    res.json({
      success: true,
      user: {
        id: result.rows[0].id,
        phone: result.rows[0].phone,
        name: result.rows[0].name,
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      phone: req.user.phone,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      shopId: req.user.shop_id,
      shopName: req.user.shop_name
    }
  });
});

module.exports = router;
