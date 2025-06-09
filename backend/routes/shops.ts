
import express from 'express';
import { ShopService } from '../services/ShopService';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const shopService = new ShopService();

// Get all active shops
router.get('/', async (req, res) => {
  try {
    const result = await shopService.getAllShops(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 10,
      req.query.search as string
    );
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shop by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let shop;
    if (isNaN(parseInt(identifier))) {
      shop = await shopService.findShopBySlug(identifier);
    } else {
      shop = await shopService.findShopById(parseInt(identifier));
    }
    
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shop stats
router.get('/:shopId/stats', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const shopId = parseInt(req.params.shopId);
    const stats = await shopService.getShopStats(shopId);
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get shop stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shop details (shop owner only)
router.put('/:shopId', authenticateToken, authorizeRoles('shop_owner'), async (req, res) => {
  try {
    const shopId = parseInt(req.params.shopId);
    
    // Verify user owns this shop
    const userShop = await shopService.findShopByOwner(req.user.id);
    if (!userShop || userShop.id !== shopId) {
      return res.status(403).json({ error: 'Access denied to this shop' });
    }

    const shop = await shopService.updateShop(shopId, req.body);
    
    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(400).json({ error: error.message || 'Failed to update shop' });
  }
});

export default router;
