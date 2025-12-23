import axios from 'axios';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../constants/api';

// Lấy thời tiết hiện tại theo tọa độ
export const getCurrentWeather = async (lat, lng) => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon: lng,
        appid: WEATHER_API_KEY,
        units: 'metric', // Celsius
        lang: 'vi',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Lấy dự báo 5 ngày
export const getForecastWeather = async (lat, lng) => {
  try {
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
  } catch (error) {
    console.error('Error fetching forecast weather:', error);
    throw error;
  }
};

// Phân tích rủi ro dựa trên thời tiết
export const analyzeWeatherRisk = (weatherData) => {
  const risks = [];
  
  // Kiểm tra nhiệt độ
  if (weatherData.main.temp > 35) {
    risks.push({
      type: 'high_temperature',
      level: 'warning',
      message: 'Nhiệt độ cao có thể làm héo lúa, cần tưới nước đầy đủ',
    });
  }
  
  // Kiểm tra độ ẩm
  if (weatherData.main.humidity > 90) {
    risks.push({
      type: 'high_humidity',
      level: 'danger',
      message: 'Độ ẩm cao, nguy cơ bệnh Đạo ôn và sâu cuốn lá',
    });
  }
  
  // Kiểm tra mưa
  if (weatherData.weather[0].main === 'Rain') {
    risks.push({
      type: 'rain',
      level: 'info',
      message: 'Có mưa, chú ý thoát nước cho ruộng',
    });
  }
  
  return risks;
};
