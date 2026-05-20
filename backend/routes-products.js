// routes/products.js - Product Routes
import express from 'express';
import { verifyToken, optionalAuth } from '../middleware-auth.js';
import {
  getCategories,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers-productController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);

// Admin routes (require auth)
router.post('/', verifyToken, createProduct);
router.patch('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
