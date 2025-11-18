import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateAvatar = (name, color = '#3b82f6') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = 100;
  canvas.height = 100;
  
  // Background
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Text
  context.fillStyle = '#FFFFFF';
  context.font = 'bold 40px Inter';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  context.fillText(initials, canvas.width / 2, canvas.height / 2);
  
  return canvas.toDataURL();
};

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

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('text')) return '📝';
  return '📎';
};