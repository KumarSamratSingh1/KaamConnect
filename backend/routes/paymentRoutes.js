const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');

router.post('/create-order', protect, async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    const mockOrder = { id: `order_${Date.now()}`, amount: booking.pricing.totalAmount * 100, currency: 'INR', receipt: booking.bookingId, status: 'created' };
    return res.json({ success: true, data: mockOrder });
  } catch (error) { next(error); }
});

router.post('/verify', protect, async (req, res, next) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId } = req.body;
    await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed', 'payment.status': 'paid', 'payment.transactionId': razorpayPaymentId, 'payment.paidAt': new Date(), $push: { statusHistory: { status: 'confirmed', updatedBy: req.user._id } } });
    return res.json({ success: true, message: 'Payment verified!' });
  } catch (error) { next(error); }
});

module.exports = router;
