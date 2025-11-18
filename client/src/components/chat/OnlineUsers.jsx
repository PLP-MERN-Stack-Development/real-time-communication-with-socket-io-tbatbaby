import React from 'react';
import { Users } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatLastSeen } from '../../utils/helpers';

const OnlineUsers = ({ onlineUsers, allUsers, onUserSelect }) => {
  const onlineUserIds = new Set(onlineUsers.map(user => user.userId));
  
  const usersWithStatus = allUsers.map(user => ({
    ...user,
    isOnline: onlineUserIds.has(user._id)
  })).sort((a, b) => {
    // Online users first, then by username
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Users</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {onlineUsers.length} online
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {usersWithStatus.map(user => (
          <div
            key={user._id}
            onClick={() => onUserSelect(user)}
            className="
              flex items-center gap-3 p-3 border-b border-gray-100 
              hover:bg-gray-50 cursor-pointer transition-colors
            "
          >
            <Avatar user={user} size="md" showStatus={true} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 truncate">
                  {user.username}
                </span>
                {user.isOnline && (
                  <span className="online-dot"></span>
                )}
              </div>
              
              <p className="text-sm text-gray-500 truncate">
                {user.isOnline 
                  ? 'Online now' 
                  : `Last seen ${formatLastSeen(user.lastSeen)}`
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;