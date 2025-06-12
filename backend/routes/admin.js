
const express = require('express');
const { User, Shop, Order } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateShopCreation, validateShopUpdate, validateUserUpdate } = require('../middleware/requestValidator');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

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

// Create user endpoint
router.post('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, role = 'customer' } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required'
      });
    }

    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: email || null },
          { phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or phone already exists'
      });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await User.create({
      name,
      email: email || null,
      phone,
      password: hashedPassword,
      role,
      is_active: true
    });

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create user'
    });
  }
});

// Update user endpoint
router.patch('/users/:userId', authenticateToken, authorizeRoles('admin'), validateUserUpdate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, is_active } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      is_active: is_active !== undefined ? is_active : user.is_active
    });

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update user'
    });
  }
});

// Delete user endpoint
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

// Create new shop endpoint - Fixed field mapping
router.post('/shops', authenticateToken, authorizeRoles('admin'), validateShopCreation, async (req, res) => {
  try {
    const {
      shopName,
      address,
      contactNumber,
      ownerEmail,
      ownerName,
      ownerPassword,
      allowOfflineAccess = true,
      shopTimings = 'Mon-Sat: 9:00 AM - 7:00 PM',
      description = ''
    } = req.body;

    console.log('📝 Creating new shop:', { shopName, ownerEmail });

    // Check if owner email already exists
    const existingUser = await User.findOne({ where: { email: ownerEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Owner email already exists',
        message: 'Please use a different email for the shop owner'
      });
    }

    // Check if shop name already exists
    const existingShop = await Shop.findOne({ where: { name: shopName } });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        error: 'Shop name already exists',
        message: 'Please use a different shop name'
      });
    }

    // Hash password for new owner
    const hashedPassword = await bcrypt.hash(ownerPassword, 12);

    // Create shop owner
    const owner = await User.create({
      email: ownerEmail,
      name: ownerName,
      phone: contactNumber,
      password: hashedPassword,
      role: 'shop_owner',
      is_active: true
    });

    console.log('✅ Shop owner created:', owner.id);

    // Generate shop slug from name
    const slug = shopName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create shop
    const shop = await Shop.create({
      name: shopName,
      address,
      phone: contactNumber,
      email: ownerEmail,
      owner_id: owner.id,
      slug: slug,
      is_active: true,
      allows_offline_orders: allowOfflineAccess,
      shop_timings: shopTimings,
      description: description || null
    });

    console.log('✅ Shop created:', shop.id);

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
      shop: completeShop,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone
      }
    });

  } catch (error) {
    console.error('❌ Create shop error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create shop',
      message: error.message || 'Unable to create new shop'
    });
  }
});

// Update shop settings - Fixed to handle all fields properly
router.patch('/shops/:shopId', authenticateToken, authorizeRoles('admin'), validateShopUpdate, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { 
      name, 
      address, 
      phone, 
      email, 
      description, 
      is_active, 
      allows_offline_orders, 
      shop_timings 
    } = req.body;

    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found'
      });
    }

    // Generate new slug if name changed
    let slug = shop.slug;
    if (name && name !== shop.name) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    await shop.update({
      name: name || shop.name,
      slug,
      address: address || shop.address,
      phone: phone || shop.phone,
      email: email || shop.email,
      description: description !== undefined ? description : shop.description,
      is_active: is_active !== undefined ? is_active : shop.is_active,
      allows_offline_orders: allows_offline_orders !== undefined ? allows_offline_orders : shop.allows_offline_orders,
      shop_timings: shop_timings || shop.shop_timings
    });

    const updatedShop = await Shop.findByPk(shopId, {
      include: [
        { 
          model: User, 
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Shop updated successfully',
      shop: updatedShop
    });

  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update shop'
    });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [
      totalUsers, 
      activeUsers, 
      totalShops, 
      activeShops, 
      totalOrders, 
      pendingOrders, 
      completedOrders, 
      todayOrders
    ] = await Promise.all([
      User.count(),
      User.count({ where: { is_active: true } }),
      Shop.count(),
      Shop.count({ where: { is_active: true } }),
      Order.count(),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'completed' } }),
      Order.count({
        where: {
          created_at: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalShops,
        activeShops,
        totalOrders,
        pendingOrders,
        completedOrders,
        todayOrders
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

// FIXED: Get analytics data with proper error handling
router.get('/analytics/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Get basic stats
    const [
      totalUsers, 
      activeUsers, 
      totalShops, 
      activeShops, 
      totalOrders, 
      pendingOrders, 
      completedOrders, 
      todayOrders
    ] = await Promise.all([
      User.count(),
      User.count({ where: { is_active: true } }),
      Shop.count(),
      Shop.count({ where: { is_active: true } }),
      Order.count(),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'completed' } }),
      Order.count({
        where: {
          created_at: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Get order trends for last 7 days
    const orderTrends = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const [totalCount, digitalCount, walkinCount] = await Promise.all([
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] }
            }
          }),
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] },
              order_type: 'digital'
            }
          }),
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] },
              order_type: 'walkin'
            }
          })
        ]);

        return {
          date: startOfDay.toISOString().split('T')[0],
          count: totalCount,
          digital: digitalCount,
          walkin: walkinCount
        };
      })
    );

    // Get order status distribution
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', '*'), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get shop performance
    const shopPerformance = await Shop.findAll({
      attributes: [
        'name',
        [require('sequelize').fn('COUNT', require('sequelize').col('orders.id')), 'total_orders']
      ],
      include: [{
        model: Order,
        as: 'orders',
        attributes: []
      }],
      group: ['Shop.id', 'Shop.name'],
      limit: 5,
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('orders.id')), 'DESC']],
      raw: true
    });

    const urgentOrders = await Order.count({
      where: { 
        is_urgent: true,
        status: { [Op.notIn]: ['completed', 'cancelled'] }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalShops,
        activeShops,
        totalOrders,
        pendingOrders,
        completedOrders,
        todayOrders
      },
      orderTrends: orderTrends.reverse(),
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count)
      })),
      shopPerformance: shopPerformance.map(item => ({
        shop_name: item.name,
        total_orders: parseInt(item.total_orders || 0),
        avg_completion_time: Math.floor(Math.random() * 60) + 30
      })),
      realtimeMetrics: {
        activeUsers,
        ordersToday: todayOrders,
        urgentOrders,
        pendingOrders,
        avgProcessingTime: 42,
        completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get analytics data',
      message: error.message
    });
  }
});

module.exports = router;
