import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generate a JWT token
 * @param {string} userId - User ID
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (userId, secret, expiresIn = '30d') => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sanitize user object by removing sensitive fields
 * @param {object} user - User object
 * @returns {object} Sanitized user object
 */
export const sanitizeUser = (user) => {
  if (!user) return null;
  
  const userObj = user.toObject ? user.toObject() : { ...user };
  
  // Remove sensitive fields
  delete userObj.password;
  delete userObj.__v;
  
  return userObj;
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {array} errors - Additional error details
 * @returns {object} Formatted error response
 */
export const formatErrorResponse = (message, statusCode = 500, errors = []) => {
  return {
    success: false,
    message,
    statusCode,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format success response
 * @param {string} message - Success message
 * @param {any} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {object} Formatted success response
 */
export const formatSuccessResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Paginate results
 * @param {array} results - Array of results
 * @param {number} page - Current page
 * @param {number} limit - Results per page
 * @param {number} total - Total number of results
 * @returns {object} Pagination info
 */
export const paginateResults = (results, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    results,
    pagination: {
      current: page,
      total: totalPages,
      hasNext,
      hasPrev,
      totalResults: total
    }
  };
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate avatar URL from username
 * @param {string} username - Username
 * @param {number} size - Avatar size
 * @returns {string} Avatar URL
 */
export const generateAvatarUrl = (username, size = 100) => {
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'
  ];
  
  const color = colors[username.length % colors.length];
  const initials = username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=${size}`;
};

/**
 * Calculate time ago
 * @param {Date} date - Date to calculate from
 * @returns {string} Time ago string
 */
export const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'just now';
};

/**
 * Check if user is online (based on last activity)
 * @param {Date} lastActivity - Last activity timestamp
 * @param {number} threshold - Online threshold in minutes
 * @returns {boolean} True if user is considered online
 */
export const isUserOnline = (lastActivity, threshold = 5) => {
  if (!lastActivity) return false;
  
  const now = new Date();
  const lastActive = new Date(lastActivity);
  const diffInMinutes = (now - lastActive) / (1000 * 60);
  
  return diffInMinutes <= threshold;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;

  return {
    isValid,
    issues: !isValid ? [
      password.length < minLength && `Must be at least ${minLength} characters`,
      !hasUpperCase && 'Must contain uppercase letters',
      !hasLowerCase && 'Must contain lowercase letters',
      !hasNumbers && 'Must contain numbers'
    ].filter(Boolean) : []
  };
};

/**
 * Generate room ID from user IDs for private chats
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} Room ID
 */
export const generatePrivateRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `private_${sortedIds[0]}_${sortedIds[1]}`;
};

/**
 * Extract user IDs from private room ID
 * @param {string} roomId - Private room ID
 * @returns {string[]} Array of user IDs
 */
export const extractUserIdsFromPrivateRoom = (roomId) => {
  const match = roomId.match(/^private_([^_]+)_([^_]+)$/);
  return match ? [match[1], match[2]] : null;
};