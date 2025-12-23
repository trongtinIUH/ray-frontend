// API Endpoints configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const AI_SERVICE_URL = process.env.REACT_APP_AI_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  
  // Weather
  WEATHER: {
    CURRENT: '/weather/current',
    FORECAST: '/weather/forecast',
    HISTORICAL: '/weather/historical',
  },
  
  // Alert
  ALERT: {
    LIST: '/alerts',
    DETAIL: '/alerts/:id',
    CREATE: '/alerts',
    MARK_READ: '/alerts/:id/read',
  },
  
  // Crop
  CROP: {
    LIST: '/crops',
    DETAIL: '/crops/:id',
    CREATE: '/crops',
    UPDATE: '/crops/:id',
    DELETE: '/crops/:id',
  },
  
  // AI Service
  AI: {
    PREDICT: '/ai/predict',
    ANALYZE: '/ai/analyze',
    CHAT: '/ai/chat',
    IMAGE_RECOGNITION: '/ai/image-recognition',
  },
};

// Weather API (OpenWeatherMap hoặc AccuWeather)
export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
