import React from 'react';
import { MessageCircle, Phone, Video } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatLastSeen } from '../../utils/helpers';

const UserItem = ({ 
  user, 
  isOnline, 
  unreadCount = 0,
  lastMessage,
  onClick,
  onCall,
  onVideoCall 
}) => {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3 p-3 border-b border-gray-100 
        hover:bg-gray-50 cursor-pointer transition-colors
        group relative
      "
    >
      {/* Avatar with Online Status */}
      <Avatar user={user} size="md" showStatus={true} />

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900 truncate">
            {user.username}
          </span>
          {lastMessage && (
            <span className="text-xs text-gray-500">
              {formatLastSeen(lastMessage.createdAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">
            {lastMessage?.content || 'Start a conversation...'}
          </p>
          
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCall?.(user);
          }}
          className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
        >
          <Phone size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVideoCall?.(user);
          }}
          className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors"
        >
          <Video size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(user);
          }}
          className="p-1 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded transition-colors"
        >
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserItem;