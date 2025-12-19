import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials)
};

// Event APIs
export const eventAPI = {
  getAllEvents: (filters = {}) => api.get('/events', { params: filters }),
  getEventById: (eventId) => api.get(`/events/${eventId}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateScore: (eventId, scoreData) => api.put(`/events/${eventId}/score`, scoreData),
  updateEventStatus: (eventId, statusData) => api.put(`/events/${eventId}/status`, statusData),
  addEventHistory: (eventId, historyData) => api.post(`/events/${eventId}/history`, historyData),
  
  // Follow/Unfollow
  followEvent: (eventId) => api.post(`/events/${eventId}/follow`),
  unfollowEvent: (eventId) => api.delete(`/events/${eventId}/follow`),
  getUserFollowedEvents: () => api.get('/events/user/followed-events'),
  isFollowingEvent: (eventId) => api.get(`/events/${eventId}/is-following`)
};

export default api;
