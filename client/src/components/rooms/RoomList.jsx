import React from 'react';
import { MessageCircle, Users, Lock, Crown } from 'lucide-react';

const RoomList = ({ 
  rooms = [], 
  activeRoom, 
  onRoomSelect,
  onJoinRoom,
  currentUser 
}) => {
  const canJoinRoom = (room) => {
    if (!room.isPrivate) return true;
    return room.members.some(member => 
      member.user._id === currentUser._id
    );
  };

  return (
    <div className="space-y-2">
      {rooms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No rooms available</p>
          <p className="text-sm">Create a room to get started!</p>
        </div>
      ) : (
        rooms.map(room => (
          <div
            key={room._id}
            className={`
              flex items-center gap-3 p-3 rounded-lg cursor-pointer
              transition-all border ${
                activeRoom?._id === room._id
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }
            `}
            onClick={() => onRoomSelect(room)}
          >
            {/* Room Icon */}
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${room.isPrivate 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-600'
              }
            `}>
              {room.isPrivate ? (
                <Lock size={20} className="text-white" />
              ) : (
                <MessageCircle size={20} className="text-white" />
              )}
            </div>

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {room.name}
                </h3>
                {room.createdBy._id === currentUser._id && (
                  <Crown size={14} className="text-yellow-500" />
                )}
              </div>
              
              <p className="text-sm text-gray-500 truncate">
                {room.description || 'No description'}
              </p>
              
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  {room.members.length} members
                </div>
                <div className="text-xs text-gray-500">
                  {room.isPrivate ? 'Private' : 'Public'}
                </div>
              </div>
            </div>

            {/* Join Button for Public Rooms */}
            {!room.isPrivate && !canJoinRoom(room) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinRoom(room);
                }}
                className="
                  px-3 py-1 bg-blue-500 text-white text-sm rounded-lg
                  hover:bg-blue-600 transition-colors
                "
              >
                Join
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;