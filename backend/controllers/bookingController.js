const Booking = require('../models/Booking');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { Notification } = require('../models/index');
const { getIO } = require('../socket/socketHandler');

const createNotification = async (recipientId, type, title, body, data = {}) => {
  await Notification.create({ recipient: recipientId, type, title, body, data });
  const io = getIO();
  if (io) io.to(`user_${recipientId}`).emit('notification', { type, title, body, data });
};

// @desc Create booking
// @route POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const {
      workerId, services, primaryService, type,
      scheduledDate, scheduledTime, duration,
      serviceLocation, specialInstructions, urgency, recurringPattern
    } = req.body;

    let worker = await User.findOne({ _id: workerId, role: 'worker', isActive: true });
    let workerProfile = null;
    if (!worker) {
      workerProfile = await WorkerProfile.findById(workerId);
      if (workerProfile) {
        worker = await User.findOne({ _id: workerProfile.user, role: 'worker', isActive: true });
      }
    } else {
      workerProfile = await WorkerProfile.findOne({ user: worker._id });
    }
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found.' });
    if (!workerProfile) return res.status(404).json({ success: false, message: 'Worker profile not found.' });

    if (workerProfile.availabilityStatus === 'busy') {
      return res.status(400).json({ success: false, message: 'Worker is currently busy.' });
    }

    // Normalize services format
    const normalizedServices = Array.isArray(services)
      ? services.map(s => typeof s === 'string' ? { name: s, price: 1000 } : s)
      : [{ name: primaryService || 'cooking', price: 1000 }];

    // Calculate pricing
    const basePrice = (req.body.pricing && req.body.pricing.baseAmount) || normalizedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    const platformFee = Math.round(basePrice * 0.1); // 10% platform fee
    const tax = Math.round(basePrice * 0.18); // 18% GST
    const totalAmount = basePrice + platformFee + tax;

    let formattedLocation = serviceLocation || {};
    if (!formattedLocation.coordinates || !Array.isArray(formattedLocation.coordinates.coordinates)) {
      formattedLocation = {
        ...formattedLocation,
        coordinates: { type: 'Point', coordinates: [77.4126, 23.2599] }
      };
    }

    const booking = await Booking.create({
      customer: req.user._id,
      worker: worker._id,
      workerProfile: workerProfile._id,
      services: normalizedServices,
      primaryService,
      type,
      urgency: urgency || 'normal',
      scheduledDate,
      scheduledTime,
      duration,
      serviceLocation,
      specialInstructions,
      recurringPattern,
      pricing: { basePrice, platformFee, tax, totalAmount },
      expiresAt: new Date(Date.now() + (urgency === 'emergency' ? 10 : 30) * 60 * 1000)
    });

    // Notify worker
    await createNotification(
      workerId,
      'booking_request',
      '🏠 New Booking Request!',
      `${req.user.name} needs ${primaryService} on ${new Date(scheduledDate).toLocaleDateString()}`,
      { bookingId: booking._id }
    );

    // Emit real-time event
    const io = getIO();
    if (io) {
      io.to(`user_${workerId}`).emit('new_booking_request', {
        booking: await booking.populate(['customer', 'worker'])
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking request sent!',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc Accept / Reject booking (Worker)
// @route PATCH /api/bookings/:id/respond
const respondToBooking = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'accept' | 'reject'
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    if (booking.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Booking already responded to.' });
    }

    booking.status = action === 'accept' ? 'accepted' : 'rejected';
    if (action === 'accept') booking.acceptedAt = new Date();
    if (reason) booking.cancellationReason = reason;
    booking.statusHistory.push({ status: booking.status, updatedBy: req.user._id });
    await booking.save();

    if (action === 'accept') {
      await WorkerProfile.findOneAndUpdate({ user: req.user._id }, { availabilityStatus: 'busy', currentBooking: booking._id });
    }

    const title = action === 'accept' ? '✅ Booking Accepted!' : '❌ Booking Rejected';
    const body = action === 'accept'
      ? `${req.user.name} accepted your booking request!`
      : `${req.user.name} rejected your booking. ${reason || ''}`;

    await createNotification(booking.customer, `booking_${action}ed`, title, body, { bookingId: booking._id });

    const io = getIO();
    if (io) io.to(`user_${booking.customer}`).emit('booking_response', { bookingId: booking._id, status: booking.status });

    return res.json({ success: true, message: `Booking ${action}ed.`, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Start service (Worker)
// @route PATCH /api/bookings/:id/start
const startService = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.worker.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = 'in_progress';
    booking.startedAt = new Date();
    booking.statusHistory.push({ status: 'in_progress', updatedBy: req.user._id });
    await booking.save();

    await createNotification(booking.customer, 'system', '🚀 Service Started', 'Your maid has arrived and started the service!', { bookingId: booking._id });

    return res.json({ success: true, message: 'Service started!', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Complete service
// @route PATCH /api/bookings/:id/complete
const completeService = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    booking.status = 'completed';
    booking.completedAt = new Date();
    booking.statusHistory.push({ status: 'completed', updatedBy: req.user._id });
    await booking.save();

    // Update worker stats
    await WorkerProfile.findOneAndUpdate(
      { user: booking.worker },
      {
        $inc: { totalBookings: 1, completedBookings: 1 },
        availabilityStatus: 'available',
        $unset: { currentBooking: 1 }
      }
    );

    await createNotification(booking.customer, 'booking_completed', '🎉 Service Completed!', 'Rate your experience!', { bookingId: booking._id });

    return res.json({ success: true, message: 'Service completed!', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel booking
// @route PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isWorker = booking.worker.toString() === req.user._id.toString();

    if (!isCustomer && !isWorker) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking.' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.user._id;
    booking.cancellationReason = reason;
    booking.statusHistory.push({ status: 'cancelled', updatedBy: req.user._id, note: reason });
    await booking.save();

    if (isWorker) {
      await WorkerProfile.findOneAndUpdate(
        { user: booking.worker },
        { $inc: { cancelledBookings: 1 }, availabilityStatus: 'available', $unset: { currentBooking: 1 } }
      );
    }

    const notifyId = isCustomer ? booking.worker : booking.customer;
    await createNotification(notifyId, 'booking_cancelled', '❌ Booking Cancelled', `Booking cancelled: ${reason || 'No reason provided'}`, { bookingId: booking._id });

    return res.json({ success: true, message: 'Booking cancelled.', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc Get my bookings
// @route GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const isWorker = req.user.role === 'worker';

    const query = { [isWorker ? 'worker' : 'customer']: req.user._id };
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('customer', 'name profilePhoto phone location')
        .populate('worker', 'name profilePhoto phone location')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: {
        bookings,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single booking
// @route GET /api/bookings/:id
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name profilePhoto phone location')
      .populate('worker', 'name profilePhoto phone location')
      .populate('workerProfile');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    const userId = req.user._id.toString();
    if (booking.customer._id.toString() !== userId && booking.worker._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, respondToBooking, startService, completeService, cancelBooking, getMyBookings, getBooking };
