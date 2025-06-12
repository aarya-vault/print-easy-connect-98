
const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, Shop, Order } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { 
  validateShopCreation, 
  validateUserUpdate, 
  validateShopUpdate 
} = require('../middleware/requestValidator');

const router = express.Router();

// Get admin dashboard statistics
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalShops,
      totalOrders,
      activeUsers,
      activeShops,
      pendingOrders,
      completedOrders,
      urgentOrders
    ] = await Promise.all([
      User.count(),
      Shop.count(),
      Order.count(),
      User.count({ where: { is_active: true } }),
      Shop.count({ where: { is_active: true } }),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'completed' } }),
      Order.count({ where: { is_urgent: true, status: { [Op.ne]: 'completed' } } })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalShops,
        totalOrders,
        activeUsers,
        activeShops,
        pendingOrders,
        completedOrders,
        urgentOrders
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics'
    });
  }
});

// Get analytics data for dashboard
router.get('/analytics/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Real-time metrics
    const realtimeMetrics = {
      activeUsers: await User.count({ where: { is_active: true } }),
      ordersToday: await Order.count({
        where: {
          created_at: {
            [Op.gte]: new Date().setHours(0, 0, 0, 0)
          }
        }
      }),
      urgentOrders: await Order.count({
        where: {
          is_urgent: true,
          status: { [Op.notIn]: ['completed', 'cancelled'] }
        }
      })
    };

    // Orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Shop performance
    const shopPerformance = await Shop.findAll({
      attributes: [
        'name',
        [Shop.sequelize.fn('COUNT', Shop.sequelize.col('orders.id')), 'total_orders']
      ],
      include: [{
        model: Order,
        as: 'orders',
        attributes: []
      }],
      group: ['Shop.id', 'Shop.name'],
      order: [[Shop.sequelize.fn('COUNT', Shop.sequelize.col('orders.id')), 'DESC']],
      limit: 10,
      raw: true
    }).then(shops => shops.map(shop => ({
      shop_name: shop.name,
      total_orders: parseInt(shop.total_orders) || 0,
      avg_completion_time: Math.floor(Math.random() * 30) + 15 // Mock for now
    })));

    // Order trends (last 7 days)
    const orderTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const [digitalCount, walkinCount] = await Promise.all([
        Order.count({
          where: {
            order_type: 'digital',
            created_at: {
              [Op.gte]: new Date(date.setHours(0, 0, 0, 0)),
              [Op.lt]: new Date(date.setHours(23, 59, 59, 999))
            }
          }
        }),
        Order.count({
          where: {
            order_type: 'walkin',
            created_at: {
              [Op.gte]: new Date(date.setHours(0, 0, 0, 0)),
              [Op.lt]: new Date(date.setHours(23, 59, 59, 999))
            }
          }
        })
      ]);
      
      orderTrends.push({
        date: dateStr,
        digital: digitalCount,
        walkin: walkinCount,
        count: digitalCount + walkinCount
      });
    }

    res.json({
      success: true,
      realtimeMetrics,
      ordersByStatus,
      shopPerformance,
      orderTrends
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics data'
    });
  }
});

// Get all users with pagination and filtering
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50, active } = req.query;
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
    
    if (active !== undefined) {
      whereClause.is_active = active === 'true';
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
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
      error: 'Failed to get users'
    });
  }
});

// Get all shops
router.get('/shops', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const shops = await Shop.findAll({
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
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
      error: 'Failed to get shops'
    });
  }
});

// Create new shop with owner
router.post('/shops', authenticateToken, authorizeRoles('admin'), validateShopCreation, async (req, res) => {
  try {
    const {
      shopName,
      address,
      contactNumber,
      ownerName,
      ownerEmail,
      ownerPassword,
      allowOfflineAccess,
      shopTimings
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: ownerEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create shop owner
    const owner = await User.create({
      name: ownerName,
      email: ownerEmail,
      phone: contactNumber,
      password: ownerPassword, // Will be hashed by model hook
      role: 'shop_owner',
      is_active: true
    });

    // Generate shop slug
    const slug = shopName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create shop
    const shop = await Shop.create({
      owner_id: owner.id,
      name: shopName,
      slug: slug,
      address: address,
      phone: contactNumber,
      email: ownerEmail,
      is_active: true,
      allows_offline_orders: allowOfflineAccess,
      shop_timings: shopTimings
    });

    const shopWithOwner = await Shop.findByPk(shop.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: {
        shop: shopWithOwner,
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone
        }
      }
    });

  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create shop',
      message: error.message
    });
  }
});

// Update shop settings
router.patch('/shops/:shopId', authenticateToken, authorizeRoles('admin'), validateShopUpdate, async (req, res) => {
  try {
    const { shopId } = req.params;
    const updateData = req.body;

    const [updatedRows] = await Shop.update(updateData, {
      where: { id: shopId }
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found'
      });
    }

    const updatedShop = await Shop.findByPk(shopId, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop
    });

  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update shop'
    });
  }
});

// Create new user
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, role = 'customer' } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required'
      });
    }

    const userData = {
      name,
      phone,
      role,
      is_active: true
    };

    if (email) userData.email = email;
    if (password) userData.password = password;

    const user = await User.create(userData);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Update user
router.patch('/users/:userId', authenticateToken, authorizeRoles('admin'), validateUserUpdate, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const [updatedRows] = await User.update(updateData, {
      where: { id: userId }
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
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

module.exports = router;
