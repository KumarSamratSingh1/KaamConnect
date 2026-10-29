const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Conversation, Message } = require('../models/index');

// Get or create conversation
router.post('/conversation', protect, async (req, res, next) => {
  try {
    const { participantId, bookingId } = req.body;
    let conv = await Conversation.findOne({ participants: { $all: [req.user._id, participantId] } });
    if (!conv) {
      conv = await Conversation.create({
        participants: [req.user._id, participantId],
        booking: bookingId
      });
    }
    await conv.populate('participants', 'name profilePhoto role lastSeen');
    return res.json({ success: true, data: conv });
  } catch (error) { next(error); }
});

// Get my conversations
router.get('/conversations', protect, async (req, res, next) => {
  try {
    const convs = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name profilePhoto role lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });
    return res.json({ success: true, data: convs });
  } catch (error) { next(error); }
});

// Get messages
router.get('/messages/:conversationId', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const [messages, total] = await Promise.all([
      Message.find({ conversation: req.params.conversationId, isDeleted: false })
        .populate('sender', 'name profilePhoto')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(parseInt(limit)),
      Message.countDocuments({ conversation: req.params.conversationId })
    ]);
    // Mark as read
    await Message.updateMany({ conversation: req.params.conversationId, sender: { $ne: req.user._id }, isRead: false }, { isRead: true, readAt: new Date() });
    return res.json({ success: true, data: { messages: messages.reverse(), pagination: { total } } });
  } catch (error) { next(error); }
});

// Send message
router.post('/message', protect, async (req, res, next) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;
    const message = await Message.create({ conversation: conversationId, sender: req.user._id, content, type });
    await message.populate('sender', 'name profilePhoto');
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, lastMessageAt: new Date() });

    const { getIO } = require('../socket/socketHandler');
    const io = getIO();
    if (io) io.to(`conv_${conversationId}`).emit('new_message', message);

    return res.status(201).json({ success: true, data: message });
  } catch (error) { next(error); }
});

module.exports = router;
