const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, default: () => `KC${Date.now().toString(36).toUpperCase()}`, unique: true },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile' },

  // Service Details
  services: [{
    name: String,
    duration: Number, // hours
    price: Number
  }],
  primaryService: {
    type: String,
    enum: ['cooking', 'cleaning', 'babysitting', 'eldercare', 'washing', 'ironing', 'gardening', 'other']
  },

  // Booking Type
  type: {
    type: String,
    enum: ['instant', 'scheduled', 'recurring', 'emergency'],
    required: true
  },
  urgency: { type: String, enum: ['normal', 'urgent', 'emergency'], default: 'normal' },

  // Schedule
  scheduledDate: Date,
  scheduledTime: String, // "09:00"
  endTime: String,
  duration: Number, // hours
  recurringPattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    days: [String],
    endDate: Date,
    occurrences: Number
  },

  // Location
  serviceLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    },
    landmark: String
  },

  // Status Flow
  status: {
    type: String,
    enum: [
      'pending',       // Customer booked, waiting for worker
      'accepted',      // Worker accepted
      'rejected',      // Worker rejected
      'confirmed',     // Payment confirmed
      'in_progress',   // Service started
      'completed',     // Service done
      'cancelled',     // Cancelled by either party
      'disputed',      // Dispute raised
      'expired'        // Auto-expired
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],

  // Payment
  pricing: {
    basePrice: Number,
    platformFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: Number,
    currency: { type: String, default: 'INR' }
  },
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    method: String,
    transactionId: String,
    paidAt: Date,
    razorpayOrderId: String,
    razorpayPaymentId: String
  },

  // Communication
  specialInstructions: String,
  cancellationReason: String,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Review
  customerReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  workerReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  isReviewed: { type: Boolean, default: false },

  // Timestamps
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) }, // 30 min

  // OTP for verification
  startOtp: String,
  endOtp: String,

  // AI Matching
  matchScore: { type: Number, default: 0 },

}, { timestamps: true });

bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'serviceLocation.coordinates': '2dsphere' }, { sparse: true });

module.exports = mongoose.model('Booking', bookingSchema);
