const express = require('express');
const router = express.Router();
const { getWorkers, getWorker, updateProfile, updateAvailability, uploadPhoto, uploadDocument, getFeatured } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfile, uploadDocument: uploadDoc } = require('../config/cloudinary');

router.get('/', getWorkers);
router.get('/featured', getFeatured);
router.get('/:id', getWorker);

router.put('/profile', protect, authorize('worker'), updateProfile);
router.patch('/availability', protect, authorize('worker'), updateAvailability);
router.post('/photo', protect, authorize('worker'), uploadProfile.single('photo'), uploadPhoto);
router.post('/document', protect, authorize('worker'), uploadDoc.single('document'), uploadDocument);

module.exports = router;
