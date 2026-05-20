// routes/orders.js - Order Management Routes
import express from 'express';
import { verifyToken } from '../middleware-auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers-orderController.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:orderId', verifyToken, getOrderById);
router.patch('/:orderId/status', verifyToken, updateOrderStatus);
router.post('/:orderId/cancel', verifyToken, cancelOrder);

export default router;
