
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Shop } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Phone Login (auto-registration for customers)
router.post('/phone-login', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Find or create customer
    let user = await User.findOne({ where: { phone } });

    if (!user) {
      // Auto-register new customer
      user = await User.create({
        phone,
        name: `Customer ${phone.slice(-4)}`,
        role: 'customer'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Email Login (for shop owners and admins)
router.post('/email-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Shop, as: 'ownedShops' }]
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        shop_id: user.ownedShops?.[0]?.id,
        shop_name: user.ownedShops?.[0]?.name
      }
    });

  } catch (error) {
    console.error('Email login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Update Profile
router.patch('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    await User.update(
      { name },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Shop, as: 'ownedShops' }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        shop_id: user.ownedShops?.[0]?.id,
        shop_name: user.ownedShops?.[0]?.name
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
