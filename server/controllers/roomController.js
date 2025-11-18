import Room from '../models/Room.js';
import Message from '../models/Message.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { isPrivate: false },
        { 'members.user': req.user._id }
      ]
    })
    .populate('createdBy', 'username avatar')
    .populate('members.user', 'username avatar')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms'
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('members.user', 'username avatar');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user has access to private room
    if (room.isPrivate && !room.members.some(member => 
      member.user._id.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this room'
      });
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching room'
    });
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
export const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate = false } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Room name is required'
      });
    }

    // Check if room name already exists
    const existingRoom = await Room.findOne({ name: name.trim() });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room name already exists'
      });
    }

    const room = await Room.create({
      name: name.trim(),
      description: description?.trim(),
      isPrivate,
      createdBy: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    await room.populate('createdBy', 'username avatar');
    await room.populate('members.user', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating room'
    });
  }
};

// @desc    Join a room
// @route   POST /api/rooms/:id/join
// @access  Private
export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room is private
    if (room.isPrivate) {
      return res.status(403).json({
        success: false,
        message: 'Cannot join private room'
      });
    }

    // Check if user is already a member
    const isMember = room.members.some(member => 
      member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this room'
      });
    }

    // Check room capacity
    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }

    room.members.push({
      user: req.user._id,
      role: 'member'
    });

    await room.save();
    await room.populate('members.user', 'username avatar');

    res.json({
      success: true,
      message: 'Joined room successfully',
      data: { room }
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining room'
    });
  }
};

// @desc    Leave a room
// @route   POST /api/rooms/:id/leave
// @access  Private
export const leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is a member
    const memberIndex = room.members.findIndex(member => 
      member.user.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Not a member of this room'
      });
    }

    // Remove user from members
    room.members.splice(memberIndex, 1);

    // If room becomes empty, delete it
    if (room.members.length === 0) {
      await Room.findByIdAndDelete(req.params.id);
      
      // Also delete all messages in this room
      await Message.deleteMany({ room: room.name });
      
      return res.json({
        success: true,
        message: 'Left room successfully - Room deleted as it became empty'
      });
    }

    // If creator leaves, assign new admin
    if (room.createdBy.toString() === req.user._id.toString()) {
      room.createdBy = room.members[0].user;
      room.members[0].role = 'admin';
    }

    await room.save();

    res.json({
      success: true,
      message: 'Left room successfully',
      data: { room }
    });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving room'
    });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the creator or admin
    if (room.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    await Room.findByIdAndDelete(req.params.id);
    
    // Delete all messages in this room
    await Message.deleteMany({ room: room.name });

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting room'
    });
  }
};