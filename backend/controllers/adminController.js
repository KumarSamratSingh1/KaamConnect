const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const { Review } = require('../models/index');

// @desc Dashboard stats
// @route GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalWorkers, totalCustomers,
      totalBookings, completedBookings, pendingBookings,
      blockedUsers, pendingVerifications,
      revenueData
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'worker' }),
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments({}),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'pending' }),
      User.countDocuments({ isBlocked: true }),
      WorkerProfile.countDocuments({ verificationStatus: 'under_review' }),
      Booking.aggregate([
        { $match: { status: 'completed', 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.platformFee' } } }
      ])
    ]);

    // Monthly booking trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.platformFee' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top services
    const topServices = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$primaryService', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return res.json({
      success: true,
      data: {
        users: { total: totalUsers, workers: totalWorkers, customers: totalCustomers, blocked: blockedUsers },
        bookings: { total: totalBookings, completed: completedBookings, pending: pendingBookings },
        revenue: { total: revenueData[0]?.total || 0 },
        pendingVerifications,
        monthlyTrend,
        topServices
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: { users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Block/Unblock user
// @route PATCH /api/admin/users/:id/block
const toggleBlock = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isBlocked = !user.isBlocked;
    if (user.isBlocked) {
      user.blockedReason = reason;
      user.blockedAt = new Date();
    } else {
      user.blockedReason = undefined;
      user.blockedAt = undefined;
    }
    await user.save();

    return res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}.`, data: { isBlocked: user.isBlocked } });
  } catch (error) {
    next(error);
  }
};

// @desc Verify worker
// @route PATCH /api/admin/workers/:id/verify
const verifyWorker = async (req, res, next) => {
  try {
    const { status, badges } = req.body; // status: 'verified' | 'rejected'
    const profile = await WorkerProfile.findOne({ user: req.params.id });
    if (!profile) return res.status(404).json({ success: false, message: 'Worker profile not found.' });

    profile.verificationStatus = status;
    if (status === 'verified' && badges) {
      profile.verificationBadges = badges.map(b => ({ type: b, verified: true, verifiedAt: new Date() }));
      profile.isVerified = true;
    }
    await profile.save();

    return res.json({ success: true, message: `Worker ${status}.`, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Get all bookings
// @route GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('customer', 'name email phone')
        .populate('worker', 'name email phone')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: { bookings, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get workers pending verification
// @route GET /api/admin/verifications
const getPendingVerifications = async (req, res, next) => {
  try {
    const profiles = await WorkerProfile.find({ verificationStatus: 'under_review' })
      .populate('user', 'name email phone createdAt')
      .sort({ createdAt: 1 });

    return res.json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllUsers, toggleBlock, verifyWorker, getAllBookings, getPendingVerifications };
