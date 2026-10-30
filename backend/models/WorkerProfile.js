const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Professional Info
  skills: [{
    type: String,
    enum: ['cooking', 'cleaning', 'babysitting', 'eldercare', 'washing', 'ironing', 'gardening', 'driving', 'petcare', 'tutoring', 'nursing']
  }],
  experience: { type: Number, default: 0, min: 0, max: 50 }, // years
  experienceDescription: { type: String, maxlength: 1000 },

  // Work Preferences
  workType: { type: String, enum: ['full-time', 'part-time', 'hourly', 'live-in', 'both'] },
  shifts: [{ type: String, enum: ['morning', 'afternoon', 'evening', 'night', 'flexible'] }],
  workDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
  startTime: String, // "07:00"
  endTime: String,   // "15:00"

  // Salary
  expectedSalary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
    per: { type: String, enum: ['hour', 'day', 'month'], default: 'month' }
  },

  // Service Area
  serviceRadius: { type: Number, default: 10, min: 1, max: 50 }, // km
  preferredAreas: [String],

  // Languages
  languagesKnown: [String],

  // Verification
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationBadges: [{
    type: { type: String, enum: ['aadhaar', 'background_check', 'police_verify', 'address_proof'] },
    verified: { type: Boolean, default: false },
    verifiedAt: Date
  }],
  documents: [{
    type: { type: String },
    url: String,
    publicId: String,
    name: String,
    isRaw: Boolean,
    uploadedAt: { type: Date, default: Date.now }
  }],
  aadhaarNumber: { type: String, select: false },

  // AI-computed fields
  profileScore: { type: Number, default: 0, min: 0, max: 100 },
  aiTags: [String], // AI-generated tags for matching
  fraudRiskScore: { type: Number, default: 0, min: 0, max: 1 },

  // Ratings & Stats
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    breakdown: {
      cleanliness: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      behaviour: { type: Number, default: 0 },
      skills: { type: Number, default: 0 }
    }
  },
  totalBookings: { type: Number, default: 0 },
  completedBookings: { type: Number, default: 0 },
  cancelledBookings: { type: Number, default: 0 },
  responseRate: { type: Number, default: 100 },
  responseTime: { type: Number, default: 30 }, // minutes

  // Current Status
  availabilityStatus: {
    type: String,
    enum: ['available', 'busy', 'offline', 'on_leave'],
    default: 'available'
  },
  currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

  // Portfolio
  workPhotos: [{
    url: String,
    publicId: String,
    caption: String
  }],

  // Pricing
  services: [{
    name: String,
    price: Number,
    unit: String,
    description: String
  }],

  // Previous Employers (references)
  references: [{
    name: String,
    phone: String,
    relation: String
  }],

  // AI recommendation data
  lastMatchedAt: Date,
  matchScore: { type: Number, default: 0 },

  // Featured / Promoted
  isFeatured: { type: Boolean, default: false },
  featuredUntil: Date,

  // Profile completion
  profileCompletion: { type: Number, default: 0 },

}, { timestamps: true });

workerProfileSchema.index({ skills: 1 });
workerProfileSchema.index({ 'rating.average': -1 });
workerProfileSchema.index({ verificationStatus: 1 });
workerProfileSchema.index({ availabilityStatus: 1 });
workerProfileSchema.index({ profileScore: -1 });

// Calculate profile completion
workerProfileSchema.methods.calculateCompletion = function () {
  let score = 0;
  if (this.skills.length > 0) score += 20;
  if (this.experience > 0) score += 10;
  if (this.workType) score += 10;
  if (this.expectedSalary.min) score += 10;
  if (this.languagesKnown.length > 0) score += 10;
  if (this.documents.length > 0) score += 20;
  if (this.workPhotos.length > 0) score += 10;
  if (this.references.length > 0) score += 10;
  this.profileCompletion = score;
  return score;
};

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
