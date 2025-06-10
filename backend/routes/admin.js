const express = require('express');
const { User, Shop, Order } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateShopCreation } = require('../middleware/requestValidator');
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

// FIXED: Create new shop endpoint with proper validation
router.post('/shops', authenticateToken, authorizeRoles('admin'), validateShopCreation, async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      description = '',
      ownerEmail,
      ownerName,
      ownerPassword
    } = req.body;

    console.log('📝 Creating new shop:', { name, ownerEmail });

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
    const existingShop = await Shop.findOne({ where: { name } });
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
      password: hashedPassword,
      role: 'shop_owner',
      is_active: true
    });

    console.log('✅ Shop owner created:', owner.id);

    // Generate shop slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create shop
    const shop = await Shop.create({
      name,
      address,
      phone,
      email,
      description,
      owner_id: owner.id,
      slug: slug,
      rating: 0,
      is_active: true,
      allows_offline_orders: true
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
      shop: completeShop
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

// Get real-time analytics data
router.get('/analytics/realtime', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [totalUsers, totalShops, totalOrders, activeUsers, todayOrders] = await Promise.all([
      User.count(),
      Shop.count(),
      Order.count(),
      User.count({ where: { is_active: true } }),
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

        const [totalCount, uploadedCount, walkinCount] = await Promise.all([
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] }
            }
          }),
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] },
              order_type: 'uploaded-files'
            }
          }),
          Order.count({
            where: {
              created_at: { [Op.between]: [startOfDay, endOfDay] },
              order_type: 'walk-in'
            }
          })
        ]);

        return {
          date: startOfDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          count: totalCount,
          uploaded_files: uploadedCount,
          walk_in: walkinCount
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
        status: { [Op.ne]: 'completed' }
      }
    });

    const pendingOrders = await Order.count({
      where: { 
        status: { [Op.in]: ['received', 'started'] }
      }
    });

    res.json({
      success: true,
      analytics: {
        orders: orderTrends.reverse(),
        ordersByStatus: ordersByStatus.map(item => ({
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          count: parseInt(item.count)
        })),
        shopPerformance: shopPerformance.map(item => ({
          shop_name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
          total_orders: parseInt(item.total_orders),
          avg_completion_time: Math.floor(Math.random() * 120) + 30 // Mock data for now
        })),
        realtimeMetrics: {
          activeUsers,
          ordersToday: todayOrders,
          urgentOrders,
          pendingOrders,
          avgProcessingTime: Math.floor(Math.random() * 120) + 45, // Mock data for now
          completionRate: todayOrders > 0 ? Math.round((todayOrders / totalOrders) * 100) : 0
        }
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get analytics data'
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

// Update shop settings
router.put('/shops/:shopId', authenticateToken, authorizeRoles('admin'), async (req, res) => {
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

module.exports = router;
