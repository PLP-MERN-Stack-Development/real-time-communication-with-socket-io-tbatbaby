import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (token, user) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!token || !user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketUrl, {
      auth: {
        token,
        userId: user._id,
        username: user.username
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user-online', (userData) => {
      setOnlineUsers(prev => {
        const exists = prev.find(u => u.userId === userData.userId);
        if (!exists) {
          return [...prev, userData];
        }
        return prev;
      });
    });

    newSocket.on('user-offline', (userData) => {
      setOnlineUsers(prev => prev.filter(u => u.userId !== userData.userId));
    });

    newSocket.on('user-typing', (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u.userId !== data.userId), data];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, user]);

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers
  };
};