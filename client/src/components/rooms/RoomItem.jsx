import React from 'react';
import { Users, Crown, MoreVertical } from 'lucide-react';
import Dropdown from '../ui/Dropdown';

const RoomItem = ({ 
  room, 
  isActive, 
  currentUser,
  onSelect,
  onLeave,
  onDelete 
}) => {
  const isOwner = room.createdBy._id === currentUser._id;
  const isMember = room.members.some(member => 
    member.user._id === currentUser._id
  );

  const dropdownItems = [
    ...(isMember ? [{
      label: 'Leave Room',
      onClick: () => onLeave(room),
      className: 'text-red-600 hover:text-red-700'
    }] : []),
    ...(isOwner ? [{
      label: 'Delete Room',
      onClick: () => onDelete(room),
      className: 'text-red-600 hover:text-red-700'
    }] : [])
  ];

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer
        transition-all border ${
          isActive
            ? 'bg-blue-50 border-blue-200 shadow-sm'
            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(room)}
    >
      {/* Room Icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Users size={18} className="text-white" />
      </div>

      {/* Room Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {room.name}
          </h3>
          {isOwner && (
            <Crown size={14} className="text-yellow-500" />
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            {room.members.length}
          </div>
          <div className="text-xs text-gray-500">
            {room.isPrivate ? 'Private' : 'Public'}
          </div>
        </div>
      </div>

      {/* Actions */}
      {dropdownItems.length > 0 && (
        <Dropdown items={dropdownItems} position="left">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <MoreVertical size={16} />
          </button>
        </Dropdown>
      )}
    </div>
  );
};

export default RoomItem;