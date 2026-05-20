// routes/cart.js - Shopping Cart Routes
import express from 'express';
import { verifyToken } from '../middleware-auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from '../controllers-cartController.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/items', verifyToken, addToCart);
router.delete('/items/:itemId', verifyToken, removeFromCart);
router.patch('/items/:itemId', verifyToken, updateCartItem);
router.delete('/', verifyToken, clearCart);

export default router;
