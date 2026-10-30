// adminRoutes.js
const express = require('express');
const adminRouter = express.Router();
const { getDashboardStats, getAllUsers, toggleBlock, verifyWorker, getAllBookings, getPendingVerifications } = require('../controllers/adminController');
const { viewDocument } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

adminRouter.use(protect, authorize('admin'));
adminRouter.get('/stats', getDashboardStats);
adminRouter.get('/users', getAllUsers);
adminRouter.patch('/users/:id/block', toggleBlock);
adminRouter.patch('/workers/:id/verify', verifyWorker);
adminRouter.get('/bookings', getAllBookings);
adminRouter.get('/verifications', getPendingVerifications);
adminRouter.get('/workers/:userId/documents/:docId/view', viewDocument);

module.exports = adminRouter;
