import { useState, useEffect, useCallback } from 'react';
import { messagesAPI } from '../utils/api';
import { SOCKET_EVENTS } from '../utils/constants';

export const useMessages = (token, socket, room = 'global') => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load initial messages
  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await messagesAPI.getMessages(token, room, 1);
        if (response.data.success) {
          setMessages(response.data.data.messages);
          setHasMore(response.data.data.hasMore);
          setPage(1);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();
  }, [token, room]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const handleNewPrivateMessage = (message) => {
      // Only add if it's for the current room or user
      setMessages(prev => [...prev, message]);
    };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.NEW_PRIVATE_MESSAGE, handleNewPrivateMessage);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.NEW_PRIVATE_MESSAGE, handleNewPrivateMessage);
    };
  }, [socket, room]);

  const sendMessage = useCallback((content) => {
    if (!socket || !content.trim()) return;

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      content: content.trim(),
      room
    });
  }, [socket, room]);

  const loadMoreMessages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await messagesAPI.getMessages(token, room, nextPage);
      
      if (response.data.success) {
        setMessages(prev => [...response.data.data.messages, ...prev]);
        setHasMore(response.data.data.hasMore);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    hasMore,
    sendMessage,
    loadMoreMessages
  };
};