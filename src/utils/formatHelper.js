// Format số với dấu phẩy phân cách hàng nghìn
export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Format tiền tệ VNĐ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format nhiệt độ
export const formatTemperature = (temp) => {
  return `${Math.round(temp)}°C`;
};

// Format độ ẩm
export const formatHumidity = (humidity) => {
  return `${Math.round(humidity)}%`;
};

// Format tốc độ gió (m/s sang km/h)
export const formatWindSpeed = (speed) => {
  const kmh = speed * 3.6;
  return `${Math.round(kmh)} km/h`;
};

// Lấy icon thời tiết
export const getWeatherIcon = (condition) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  };
  return icons[condition] || '🌤️';
};

// Lấy màu theo mức độ cảnh báo
export const getAlertColor = (level) => {
  const colors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50',
  };
  return colors[level] || colors.medium;
};

// Rút gọn văn bản
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
