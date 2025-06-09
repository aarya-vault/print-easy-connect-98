
import express from 'express';
import { FileService } from '../services/FileService';
import { authenticateToken } from '../middleware/auth';
import upload from '../middleware/upload';
import fs from 'fs';

const router = express.Router();
const fileService = new FileService();

// Upload files for an order
router.post('/upload/:orderId', authenticateToken, upload.array('files', 5), async (req, res) => {
  try {
    const { orderId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const savedFiles = await fileService.uploadFiles(orderId, files, req.user.id);

    res.json({
      success: true,
      files: savedFiles,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(400).json({ error: error.message || 'Failed to upload files' });
  }
});

// Get files for an order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const files = await fileService.getOrderFiles(
      req.params.orderId,
      req.user.id,
      req.user.role
    );

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(400).json({ error: error.message || 'Failed to get files' });
  }
});

// Download/view a file
router.get('/download/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    const file = await fileService.getFileById(fileId, req.user.id, req.user.role);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);

    // Stream the file
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(400).json({ error: error.message || 'Failed to download file' });
  }
});

// Delete a file
router.delete('/:fileId', authenticateToken, async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    await fileService.deleteFile(fileId, req.user.id, req.user.role);

    res.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete file' });
  }
});

export default router;
