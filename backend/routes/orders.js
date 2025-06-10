
const express = require('express');
const { Order, User, Shop, File } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Generate order ID
const generateOrderId = async (orderType) => {
  const prefix = orderType === 'uploaded-files' ? 'UF' : 'WI';
  const count = await Order.count({ where: { order_type: orderType } });
  return `${prefix}${String(count + 1).padStart(6, '0')}`;
};

// Create new order - FIXED to handle FormData properly
router.post('/', authenticateToken, upload.array('files'), async (req, res) => {
  try {
    console.log('📝 Creating order with data:', req.body);
    console.log('📁 Files uploaded:', req.files?.length || 0);

    const {
      shopId,
      orderType = 'uploaded-files',
      customerName,
      customerPhone,
      description
    } = req.body;

    // Validate required fields
    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: 'Shop ID is required'
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    // Verify shop exists
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(400).json({
        success: false,
        error: 'Shop not found'
      });
    }

    // For uploaded-files orders, files are optional now but check if they exist
    if (orderType === 'uploaded-files' && (!req.files || req.files.length === 0)) {
      console.log('⚠️ No files uploaded for uploaded-files order - proceeding anyway');
    }

    // Generate order ID
    const orderId = await generateOrderId(orderType);

    // Create order
    const order = await Order.create({
      id: orderId,
      shop_id: parseInt(shopId),
      customer_id: req.user.id,
      customer_name: customerName || req.user.name || `Customer ${req.user.phone?.slice(-4) || 'Unknown'}`,
      customer_phone: customerPhone || req.user.phone || '',
      order_type: orderType,
      description: description.trim(),
      status: 'received',
      is_urgent: false
    });

    console.log('✅ Order created:', orderId);

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      console.log(`📁 Processing ${req.files.length} files`);
      
      for (const file of req.files) {
        await File.create({
          order_id: orderId,
          filename: file.filename,
          original_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          restrict_download: false // Default to not restricting download
        });
      }
      
      console.log('✅ Files processed successfully');
    }

    // Get complete order data
    const completeOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'address', 'phone'] },
        { model: File, as: 'files' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Get customer orders
router.get('/customer', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'address', 'phone', 'rating'] },
        { model: File, as: 'files' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders'
    });
  }
});

// Get shop orders with better filtering
router.get('/shop', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    // Get shop owned by user
    const shop = await Shop.findOne({ where: { owner_id: req.user.id } });
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found'
      });
    }

    const { status, orderType, urgent, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { shop_id: shop.id };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (orderType && orderType !== 'all') {
      whereClause.order_type = orderType;
    }
    
    if (urgent === 'true') {
      whereClause.is_urgent = true;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: File, as: 'files' }
      ],
      order: [['is_urgent', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      orders,
      totalOrders: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders'
    });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    console.log(`🔄 Updating order ${orderId} status to: ${status}`);

    // Validate status
    const validStatuses = ['received', 'started', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const [updatedRows] = await Order.update(
      { status },
      { where: { id: orderId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'address', 'phone'] },
        { model: File, as: 'files' }
      ]
    });

    console.log('✅ Order status updated successfully');

    res.json({
      success: true,
      message: 'Order status updated',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
});

// Toggle order urgency
router.patch('/:orderId/urgency', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await Order.update(
      { is_urgent: !order.is_urgent },
      { where: { id: orderId } }
    );

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'address', 'phone'] },
        { model: File, as: 'files' }
      ]
    });

    res.json({
      success: true,
      message: 'Order urgency toggled',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Toggle urgency error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle urgency'
    });
  }
});

// Get single order by ID
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'phone'] },
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'address', 'phone', 'rating'] },
        { model: File, as: 'files' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order'
    });
  }
});

module.exports = router;
