import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get messages with pagination
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const room = req.query.room || 'global';
    const skip = (page - 1) * limit;

    // Build query based on room type
    let query = {};
    if (room === 'global') {
      query.room = 'global';
    } else if (room.startsWith('user_')) {
      // For private messages between two users
      const otherUserId = room.replace('user_', '');
      query.$or = [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ];
    } else {
      // For group rooms
      query.room = room;
    }

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Reverse to get chronological order
    const sortedMessages = messages.reverse();

    const totalMessages = await Message.countDocuments(query);
    const hasMore = totalMessages > skip + messages.length;

    res.json({
      success: true,
      data: {
        messages: sortedMessages,
        hasMore,
        total: totalMessages,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { content, room, receiverId, messageType = 'text' } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 1000 characters'
      });
    }

    const messageData = {
      sender: req.user._id,
      content: content.trim(),
      messageType
    };

    // Determine if it's a private message or room message
    if (receiverId) {
      // Private message
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({
          success: false,
          message: 'Receiver not found'
        });
      }
      messageData.receiver = receiverId;
    } else if (room) {
      // Room message
      messageData.room = room;
    } else {
      // Default to global
      messageData.room = 'global';
    }

    const message = await Message.create(messageData);
    
    // Populate sender info for response
    await message.populate('sender', 'username avatar');
    if (message.receiver) {
      await message.populate('receiver', 'username avatar');
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};

// @desc    React to a message
// @route   POST /api/messages/:id/react
// @access  Private
export const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      reaction => reaction.user.toString() !== req.user._id.toString()
    );

    // Add new reaction if emoji is provided
    if (emoji) {
      message.reactions.push({
        user: req.user._id,
        emoji
      });
    }

    await message.save();
    await message.populate('reactions.user', 'username avatar');

    res.json({
      success: true,
      message: 'Reaction updated successfully',
      data: { message }
    });
  } catch (error) {
    console.error('React to message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reaction'
    });
  }
};