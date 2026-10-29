// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 60 }).withMessage('Name must be between 2 and 60 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian phone number starting with 6-9'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['customer', 'worker']).withMessage('Role must be either customer or worker')
];

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
