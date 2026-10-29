const mongoose = require('mongoose');

// ==================== REVIEW ====================
const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerRole: { type: String, enum: ['customer', 'worker'], required: true },

  rating: { type: Number, required: true, min: 1, max: 5 },
  breakdown: {
    cleanliness: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    behaviour: { type: Number, min: 1, max: 5 },
    skills: { type: Number, min: 1, max: 5 }
  },
  comment: { type: String, maxlength: 1000 },
  photos: [String],

  // AI Sentiment Analysis
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  sentimentScore: Number,
  aiSummary: String,

  // Moderation
  isApproved: { type: Boolean, default: true },
  isFlagged: { type: Boolean, default: false },
  flagReason: String,

  // Helpful votes
  helpfulVotes: { type: Number, default: 0 },
  notHelpfulVotes: { type: Number, default: 0 },

  ownerResponse: String,
  ownerResponseAt: Date,
}, { timestamps: true });

reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ booking: 1 });

// ==================== CHAT ====================
const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, maxlength: 2000 },
  type: { type: String, enum: ['text', 'image', 'file', 'system', 'location'], default: 'text' },
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isDeleted: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: Date,
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ booking: 1 });

// ==================== NOTIFICATION ====================
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: [
      'booking_request', 'booking_accepted', 'booking_rejected', 'booking_completed',
      'booking_cancelled', 'payment_success', 'payment_failed', 'new_message',
      'review_received', 'verification_update', 'system', 'promotion', 'alert'
    ]
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  actionUrl: String,
  icon: String,
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Message: mongoose.model('Message', messageSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
  Notification: mongoose.model('Notification', notificationSchema),
};
