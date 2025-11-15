// API Configuration
// Uses environment variable in production, localhost in development

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://127.0.0.1:3001' : 'https://ucid-api.sparxion.com');

export const API_ENDPOINTS = {
  students: (id: string) => `${API_BASE_URL}/api/v1/students/${id}`,
  recommendations: (id: string) => `${API_BASE_URL}/api/v1/recommendations/students/${id}/paths`,
};

