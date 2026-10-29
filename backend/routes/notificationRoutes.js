const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Notification } = require('../models/index');

router.get('/', protect, async (req, res, next) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(30);
    const unread = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    return res.json({ success: true, data: { notifications: notifs, unread } });
  } catch (e) { next(e); }
});

router.patch('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true, readAt: new Date() });
    return res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
