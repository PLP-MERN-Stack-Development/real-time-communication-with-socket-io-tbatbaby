import React from 'react';
import { Users, MoreVertical, Phone, Video, Info } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';

const ChatHeader = ({ 
  currentChat, 
  onlineUsers, 
  isConnected,
  onUserSelect 
}) => {
  const isGroupChat = currentChat?.type === 'group';
  const isPrivateChat = currentChat?.type === 'private';

  const dropdownItems = [
    {
      label: 'View Profile',
      onClick: () => console.log('View profile'),
      icon: <Info size={16} />
    },
    {
      label: 'Voice Call',
      onClick: () => console.log('Voice call'),
      icon: <Phone size={16} />
    },
    {
      label: 'Video Call',
      onClick: () => console.log('Video call'),
      icon: <Video size={16} />
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isPrivateChat && currentChat.user && (
            <>
              <Avatar 
                user={currentChat.user} 
                size="md" 
                showStatus={true}
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentChat.user.username}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentChat.user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                  {currentChat.user.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </>
          )}

          {isGroupChat && currentChat.room && (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentChat.room.name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Users size={16} />
                  {onlineUsers.length} members online
                </p>
              </div>
            </>
          )}

          {!currentChat && (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Global Chat
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {isConnected 
                    ? `${onlineUsers.length} users online` 
                    : 'Connecting...'
                  }
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(isPrivateChat || isGroupChat) && (
            <>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Video size={20} />
              </button>
            </>
          )}
          
          <Dropdown items={dropdownItems} position="right">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;