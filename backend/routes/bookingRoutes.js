// ========== bookingRoutes.js ==========
const express = require('express');
const bookingRouter = express.Router();
const { createBooking, respondToBooking, startService, completeService, cancelBooking, getMyBookings, getBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

bookingRouter.post('/', protect, createBooking);
bookingRouter.get('/my', protect, getMyBookings);
bookingRouter.get('/:id', protect, getBooking);
bookingRouter.patch('/:id/respond', protect, respondToBooking);
bookingRouter.patch('/:id/start', protect, startService);
bookingRouter.patch('/:id/complete', protect, completeService);
bookingRouter.patch('/:id/cancel', protect, cancelBooking);

module.exports = bookingRouter;
