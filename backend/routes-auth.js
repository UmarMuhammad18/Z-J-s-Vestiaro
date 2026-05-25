// routes/auth.js - Authentication Routes
import express from 'express';
import { register, login, refreshAccessToken, logout, changePassword } from './controllers-authController.js';
import { verifyToken } from './middleware-auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.post('/change-password', verifyToken, changePassword);

export default router;
