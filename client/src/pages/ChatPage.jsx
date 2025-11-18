import React, { useState, useEffect } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useMessages } from '../hooks/useMessages';
import { usersAPI } from '../utils/api';
import Layout from '../components/layout/Layout';
import ChatContainer from '../components/chat/ChatContainer';
import OnlineUsers from '../components/chat/OnlineUsers';
import Button from '../components/ui/Button';
import './../styles/components.css';

const ChatPage = () => {
  const { user, logout, token } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsersSidebar, setShowUsersSidebar] = useState(true);
  const [loading, setLoading] = useState(true);

  const { socket, isConnected, onlineUsers, typingUsers } = useSocket(token, user);
  const { messages, sendMessage, loadMessages } = useMessages(token, socket, 'global');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getUsers(token);
        if (response.data.success) {
          setAllUsers(response.data.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleSendMessage = (content) => {
    if (selectedUser) {
      // Private message
      socket.emit('send-private-message', {
        receiverId: selectedUser._id,
        content
      });
    } else {
      // Global message
      sendMessage(content);
    }
  };

  const handleTypingStart = () => {
    socket.emit('typing-start', { room: 'global' });
  };

  const handleTypingStop = () => {
    socket.emit('typing-stop', { room: 'global' });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (window.innerWidth < 768) {
      setShowUsersSidebar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gray-50">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowUsersSidebar(!showUsersSidebar)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {selectedUser ? `Chat with ${selectedUser.username}` : 'Global Chat'}
                  </h1>
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
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </header>

          {/* Chat Container */}
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            typingUsers={typingUsers}
            currentUser={user}
          />
        </div>

        {/* Online Users Sidebar */}
        {showUsersSidebar && (
          <OnlineUsers
            onlineUsers={onlineUsers}
            allUsers={allUsers}
            onUserSelect={handleUserSelect}
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;