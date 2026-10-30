const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { generateTokens, verifyToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

// @desc Register new user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    let { name, email, phone, password, role } = req.body;
    email = email ? email.toLowerCase().trim() : '';
    phone = phone ? phone.trim() : '';

    // Check existing
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Phone';
      return res.status(400).json({ success: false, message: `${field} already registered.` });
    }

    const user = await User.create({ name, email, phone, password, role });

    // Create worker profile if role is worker
    if (role === 'worker') {
      await WorkerProfile.create({ user: user._id });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: `Account suspended: ${user.blockedReason || 'Contact support.'}` });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: user.toPublicJSON(),
        workerProfile,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Refresh token
// @route POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required.' });
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const tokens = generateTokens(user._id, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({ success: true, data: tokens });
  } catch (error) {
    next(error);
  }
};

// @desc Logout
// @route POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await WorkerProfile.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      data: { user: user.toPublicJSON(), workerProfile }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout, getMe };
