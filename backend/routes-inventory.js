// routes/inventory.js - Inventory Management Routes
import express from 'express';
import { verifyToken } from './middleware-auth.js';
import {
  getInventory,
  checkStock,
  updateInventory,
  getLowStockProducts
} from './controllers-inventoryController.js';

const router = express.Router();

router.get('/products/:productId', getInventory);
router.post('/check-stock', checkStock);
router.get('/low-stock', verifyToken, getLowStockProducts);
router.patch('/products/:productId', verifyToken, updateInventory);

export default router;
