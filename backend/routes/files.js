
const express = require('express');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const db = require('../config/database');

const router = express.Router();

// Upload files for an order
router.post('/upload/:orderId', authenticateToken, upload.array('files', 5), async (req, res) => {
  try {
    const { orderId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Verify order exists and user has permission
    const orderQuery = `
      SELECT * FROM orders 
      WHERE id = $1 AND (customer_id = $2 OR shop_id IN (SELECT id FROM shops WHERE owner_id = $2))
    `;
    const orderResult = await db.query(orderQuery, [orderId, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    // Save file information to database
    const filePromises = files.map(file => {
      return db.query(`
        INSERT INTO order_files (order_id, original_name, file_path, mime_type, file_size, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [orderId, file.originalname, file.path, file.mimetype, file.size, req.user.id]);
    });

    const fileResults = await Promise.all(filePromises);
    const savedFiles = fileResults.map(result => result.rows[0]);

    res.json({
      success: true,
      files: savedFiles
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get files for an order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify user has access to this order
    const orderQuery = `
      SELECT * FROM orders 
      WHERE id = $1 AND (customer_id = $2 OR shop_id IN (SELECT id FROM shops WHERE owner_id = $2))
    `;
    const orderResult = await db.query(orderQuery, [orderId, req.user.id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    const filesQuery = 'SELECT * FROM order_files WHERE order_id = $1 ORDER BY uploaded_at DESC';
    const filesResult = await db.query(filesQuery, [orderId]);

    res.json({
      success: true,
      files: filesResult.rows
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download/view a file
router.get('/download/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file info and verify permissions
    const fileQuery = `
      SELECT f.*, o.customer_id, o.shop_id 
      FROM order_files f
      JOIN orders o ON f.order_id = o.id
      WHERE f.id = $1
    `;
    const fileResult = await db.query(fileQuery, [fileId]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileResult.rows[0];

    // Check if user has permission to access this file
    const hasPermission = file.customer_id === req.user.id || 
                         (req.user.shop_id && file.shop_id === req.user.shop_id);

    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type);

    // Stream the file
    const fileStream = fs.createReadStream(file.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a file
router.delete('/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Get file info and verify permissions
    const fileQuery = `
      SELECT f.*, o.customer_id 
      FROM order_files f
      JOIN orders o ON f.order_id = o.id
      WHERE f.id = $1 AND o.customer_id = $2
    `;
    const fileResult = await db.query(fileQuery, [fileId, req.user.id]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const file = fileResult.rows[0];

    // Delete file from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete from database
    await db.query('DELETE FROM order_files WHERE id = $1', [fileId]);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
