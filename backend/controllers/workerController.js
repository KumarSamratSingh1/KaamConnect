const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const { Review } = require('../models/index');

// @desc Get all workers with filters
// @route GET /api/workers
const getWorkers = async (req, res, next) => {
  try {
    const {
      skills, minRating, maxSalary, minSalary, experience,
      workType, verifiedOnly, availableOnly,
      lat, lng, radius = 20,
      sortBy = 'rating', order = 'desc',
      page = 1, limit = 12,
      search, language, city
    } = req.query;

    // Build worker profile query
    let profileQuery = {};
    if (skills) profileQuery.skills = { $in: skills.split(',') };
    if (minRating) profileQuery['rating.average'] = { $gte: parseFloat(minRating) };
    if (minSalary) profileQuery['expectedSalary.min'] = { $gte: parseInt(minSalary) };
    if (maxSalary) profileQuery['expectedSalary.max'] = { $lte: parseInt(maxSalary) };
    if (experience) profileQuery.experience = { $gte: parseInt(experience) };
    if (workType) profileQuery.workType = workType;
    if (verifiedOnly === 'true') profileQuery.verificationStatus = 'verified';
    if (availableOnly === 'true') profileQuery.availabilityStatus = 'available';
    if (language) profileQuery.languagesKnown = { $in: language.split(',') };

    // Get matching worker profile user IDs
    const workerProfiles = await WorkerProfile.find(profileQuery)
      .populate({
        path: 'user',
        select: '-password -refreshToken',
        match: {
          isActive: true,
          isBlocked: false,
          ...(city && { 'location.city': { $regex: city, $options: 'i' } }),
          ...(search && { name: { $regex: search, $options: 'i' } })
        }
      })
      .sort({ 'rating.average': -1, profileScore: -1 })
      .lean();

    // Filter out null users (didn't match location/name filter)
    const filtered = workerProfiles.filter(p => p.user !== null);

    // Pagination
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + parseInt(limit));

    return res.json({
      success: true,
      data: {
        workers: paginated,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single worker profile
// @route GET /api/workers/:id
const getWorker = async (req, res, next) => {
  try {
    let worker = await User.findOne({
      _id: req.params.id,
      role: 'worker',
      isActive: true
    }).select('-password -refreshToken');

    let profile = null;
    if (!worker) {
      profile = await WorkerProfile.findById(req.params.id);
      if (profile) {
        worker = await User.findOne({ _id: profile.user, role: 'worker', isActive: true }).select('-password -refreshToken');
      }
    } else {
      profile = await WorkerProfile.findOne({ user: worker._id });
    }

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found.' });
    }
    const reviews = await Review.find({ reviewee: worker._id, isApproved: true })
      .populate('reviewer', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      data: { worker, profile, reviews }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current worker profile
// @route GET /api/workers/my/profile
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await WorkerProfile.create({ user: req.user._id });
    }
    return res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Update worker profile
// @route PUT /api/workers/profile
const updateProfile = async (req, res, next) => {
  try {
    const {
      skills, experience, experienceDescription,
      workType, shifts, expectedSalary, serviceRadius,
      languagesKnown, workDays, startTime, endTime,
      preferredAreas, services, references
    } = req.body;

    let profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await WorkerProfile.create({ user: req.user._id });
    }

    if (skills) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (experienceDescription) profile.experienceDescription = experienceDescription;
    if (workType) profile.workType = workType;
    if (shifts) profile.shifts = shifts;
    if (expectedSalary) profile.expectedSalary = expectedSalary;
    if (serviceRadius) profile.serviceRadius = serviceRadius;
    if (languagesKnown) profile.languagesKnown = languagesKnown;
    if (workDays) profile.workDays = workDays;
    if (startTime) profile.startTime = startTime;
    if (endTime) profile.endTime = endTime;
    if (preferredAreas) profile.preferredAreas = preferredAreas;
    if (services) profile.services = services;
    if (references) profile.references = references;

    if (typeof profile.calculateCompletion === 'function') {
      profile.calculateCompletion();
    }
    await profile.save();

    return res.json({ success: true, message: 'Profile updated!', data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc Update availability status
// @route PATCH /api/workers/availability
const updateAvailability = async (req, res, next) => {
  try {
    const { status } = req.body;
    const profile = await WorkerProfile.findOneAndUpdate(
      { user: req.user._id },
      { availabilityStatus: status },
      { new: true }
    );

    // Emit socket event
    const { getIO } = require('../socket/socketHandler');
    const io = getIO();
    if (io) io.emit('worker_availability_update', { workerId: req.user._id, status });

    return res.json({ success: true, data: { status: profile.availabilityStatus } });
  } catch (error) {
    next(error);
  }
};

// @desc Upload profile photo
// @route POST /api/workers/photo
const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded.' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      profilePhoto: {
        url: req.file.path,
        publicId: req.file.filename
      }
    });

    return res.json({ success: true, data: { url: req.file.path } });
  } catch (error) {
    next(error);
  }
};

// @desc Upload verification document (PDF, Word, Images)
// @route POST /api/workers/document
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No document file received.' });
    }

    let profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await WorkerProfile.create({ user: req.user._id });
    }

    const docType = req.body.docType || 'aadhaar';
    const originalName = req.file.originalname || 'Document';
    const fileUrl = req.file.path || req.file.secure_url || req.file.url;
    const publicId = req.file.filename || req.file.public_id || ('doc_' + Date.now());

    if (!profile.documents) {
      profile.documents = [];
    }

    const docData = {
      type: docType,
      url: fileUrl,
      publicId: publicId,
      name: originalName,
      uploadedAt: new Date()
    };

    const existingIndex = profile.documents.findIndex(d => d.type === docType);
    if (existingIndex > -1) {
      profile.documents[existingIndex] = docData;
    } else {
      profile.documents.push(docData);
    }

    profile.verificationStatus = 'under_review';
    if (typeof profile.calculateCompletion === 'function') {
      profile.calculateCompletion();
    }
    await profile.save();

    return res.json({
      success: true,
      message: `${originalName} uploaded successfully and submitted for review!`,
      data: {
        document: docData,
        documents: profile.documents,
        profileCompletion: profile.profileCompletion
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete verification document
// @route DELETE /api/workers/document/:type
const deleteDocument = async (req, res, next) => {
  try {
    const profile = await WorkerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Worker profile not found.' });
    }

    const { type } = req.params;
    profile.documents = (profile.documents || []).filter(d => d.type !== type);
    if (typeof profile.calculateCompletion === 'function') {
      profile.calculateCompletion();
    }
    await profile.save();

    return res.json({
      success: true,
      message: 'Document removed.',
      data: { documents: profile.documents }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get featured workers (homepage)
// @route GET /api/workers/featured
const getFeatured = async (req, res, next) => {
  try {
    const profiles = await WorkerProfile.find({
      verificationStatus: 'verified',
      availabilityStatus: 'available',
      'rating.average': { $gte: 4 }
    })
    .populate('user', 'name profilePhoto location')
    .sort({ 'rating.average': -1, totalBookings: -1 })
    .limit(8)
    .lean();

    return res.json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkers,
  getWorker,
  getMyProfile,
  updateProfile,
  updateAvailability,
  uploadPhoto,
  uploadDocument,
  deleteDocument,
  getFeatured
};
