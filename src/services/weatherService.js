import axios from 'axios';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../constants/api';
import { apiClient } from '../api/client';

// Lấy thời tiết hiện tại theo tọa độ
export const getCurrentWeather = async (lat, lng) => {
  try {
    // Thử dùng OpenWeatherMap API trước
    if (WEATHER_API_KEY) {
      const response = await axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat,
          lon: lng,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'vi',
        },
      });
      return response.data;
    }
    
    // Fallback: Dùng Backend API
    const response = await apiClient.publicRequest(`/api/weather/current?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    // Return mock data nếu API fail
    return getMockWeather();
  }
};

// Lấy dự báo 7 ngày
export const getForecastWeather = async (lat, lng) => {
  try {
    if (WEATHER_API_KEY) {
      const response = await axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat,
          lon: lng,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'vi',
        },
      });
      return response.data;
    }
    
    return apiClient.publicRequest(`/api/weather/forecast?lat=${lat}&lng=${lng}`);
  } catch (error) {
    console.error('Error fetching forecast weather:', error);
    throw error;
  }
};

// Mock weather data
export const getMockWeather = () => ({
  main: { temp: 32, feels_like: 35, humidity: 85, pressure: 1010 },
  weather: [{ main: 'Clouds', description: 'Có mây, nắng nhẹ', icon: '02d' }],
  wind: { speed: 3.5 }
});

// Phân tích rủi ro dựa trên thời tiết
export const analyzeWeatherRisk = (weatherData) => {
  const risks = [];
  
  // Kiểm tra nhiệt độ
  if (weatherData?.main?.temp > 35) {
    risks.push({
      type: 'high_temperature',
      level: 'warning',
      message: 'Nhiệt độ cao có thể làm héo lúa, cần tưới nước đầy đủ',
    });
  }
  
  // Kiểm tra độ ẩm
  if (weatherData?.main?.humidity > 90) {
    risks.push({
      type: 'high_humidity',
      level: 'danger',
      message: 'Độ ẩm cao, nguy cơ bệnh Đạo ôn và sâu cuốn lá',
    });
  }
  
  // Kiểm tra mưa
  if (weatherData?.weather?.[0]?.main === 'Rain') {
    risks.push({
      type: 'rain',
      level: 'info',
      message: 'Có mưa, chú ý thoát nước cho ruộng',
    });
  }
  
  return risks;
};

// Weather icon mapping
export const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '⛅',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[condition] || '🌤️';
};

// Export as service object for compatibility
export const weatherService = {
  getCurrentWeather,
  getForecastWeather,
  analyzeWeatherRisk,
  getMockWeather,
  getWeatherIcon
};

export default weatherService;
