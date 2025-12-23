import React from 'react';
import Card from '../common/Card';
import { formatTemperature, formatHumidity, getWeatherIcon } from '../../utils/formatHelper';

// Component hiển thị thông tin thời tiết
const WeatherCard = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <Card title="Thời tiết" icon="🌤️">
        <p className="text-gray-500 text-center py-4">Đang tải dữ liệu thời tiết...</p>
      </Card>
    );
  }

  const { main, weather } = weatherData;
  const condition = weather && weather[0] ? weather[0].main : 'Clear';
  const icon = getWeatherIcon(condition);

  return (
    <Card 
      title="Thời tiết hôm nay" 
      icon="🌤️"
      bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
      borderColor="border-blue-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-6xl mb-2">{icon}</div>
          <p className="text-xl text-gray-600 capitalize">
            {weather && weather[0] ? weather[0].description : 'Không có dữ liệu'}
          </p>
        </div>
        
        <div className="flex-1 text-right">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {formatTemperature(main?.temp || 0)}
          </div>
          <div className="space-y-2 text-lg">
            <div className="flex justify-end items-center gap-2">
              <span className="text-gray-600">Độ ẩm:</span>
              <span className="font-semibold text-blue-600">
                {formatHumidity(main?.humidity || 0)}
              </span>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-gray-600">Cảm giác:</span>
              <span className="font-semibold text-orange-600">
                {formatTemperature(main?.feels_like || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
