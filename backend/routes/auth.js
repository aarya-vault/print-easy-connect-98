const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Shop } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { 
  validatePhoneLogin, 
  validateEmailLogin, 
  validateProfileUpdate 
} = require('../middleware/requestValidator');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      phone: user.phone, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Phone Login (auto-registration for customers)
router.post('/phone-login', validatePhoneLogin, async (req, res) => {
  try {
    const { phone } = req.body;
    console.log(`📱 Phone login attempt for: ${phone}`);

    // Find or create customer
    let user = await User.findOne({ where: { phone } });

    if (!user) {
      // Auto-register new customer
      user = await User.create({
        phone,
        name: `Customer ${phone.slice(-4)}`,
        role: 'customer',
        is_active: true
      });
      console.log(`✅ New customer auto-registered: ${phone}`);
    }

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        error: 'Account deactivated',
        message: 'Please contact support to reactivate your account'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    console.log(`✅ Phone login successful for: ${phone}`);

    res.json({
      success: true,
      message: user.name.includes('Customer') ? 'Welcome to PrintEasy!' : 'Welcome back!',
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
    console.error('❌ Phone login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      message: 'Unable to process login request'
    });
  }
});

// Email Login (for shop owners and admins)
router.post('/email-login', validateEmailLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`📧 Email login attempt for: ${email}`);

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Shop, as: 'ownedShops' }]
    });

    if (!user || !user.password) {
      console.log(`❌ User not found or no password set for: ${email}`);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    if (!user.is_active) {
      console.log(`❌ Account deactivated for: ${email}`);
      return res.status(403).json({ 
        success: false,
        error: 'Account deactivated',
        message: 'Please contact support to reactivate your account'
      });
    }

    console.log(`🔐 Comparing password for user: ${email}`);
    console.log(`🔐 Stored password hash: ${user.password}`);
    
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password validation result: ${validPassword}`);
    
    if (!validPassword) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = generateToken(user);

    console.log(`✅ Email login successful for: ${email}`);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
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
    console.error('❌ Email login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      message: 'Unable to process login request'
    });
  }
});

// Update Profile
router.patch('/update-profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const { name } = req.body;
    
    await User.update(
      { name },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...req.user.dataValues,
        name
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Update failed',
      message: 'Unable to update profile'
    });
  }
});

// Get current user with enhanced data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Shop, as: 'ownedShops' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found',
        message: 'User account no longer exists'
      });
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
        shop_name: user.ownedShops?.[0]?.name,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get user',
      message: 'Unable to retrieve user information'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
    note: 'Please remove the token from client storage'
  });
});

module.exports = router;
