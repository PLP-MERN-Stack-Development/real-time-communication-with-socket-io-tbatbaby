import React from 'react';
import { generateAvatar } from '../../utils/helpers';

const Avatar = ({ 
  user, 
  size = 'md',
  showStatus = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5'
  };

  const avatarUrl = user?.avatar || generateAvatar(user?.username || 'U');

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      <img
        src={avatarUrl}
        alt={user?.username}
        className="rounded-full object-cover w-full h-full border-2 border-white"
      />
      {showStatus && user && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-white
            ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}
            ${statusSize[size]}
          `.trim()}
        />
      )}
    </div>
  );
};

export default Avatar;