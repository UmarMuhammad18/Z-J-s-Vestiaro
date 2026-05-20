// routes/payments.js - Payment Routes
import express from 'express';
import { verifyToken } from '../middleware-auth.js';
import {
  confirmPayment,
  refundPayment,
  handleStripeWebhook
} from '../controllers-paymentController.js';

const router = express.Router();

router.post('/confirm', verifyToken, confirmPayment);
router.post('/refund', verifyToken, refundPayment);
router.post('/webhook/stripe', handleStripeWebhook);

export default router;
