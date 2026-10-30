const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorker,
  getMyProfile,
  updateProfile,
  updateAvailability,
  uploadPhoto,
  uploadDocument,
  deleteDocument,
  getFeatured
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProfile, uploadDocument: uploadDoc } = require('../config/cloudinary');

router.get('/', getWorkers);
router.get('/featured', getFeatured);
router.get('/my/profile', protect, authorize('worker'), getMyProfile);
router.get('/:id', getWorker);

router.put('/profile', protect, authorize('worker'), updateProfile);
router.patch('/availability', protect, authorize('worker'), updateAvailability);
router.post('/photo', protect, authorize('worker'), uploadProfile.single('photo'), uploadPhoto);
router.post('/document', protect, authorize('worker'), uploadDoc.single('document'), uploadDocument);
router.delete('/document/:type', protect, authorize('worker'), deleteDocument);

module.exports = router;
