
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const { User, Shop } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Phone-based login with enhanced validation
router.post('/phone-login', async (req, res) => {
  try {
    const { phone } = req.body;

    console.log('📱 Phone login attempt:', phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // Clean phone number and validate format
    let cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid 10-digit phone number'
      });
    }

    console.log('📱 Cleaned phone number:', cleanPhone);
    
    let user = await User.findOne({ where: { phone: cleanPhone } });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: `Customer ${cleanPhone.slice(-4)}`,
        role: 'customer',
        is_active: true
      });
      isNewUser = true;
      console.log('✅ New customer created:', user.id);
    } else {
      console.log('✅ Existing customer found:', user.id);
    }

    const token = jwt.encode({
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    }, process.env.JWT_SECRET || 'your-secret-key');

    let shopInfo = null;
    if (user.role === 'shop_owner') {
      const shop = await Shop.findOne({ where: { owner_id: user.id } });
      if (shop) {
        shopInfo = {
          shop_id: shop.id,
          shop_name: shop.name,
          shop_slug: shop.slug
        };
      }
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        ...shopInfo
      },
      isNewUser
    });

  } catch (error) {
    console.error('❌ Phone login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// Email-based login - FIXED with proper password verification
router.post('/email-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'Password not set for this account'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    const token = jwt.encode({
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    }, process.env.JWT_SECRET || 'your-secret-key');

    let shopInfo = null;
    if (user.role === 'shop_owner') {
      const shop = await Shop.findOne({ where: { owner_id: user.id } });
      if (shop) {
        shopInfo = {
          shop_id: shop.id,
          shop_name: shop.name,
          shop_slug: shop.slug
        };
      }
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        ...shopInfo
      }
    });

  } catch (error) {
    console.error('Email login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    let shopInfo = null;
    if (user.role === 'shop_owner') {
      const shop = await Shop.findOne({ where: { owner_id: user.id } });
      if (shop) {
        shopInfo = {
          shop_id: shop.id,
          shop_name: shop.name,
          shop_slug: shop.slug
        };
      }
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        ...shopInfo
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const [updatedRows] = await User.update(
      { name: name.trim() },
      { where: { id: req.user.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;
