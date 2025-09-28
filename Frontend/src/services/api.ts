import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authService = {
  checkAuth: () => api.get('/auth/check'),
  logout: () => api.post('/auth/logout'),
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
};

export const emailService = {
  getUnreadEmails: () => api.get('/api/emails/unread'),
  sendReply: (emailId, replyContent) => 
    api.post('/api/emails/send-reply', { emailId, replyContent })
};

export const aiService = {
  generateReply: (emailId, tone) => 
    api.post('/api/ai/generate-reply', { emailId, tone }),
  regenerateReply: (emailId, tone) => 
    api.post('/api/ai/regenerate-reply', { emailId, tone })
};