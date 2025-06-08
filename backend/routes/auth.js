
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Customer/Shop Owner/Admin Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Find user by phone
    const userQuery = `
      SELECT u.*, s.id as shop_id, s.name as shop_name 
      FROM users u 
      LEFT JOIN shops s ON u.id = s.owner_id 
      WHERE u.phone = $1 AND u.is_active = true
    `;
    const userResult = await db.query(userQuery, [phone]);

    if (userResult.rows.length === 0) {
      // If customer login without password, return specific error for auto-registration
      if (!password) {
        return res.status(401).json({ 
          error: 'Customer not found',
          shouldRegister: true 
        });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // For customers, allow login without password (auto-login)
    if (user.role === 'customer' && !password) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ token, user: userWithoutPassword });
    }

    // For shop owners and admins, password is required
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register new user (customers auto-register, others manual)
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, email, role = 'customer' } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Insert new user
    const userResult = await db.query(`
      INSERT INTO users (phone, password, name, email, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, phone, name, email, role, is_active, created_at
    `, [phone, hashedPassword, name, email, role]);

    const user = userResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userQuery = `
      SELECT u.*, s.id as shop_id, s.name as shop_name 
      FROM users u 
      LEFT JOIN shops s ON u.id = s.owner_id 
      WHERE u.id = $1
    `;
    const userResult = await db.query(userQuery, [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = userResult.rows[0];
    res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const result = await db.query(`
      UPDATE users 
      SET name = COALESCE($1, name), 
          email = COALESCE($2, email),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, phone, name, email, role, is_active
    `, [name, email, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get current user
    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify current password
    if (user.password) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
