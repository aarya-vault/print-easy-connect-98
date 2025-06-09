
const express = require('express');
const path = require('path');
const fs = require('fs');
const { File, Order } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Upload files to existing order
router.post('/upload/:orderId', authenticateToken, upload.array('files'), async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order exists and user has access
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileRecord = await File.create({
          order_id: orderId,
          filename: file.filename,
          original_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype
        });
        uploadedFiles.push(fileRecord);
      }
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Get order files
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const files = await File.findAll({
      where: { order_id: req.params.orderId },
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Download file
router.get('/download/:fileId', authenticateToken, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.fileId, {
      include: [{ model: Order, as: 'order' }]
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user has access to this file
    if (file.order.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.resolve(file.file_path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath, file.original_name);

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete file
router.delete('/:fileId', authenticateToken, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.fileId, {
      include: [{ model: Order, as: 'order' }]
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user has access to this file
    if (file.order.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete file record from database
    await file.destroy();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
