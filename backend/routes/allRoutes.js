// paymentRoutes.js
const express = require('express');
const paymentRouter = express.Router();
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');

// Create Razorpay order (mock)
paymentRouter.post('/create-order', protect, async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Mock Razorpay order
    const mockOrder = {
      id: `order_${Date.now()}`,
      amount: booking.pricing.totalAmount * 100, // paise
      currency: 'INR',
      receipt: booking.bookingId,
      status: 'created'
    };

    return res.json({ success: true, data: mockOrder });
  } catch (error) { next(error); }
});

// Verify payment (mock)
paymentRouter.post('/verify', protect, async (req, res, next) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId } = req.body;
    await Booking.findByIdAndUpdate(bookingId, {
      status: 'confirmed',
      'payment.status': 'paid',
      'payment.transactionId': razorpayPaymentId,
      'payment.razorpayOrderId': razorpayOrderId,
      'payment.razorpayPaymentId': razorpayPaymentId,
      'payment.paidAt': new Date(),
      $push: { statusHistory: { status: 'confirmed', updatedBy: req.user._id, note: 'Payment confirmed' } }
    });
    return res.json({ success: true, message: 'Payment verified!' });
  } catch (error) { next(error); }
});

module.exports = paymentRouter;

// ============================================================

// aiRoutes.js  
const aiExpress = require('express');
const aiRouter = aiExpress.Router();
const { matchWorkers, parseRequirement, suggestSalary, chatAssistant, analyzeSentiment } = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');

aiRouter.post('/match', protect, matchWorkers);
aiRouter.post('/parse-requirement', optionalAuth, parseRequirement);
aiRouter.post('/salary-suggestion', optionalAuth, suggestSalary);
aiRouter.post('/assistant', optionalAuth, chatAssistant);
aiRouter.post('/sentiment', protect, analyzeSentiment);

module.exports = aiRouter;

// ============================================================

// notificationRoutes.js
const notifExpress = require('express');
const notifRouter = notifExpress.Router();
const { protect: protectN } = require('../middleware/auth');
const { Notification } = require('../models/index');

notifRouter.get('/', protectN, async (req, res, next) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(30);
    const unread = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    return res.json({ success: true, data: { notifications: notifs, unread } });
  } catch (e) { next(e); }
});

notifRouter.patch('/read-all', protectN, async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
    return res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = notifRouter;

// ============================================================

// userRoutes.js
const userExpress = require('express');
const userRouter = userExpress.Router();
const { protect: protectU } = require('../middleware/auth');
const User = require('../models/User');
const { uploadProfile } = require('../config/cloudinary');

userRouter.get('/profile', protectU, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ success: true, data: user.toPublicJSON() });
  } catch (e) { next(e); }
});

userRouter.put('/profile', protectU, async (req, res, next) => {
  try {
    const { name, phone, bio, gender, dateOfBirth, location, preferredLanguages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, gender, dateOfBirth, location, preferredLanguages },
      { new: true, runValidators: true }
    );
    return res.json({ success: true, data: user.toPublicJSON() });
  } catch (e) { next(e); }
});

userRouter.post('/photo', protectU, uploadProfile.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
    await User.findByIdAndUpdate(req.user._id, { profilePhoto: { url: req.file.path, publicId: req.file.filename } });
    return res.json({ success: true, data: { url: req.file.path } });
  } catch (e) { next(e); }
});

userRouter.put('/change-password', protectU, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: 'Password changed!' });
  } catch (e) { next(e); }
});

module.exports = userRouter;
