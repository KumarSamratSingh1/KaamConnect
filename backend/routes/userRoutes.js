const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const { uploadProfile } = require('../config/cloudinary');

router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.json({ success: true, data: user.toPublicJSON() });
  } catch (e) { next(e); }
});

router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, bio, gender, dateOfBirth, location, preferredLanguages } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, bio, gender, dateOfBirth, location, preferredLanguages }, { new: true, runValidators: true });
    return res.json({ success: true, data: user.toPublicJSON() });
  } catch (e) { next(e); }
});

router.post('/photo', protect, uploadProfile.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
    await User.findByIdAndUpdate(req.user._id, { profilePhoto: { url: req.file.path, publicId: req.file.filename } });
    return res.json({ success: true, data: { url: req.file.path } });
  } catch (e) { next(e); }
});

router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ success: false, message: 'Wrong password.' });
    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: 'Password changed!' });
  } catch (e) { next(e); }
});

module.exports = router;
