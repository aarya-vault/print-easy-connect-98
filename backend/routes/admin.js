
const express = require('express');
const { User, Shop, Order } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = express.Router();

// Get all users with pagination and search
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (role && role !== 'all') {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      users,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get users',
      message: 'Unable to retrieve user list'
    });
  }
});

// Get all shops with management features
router.get('/shops', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const shops = await Shop.findAll({
      include: [
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']]
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

// Create new shop
router.post('/shops', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      description,
      ownerEmail,
      ownerName,
      ownerPassword
    } = req.body;

    // Validate required fields
    if (!name || !address || !phone || !email || !ownerEmail || !ownerName || !ownerPassword) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'All shop and owner details are required'
      });
    }

    // Check if owner email already exists
    const existingUser = await User.findOne({ where: { email: ownerEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Owner email already exists',
        message: 'Please use a different email for the shop owner'
      });
    }

    // Hash password for new owner
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create shop owner
    const owner = await User.create({
      email: ownerEmail,
      name: ownerName,
      password: hashedPassword,
      role: 'shop_owner',
      is_active: true
    });

    // Create shop
    const shop = await Shop.create({
      name,
      address,
      phone,
      email,
      description,
      owner_id: owner.id,
      rating: 0,
      is_active: true,
      allows_offline_orders: true
    });

    // Get complete shop data
    const completeShop = await Shop.findByPk(shop.id, {
      include: [
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      shop: completeShop
    });

  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create shop',
      message: 'Unable to create new shop'
    });
  }
});

// Update user status
router.patch('/users/:userId/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const [updatedRows] = await User.update(
      { is_active: isActive },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update user status'
    });
  }
});

// Delete user
router.delete('/users/:userId', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedRows = await User.destroy({
      where: { id: userId }
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [totalUsers, totalShops, totalOrders, activeUsers] = await Promise.all([
      User.count(),
      Shop.count(),
      Order.count(),
      User.count({ where: { is_active: true } })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalShops,
        totalOrders,
        activeUsers
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

module.exports = router;
