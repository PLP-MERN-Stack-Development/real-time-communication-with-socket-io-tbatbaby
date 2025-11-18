// Application Constants

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

export const ROOM_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct'
};

export const SOCKET_EVENTS = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Message events
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
  MESSAGE_DELIVERED: 'message-delivered',
  MESSAGE_READ: 'message-read',
  MESSAGE_ERROR: 'message-error',
  
  // Private message events
  SEND_PRIVATE_MESSAGE: 'send-private-message',
  NEW_PRIVATE_MESSAGE: 'new-private-message',
  
  // User events
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
  ONLINE_USERS: 'online-users',
  
  // Typing events
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  USER_TYPING: 'user-typing',
  
  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_CREATED: 'room-created',
  ROOM_UPDATED: 'room-updated',
  ROOM_DELETED: 'room-deleted',
  
  // Call events
  CALL_INITIATE: 'call-initiate',
  CALL_ACCEPT: 'call-accept',
  CALL_REJECT: 'call-reject',
  CALL_END: 'call-end'
};

export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_REQUIRED: 'Authentication required',
  INVALID_TOKEN: 'Invalid token',
  EXPIRED_TOKEN: 'Token expired',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  
  // Message errors
  MESSAGE_NOT_FOUND: 'Message not found',
  MESSAGE_EMPTY: 'Message content cannot be empty',
  MESSAGE_TOO_LONG: 'Message too long',
  
  // Room errors
  ROOM_NOT_FOUND: 'Room not found',
  ROOM_EXISTS: 'Room already exists',
  NOT_ROOM_MEMBER: 'Not a member of this room',
  ROOM_FULL: 'Room is full',
  
  // Permission errors
  PERMISSION_DENIED: 'Permission denied',
  NOT_AUTHORIZED: 'Not authorized',
  
  // Validation errors
  VALIDATION_ERROR: 'Validation failed',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password does not meet requirements',
  
  // Server errors
  INTERNAL_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  FILE_UPLOAD_ERROR: 'File upload failed'
};

export const SUCCESS_MESSAGES = {
  // User messages
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'Login successful',
  USER_LOGGED_OUT: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  
  // Message messages
  MESSAGE_SENT: 'Message sent successfully',
  MESSAGE_DELETED: 'Message deleted successfully',
  
  // Room messages
  ROOM_CREATED: 'Room created successfully',
  ROOM_UPDATED: 'Room updated successfully',
  ROOM_DELETED: 'Room deleted successfully',
  JOINED_ROOM: 'Joined room successfully',
  LEFT_ROOM: 'Left room successfully'
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  MESSAGE: {
    MAX_LENGTH: 1000
  },
  ROOM: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 200,
    MEMBERS_MAX: 100
  }
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100
};

// Environment-based configuration
export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test'
};