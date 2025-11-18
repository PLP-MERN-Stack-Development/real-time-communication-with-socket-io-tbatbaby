import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Search,
  ChevronDown 
} from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Sidebar = ({ 
  rooms = [],
  users = [],
  activeRoom,
  onRoomSelect,
  onUserSelect,
  onCreateRoom,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    rooms: true,
    users: true
  });

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
          <Button
            variant="ghost"
            size="small"
            onClick={onCreateRoom}
            className="text-gray-500 hover:text-gray-700"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Search */}
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={16} />}
          className="pl-9"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Rooms Section */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('rooms')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Rooms</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${
                expandedSections.rooms ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {expandedSections.rooms && (
            <div className="pb-2">
              {filteredRooms.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No rooms found
                </div>
              ) : (
                filteredRooms.map(room => (
                  <div
                    key={room._id}
                    onClick={() => onRoomSelect(room)}
                    className={`
                      flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer
                      transition-colors ${
                        activeRoom?._id === room._id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{room.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {room.members?.length || 0} members
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Users Section */}
        <div>
          <button
            onClick={() => toggleSection('users')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">Users</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform ${
                expandedSections.users ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {expandedSections.users && (
            <div className="pb-2">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                  No users found
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => onUserSelect(user)}
                    className={`
                      flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer
                      transition-colors ${
                        activeRoom?.userId === user._id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.username}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;