// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 60 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').matches(/^[6-9]\d{9}$/),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['customer', 'worker'])
];

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
