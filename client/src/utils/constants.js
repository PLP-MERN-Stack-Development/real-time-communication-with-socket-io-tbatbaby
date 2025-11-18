export const APP_CONFIG = {
APP_NAME: 'RealTime Chat',
VERSION: '1.0.0',
MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
MESSAGE_LIMIT: 50,
TYPING_DEBOUNCE: 1000,
RECONNECTION_ATTEMPTS: 5,
RECONNECTION_DELAY: 3000
};

export const SOCKET_EVENTS = {
// Connection
CONNECT: 'connect',
DISCONNECT: 'disconnect',

// Messages
SEND_MESSAGE: 'send-message',
NEW_MESSAGE: 'new-message',
MESSAGE_ERROR: 'message-error',

  // Private Messages
SEND_PRIVATE_MESSAGE: 'send-private-message',
NEW_PRIVATE_MESSAGE: 'new-private-message',

  // Users
USER_ONLINE: 'user-online',
USER_OFFLINE: 'user-offline',
ONLINE_USERS: 'online-users',

  // Typing
TYPING_START: 'typing-start',
TYPING_STOP: 'typing-stop',
USER_TYPING: 'user-typing',

  // Rooms
JOIN_ROOM: 'join-room',
LEAVE_ROOM: 'leave-room',
ROOM_MESSAGE: 'room-message'
};

export const MESSAGE_TYPES = {
TEXT: 'text',
IMAGE: 'image',
FILE: 'file',
SYSTEM: 'system'
};