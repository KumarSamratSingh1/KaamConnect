const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['customer', 'worker', 'admin'], required: true },

  // Profile
  profilePhoto: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  gender: { type: String, enum: ['male', 'female', 'other', ''] },
  dateOfBirth: { type: Date },
  bio: { type: String, maxlength: 500 },

  // Location
  location: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    }
  },

  // Auth
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  refreshToken: String,

  // Status
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  blockedReason: String,
  blockedAt: Date,
  lastLogin: Date,
  lastSeen: Date,

  // Preferences
  preferredLanguages: [{ type: String }],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },

  // FCM Token for push notifications
  fcmToken: String,

  // Reports
  reportCount: { type: Number, default: 0 },
  reports: [{
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],

}, { timestamps: true });

// Geo index
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ email: 1, role: 1 });
userSchema.index({ phone: 1 });

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
