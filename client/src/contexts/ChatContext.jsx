import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { messagesAPI, roomsAPI } from '../utils/api';

const ChatContext = createContext();

// Action Types
const ACTION_TYPES = {
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_ROOMS: 'SET_ROOMS',
  ADD_ROOM: 'ADD_ROOM',
  UPDATE_ROOM: 'UPDATE_ROOM',
  REMOVE_ROOM: 'REMOVE_ROOM',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: action.payload,
        messages: []
      };

    case ACTION_TYPES.SET_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };

    case ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };

    case ACTION_TYPES.SET_ROOMS:
      return {
        ...state,
        rooms: action.payload,
        loading: false
      };

    case ACTION_TYPES.ADD_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, action.payload]
      };

    case ACTION_TYPES.UPDATE_ROOM:
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room._id === action.payload._id ? action.payload : room
        )
      };

    case ACTION_TYPES.REMOVE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(room => room._id !== action.payload)
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  activeChat: null, // { type: 'room' | 'user', data: room/user object }
  messages: [],
  rooms: [],
  users: [],
  loading: false,
  error: null
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const { socket } = useSocket();

  // Load initial data
  useEffect(() => {
    loadRooms();
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch({ type: ACTION_TYPES.ADD_MESSAGE, payload: message });
    };

    const handleNewRoom = (room) => {
      dispatch({ type: ACTION_TYPES.ADD_ROOM, payload: room });
    };

    const handleRoomUpdate = (room) => {
      dispatch({ type: ACTION_TYPES.UPDATE_ROOM, payload: room });
    };

    const handleRoomDelete = (roomId) => {
      dispatch({ type: ACTION_TYPES.REMOVE_ROOM, payload: roomId });
    };

    socket.on('new-message', handleNewMessage);
    socket.on('room-created', handleNewRoom);
    socket.on('room-updated', handleRoomUpdate);
    socket.on('room-deleted', handleRoomDelete);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('room-created', handleNewRoom);
      socket.off('room-updated', handleRoomUpdate);
      socket.off('room-deleted', handleRoomDelete);
    };
  }, [socket]);

  const loadRooms = async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      const response = await roomsAPI.getRooms();
      if (response.data.success) {
        dispatch({ type: ACTION_TYPES.SET_ROOMS, payload: response.data.data.rooms });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const loadMessages = async (chatType, chatId) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      let room = 'global';
      if (chatType === 'user') {
        room = `user_${chatId}`;
      } else if (chatType === 'room') {
        room = chatId;
      }

      const response = await messagesAPI.getMessages(room);
      if (response.data.success) {
        dispatch({ type: ACTION_TYPES.SET_MESSAGES, payload: response.data.data.messages });
      }
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const setActiveChat = (chat) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_CHAT, payload: chat });
    if (chat) {
      loadMessages(chat.type, chat.data._id);
    }
  };

  const sendMessage = (content) => {
    if (!socket || !content.trim()) return;

    if (state.activeChat?.type === 'user') {
      socket.emit('send-private-message', {
        receiverId: state.activeChat.data._id,
        content: content.trim()
      });
    } else {
      const room = state.activeChat?.type === 'room' 
        ? state.activeChat.data.name 
        : 'global';
      
      socket.emit('send-message', {
        content: content.trim(),
        room
      });
    }
  };

  const createRoom = async (roomData) => {
    try {
      const response = await roomsAPI.createRoom(roomData);
      if (response.data.success) {
        dispatch({ type: ACTION_TYPES.ADD_ROOM, payload: response.data.data.room });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create room' };
    }
  };

  const value = {
    ...state,
    setActiveChat,
    sendMessage,
    createRoom,
    loadMessages,
    loadRooms
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};