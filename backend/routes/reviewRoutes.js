const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Review } = require('../models/index');
const Booking = require('../models/Booking');
const WorkerProfile = require('../models/WorkerProfile');

// Create review
router.post('/', protect, async (req, res, next) => {
  try {
    const { bookingId, rating, comment, breakdown } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.status !== 'completed') return res.status(400).json({ success: false, message: 'Can only review completed bookings.' });

    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const revieweeId = isCustomer ? booking.worker : booking.customer;

    const existing = await Review.findOne({ booking: bookingId, reviewer: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed.' });

    const review = await Review.create({
      booking: bookingId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      reviewerRole: isCustomer ? 'customer' : 'worker',
      rating, comment, breakdown
    });

    // Update worker rating
    if (isCustomer) {
      const allReviews = await Review.find({ reviewee: revieweeId });
      const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
      await WorkerProfile.findOneAndUpdate({ user: revieweeId }, {
        'rating.average': Math.round(avg * 10) / 10,
        'rating.count': allReviews.length
      });
    }

    return res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [reviews, total] = await Promise.all([
      Review.find({ reviewee: req.params.userId, isApproved: true })
        .populate('reviewer', 'name profilePhoto')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(parseInt(limit)),
      Review.countDocuments({ reviewee: req.params.userId, isApproved: true })
    ]);
    return res.json({ success: true, data: { reviews, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
});

module.exports = router;
