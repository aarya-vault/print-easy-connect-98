
import express from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { ShopService } from '../services/ShopService';
import { LoginSchema, CreateUserSchema } from '../lib/validations';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const userService = new UserService();
const shopService = new ShopService();

// Customer/Shop Owner/Admin Login
router.post('/login', async (req, res) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const { phone, email, password } = validatedData;

    let user;
    if (phone) {
      user = await userService.findUserByPhone(phone);
    } else if (email) {
      user = await userService.findUserByEmail(email);
    }

    if (!user) {
      // If customer login without password, return specific error for auto-registration
      if (!password && phone) {
        return res.status(401).json({ 
          error: 'Customer not found',
          shouldRegister: true 
        });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For customers, allow login without password (auto-login)
    if (user.role === 'CUSTOMER' && !password) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const { passwordHash, ...userWithoutPassword } = user;
      const shop = user.role === 'SHOP_OWNER' ? await shopService.findShopByOwner(user.id) : null;
      
      return res.json({ 
        token, 
        user: {
          ...userWithoutPassword,
          shopId: shop?.id,
          shopName: shop?.name,
        }
      });
    }

    // For shop owners and admins, password is required
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Verify password
    const isValidPassword = await userService.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Get shop info for shop owners
    const shop = user.role === 'SHOP_OWNER' ? await shopService.findShopByOwner(user.id) : null;

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ 
      token, 
      user: {
        ...userWithoutPassword,
        shopId: shop?.id,
        shopName: shop?.name,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const validatedData = CreateUserSchema.parse(req.body);

    const user = await userService.createUser(validatedData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shop = user.role === 'SHOP_OWNER' ? await shopService.findShopByOwner(user.id) : null;

    res.json({ 
      user: {
        ...user,
        shopId: shop?.id,
        shopName: shop?.name,
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({ error: error.message || 'Failed to change password' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
