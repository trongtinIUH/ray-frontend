/**
 * WeatherPage - Trang chi tiết thời tiết
 * Giao diện hiện đại với gradients và Font Awesome icons
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGeolocation from '../../hooks/useGeolocation';

const WeatherPage = () => {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Mock data - thay bằng API thật
      const mockCurrent = {
        temp: 32,
        feels_like: 35,
        humidity: 85,
        pressure: 1010,
        wind_speed: 3.5,
        description: 'Có mây, nắng nhẹ',
        condition: 'partly-cloudy'
      };
      setWeatherData(mockCurrent);

      // 7 ngày forecast
      const mockForecast = [
        { day: 'Hôm nay', temp: 32, tempMin: 26, humidity: 85, condition: 'sunny', rain: 20, desc: 'Nắng nhẹ' },
        { day: 'T2', temp: 31, tempMin: 25, humidity: 88, condition: 'cloudy', rain: 40, desc: 'Có mây' },
        { day: 'T3', temp: 29, tempMin: 24, humidity: 92, condition: 'rainy', rain: 80, desc: 'Mưa rào' },
        { day: 'T4', temp: 28, tempMin: 23, humidity: 95, condition: 'stormy', rain: 90, desc: 'Mưa to' },
        { day: 'T5', temp: 30, tempMin: 24, humidity: 85, condition: 'cloudy', rain: 30, desc: 'Mây tan' },
        { day: 'T6', temp: 32, tempMin: 25, humidity: 80, condition: 'sunny', rain: 10, desc: 'Nắng đẹp' },
        { day: 'T7', temp: 33, tempMin: 26, humidity: 75, condition: 'sunny', rain: 5, desc: 'Nắng nóng' },
      ];
      setForecast(mockForecast);

    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'sunny': 'fa-sun',
      'partly-cloudy': 'fa-cloud-sun',
      'cloudy': 'fa-cloud',
      'rainy': 'fa-cloud-rain',
      'stormy': 'fa-cloud-bolt',
      'windy': 'fa-wind'
    };
    return icons[condition] || 'fa-sun';
  };

  const getWeatherGradient = (condition) => {
    const gradients = {
      'sunny': 'from-amber-400 via-orange-400 to-yellow-500',
      'partly-cloudy': 'from-sky-400 via-blue-400 to-cyan-500',
      'cloudy': 'from-slate-400 via-gray-400 to-slate-500',
      'rainy': 'from-blue-500 via-indigo-500 to-purple-600',
      'stormy': 'from-slate-600 via-purple-700 to-slate-800',
      'windy': 'from-teal-400 via-cyan-500 to-blue-500'
    };
    return gradients[condition] || gradients['sunny'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-cloud-sun text-6xl text-blue-500 animate-pulse mb-4" />
          <p className="text-xl text-gray-600">Đang tải thời tiết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className={`bg-gradient-to-r ${getWeatherGradient(weatherData.condition)} px-4 py-4 shadow-lg`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <i className="fa-solid fa-arrow-left text-white text-lg" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="fa-solid fa-location-dot" />
                  Thời tiết
                </h1>
                <p className="text-sm text-white/80">An Giang, Châu Phú</p>
              </div>
            </div>
            <button 
              onClick={loadWeatherData}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <i className="fa-solid fa-rotate text-white text-lg" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Current Weather Card */}
        <div className={`bg-gradient-to-br ${getWeatherGradient(weatherData.condition)} rounded-3xl p-6 shadow-xl text-white overflow-hidden relative`}>
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90 mb-2">Hôm nay</p>
                <p className="text-7xl font-bold tracking-tight">{weatherData.temp}°</p>
                <p className="text-xl mt-2 opacity-90">{weatherData.description}</p>
              </div>
              <div className="text-right">
                <i className={`fa-solid ${getWeatherIcon(weatherData.condition)} text-8xl opacity-90`} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
              <WeatherStat icon="fa-droplet" label="Độ ẩm" value={`${weatherData.humidity}%`} />
              <WeatherStat icon="fa-temperature-half" label="Cảm giác" value={`${weatherData.feels_like}°`} />
              <WeatherStat icon="fa-wind" label="Gió" value={`${weatherData.wind_speed} km/h`} />
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-white" />
            </div>
            <h3 className="text-lg font-bold text-amber-800">Cảnh báo nông nghiệp</h3>
          </div>
          <div className="space-y-3">
            <AlertItem 
              icon="fa-cloud-rain" 
              color="text-blue-600"
              text={<><strong>Mưa lớn dự kiến T3-T4:</strong> Kiểm tra bờ bao, tháo nước ruộng nếu cần.</>}
            />
            <AlertItem 
              icon="fa-droplet" 
              color="text-teal-600"
              text={<><strong>Độ ẩm cao 85-95%:</strong> Nguy cơ bệnh Đạo ôn, Bạc lá tăng cao.</>}
            />
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-calendar-week text-indigo-500" />
            Dự báo 7 ngày
          </h3>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <ForecastItem key={index} {...day} getWeatherIcon={getWeatherIcon} />
            ))}
          </div>
        </div>

        {/* Farm Tips */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-200 shadow-md">
          <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-lightbulb text-amber-500" />
            Lời khuyên theo thời tiết
          </h3>
          <div className="space-y-3">
            <TipCard 
              icon="fa-cloud-rain"
              iconBg="from-blue-400 to-indigo-500"
              title="Trước khi mưa (T2-T3)"
              content="Phun thuốc phòng bệnh nấm, kiểm tra hệ thống thoát nước."
            />
            <TipCard 
              icon="fa-sun"
              iconBg="from-amber-400 to-orange-500"
              title="Sau mưa (T5-T6)"
              content="Kiểm tra sâu bệnh, bón phân bổ sung nếu cần."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Weather Stat Component
const WeatherStat = ({ icon, label, value }) => (
  <div className="text-center">
    <i className={`fa-solid ${icon} text-2xl mb-1`} />
    <p className="text-sm opacity-80">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

// Alert Item Component
const AlertItem = ({ icon, color, text }) => (
  <p className="text-gray-700 flex items-start gap-2">
    <i className={`fa-solid ${icon} ${color} mt-1`} />
    <span>{text}</span>
  </p>
);

// Forecast Item Component
const ForecastItem = ({ day, temp, tempMin, humidity, condition, rain, desc, getWeatherIcon }) => {
  const isToday = day === 'Hôm nay';
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${
      isToday ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          condition === 'sunny' ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600' :
          condition === 'rainy' || condition === 'stormy' ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600' :
          'bg-gradient-to-br from-gray-100 to-slate-100 text-gray-600'
        }`}>
          <i className={`fa-solid ${getWeatherIcon(condition)} text-xl`} />
        </div>
        <div>
          <p className={`font-bold ${isToday ? 'text-blue-700' : 'text-gray-800'}`}>{day}</p>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-800">
          {temp}° <span className="text-sm font-normal text-gray-400">/ {tempMin}°</span>
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-droplet text-blue-400" />
            {humidity}%
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-umbrella text-indigo-400" />
            {rain}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Tip Card Component
const TipCard = ({ icon, iconBg, title, content }) => (
  <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <i className={`fa-solid ${icon} text-white`} />
    </div>
    <div>
      <p className="font-bold text-gray-800">{title}</p>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

export default WeatherPage;
