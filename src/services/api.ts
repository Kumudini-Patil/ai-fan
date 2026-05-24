import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; username: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { full_name?: string; avatar_url?: string }) =>
    api.put('/auth/profile', data)
};

// Matches API
export const matchesAPI = {
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/matches', { params }),
  getById: (id: string) => api.get(`/matches/${id}`),
  getPitchReport: (id: string) => api.get(`/matches/${id}/pitch-report`),
  getPrediction: (id: string) => api.get(`/matches/${id}/prediction`)
};

// Players API
export const playersAPI = {
  getAll: (params?: { team?: string; role?: string }) =>
    api.get('/players', { params }),
  getById: (id: string) => api.get(`/players/${id}`),
  getStats: (id: string, venueId?: string) =>
    api.get(`/players/${id}/stats`, { params: { venue_id: venueId } }),
  getForm: (id: string) => api.get(`/players/${id}/form`),
  getByMatch: (matchId: string) => api.get(`/players/match/${matchId}`)
};

// Teams API
export const teamsAPI = {
  generate: (data: { match_id: string; team_type?: 'safe' | 'grand-league' | 'balanced' }) =>
    api.post('/teams/generate', data),
  save: (data: any) => api.post('/teams/save', data),
  getSaved: (matchId?: string) => api.get('/teams/saved', { params: { match_id: matchId } }),
  getById: (id: string) => api.get(`/teams/saved/${id}`),
  delete: (id: string) => api.delete(`/teams/saved/${id}`),
  downloadImage: (id: string) => api.get(`/teams/saved/${id}/download`)
};

// Venues API
export const venuesAPI = {
  getAll: () => api.get('/venues'),
  getById: (id: string) => api.get(`/venues/${id}`)
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  // Players
  addPlayer: (data: any) => api.post('/admin/players', data),
  updatePlayer: (id: string, data: any) => api.put(`/admin/players/${id}`, data),
  deletePlayer: (id: string) => api.delete(`/admin/players/${id}`),
  // Venues
  addVenue: (data: any) => api.post('/admin/venues', data),
  updateVenue: (id: string, data: any) => api.put(`/admin/venues/${id}`, data),
  deleteVenue: (id: string) => api.delete(`/admin/venues/${id}`),
  // Matches
  addMatch: (data: any) => api.post('/admin/matches', data),
  updateMatch: (id: string, data: any) => api.put(`/admin/matches/${id}`, data),
  deleteMatch: (id: string) => api.delete(`/admin/matches/${id}`),
  // Stats
  updatePlayerStats: (id: string, data: any) => api.put(`/admin/player-stats/${id}`, data)
};

// Chatbot API
export const chatbotAPI = {
  chat: (message: string, context?: any) =>
    api.post('/chatbot/chat', { message, context })
};
