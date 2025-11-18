import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data)
};

// Messages API
export const messagesAPI = {
  getMessages: (room = 'global', page = 1, limit = 50) => 
    api.get(`/messages?room=${room}&page=${page}&limit=${limit}`),
  sendMessage: (data) => api.post('/messages', data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  reactToMessage: (messageId, emoji) => 
    api.post(`/messages/${messageId}/react`, { emoji })
};

// Rooms API
export const roomsAPI = {
  getRooms: () => api.get('/rooms'),
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),
  createRoom: (data) => api.post('/rooms', data),
  joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
  leaveRoom: (roomId) => api.post(`/rooms/${roomId}/leave`),
  deleteRoom: (roomId) => api.delete(`/rooms/${roomId}`)
};

export default api;