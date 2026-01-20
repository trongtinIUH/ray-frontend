/**
 * HomePage - Trang chủ FarmRay
 * Giao diện hiện đại với gradients và Font Awesome icons
 * Mobile First, Elderly Friendly
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceButton from '../../components/common/VoiceButton';
import { cropService } from '../../services/cropService';
import { farmerService } from '../../services/farmerService';
import useGeolocation from '../../hooks/useGeolocation';
import useVoice from '../../hooks/useVoice';

const HomePage = () => {
  const navigate = useNavigate();
  const { error: gpsError, loading: gpsLoading } = useGeolocation();
  const { speak } = useVoice();
  
  // State
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmerInfo, setFarmerInfo] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Lấy thông tin nông dân
      const stored = farmerService.getStoredInfo();
      setFarmerInfo(stored);

      // Mock data cho demo
      const mockWeather = {
        temp: 32,
        feels_like: 35,
        humidity: 85,
        description: 'Có mây, nắng nhẹ',
        condition: 'partly-cloudy'
      };
      setWeatherData(mockWeather);

      // Alerts
      const mockAlerts = [{
        id: 'alert_1',
        type: 'disease_warning',
        level: 'high',
        message: 'Độ ẩm cao 85%, nhiệt độ 32°C. Nguy cơ cao bệnh Đạo ôn trong 3 ngày tới.',
        disease: 'Đạo ôn cổ bông',
      }];
      setAlerts(mockAlerts);

      // Crop data
      const sowingDate = '2025-11-15';
      const currentStage = cropService.calculateCurrentStage(sowingDate);
      setCropData({ cropType: 'RICE_OM18', cropName: 'Lúa OM18', sowingDate, season: 'Đông Xuân', ...currentStage });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Voice input handler
  const handleVoiceInput = (transcript) => {
    if (transcript) navigate('/chat', { state: { initialMessage: transcript } });
  };

  // Đọc cảnh báo bằng giọng nói
  const readAlert = (alert) => {
    const text = `Cảnh báo mức độ ${alert.level === 'high' ? 'cao' : 'trung bình'}. ${alert.message}`;
    speak(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-seedling text-6xl text-emerald-500 animate-bounce mb-4" />
          <p className="text-xl text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-4 py-5 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <i className="fa-solid fa-seedling text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FarmRay</h1>
                <p className="text-sm text-white/80">Cảnh báo mùa vụ thông minh</p>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors relative">
              <i className="fa-solid fa-bell text-white text-lg" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                Xin chào, {farmerInfo?.farmerName || 'Bác nông dân'}!
              </p>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-emerald-500" />
                {farmerInfo?.location?.replace('#', ', ') || 'An Giang, Châu Phú'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <i className="fa-solid fa-user text-emerald-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Weather Card */}
        {weatherData && (
          <div 
            onClick={() => navigate('/weather')}
            className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-2xl p-5 shadow-xl text-white cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 flex items-center gap-2">
                  <i className="fa-solid fa-cloud-sun" />
                  Thời tiết hôm nay
                </p>
                <p className="text-5xl font-bold mt-2">{weatherData.temp}°C</p>
                <p className="text-lg text-white/90 mt-1">{weatherData.description}</p>
              </div>
              <div className="text-right">
                <i className="fa-solid fa-sun text-6xl text-yellow-300" />
                <div className="mt-2 text-sm text-white/80">
                  <p><i className="fa-solid fa-droplet mr-1" /> {weatherData.humidity}%</p>
                  <p><i className="fa-solid fa-temperature-half mr-1" /> {weatherData.feels_like}°</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Card */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200/30 rounded-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <i className="fa-solid fa-triangle-exclamation text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-700">Cảnh báo mức cao</h3>
                  <p className="text-sm text-orange-600">Bệnh {alerts[0].disease}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); readAlert(alerts[0]); }}
                  className="ml-auto w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-volume-high text-blue-500" />
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed">{alerts[0].message}</p>
              <button
                onClick={() => navigate('/alerts')}
                className="mt-3 text-orange-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Xem chi tiết <i className="fa-solid fa-arrow-right text-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Crop Progress Card */}
        {cropData && (
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <i className="fa-solid fa-wheat-awn text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{cropData.cropName}</h3>
                <p className="text-sm text-gray-500">Vụ {cropData.season}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">{cropData.currentStageName || 'Đang phát triển'}</span>
                <span className="text-emerald-600 font-bold">{cropData.progress || 45}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${cropData.progress || 45}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span><i className="fa-solid fa-calendar mr-1" /> Sạ: {cropData.sowingDate}</span>
              <span><i className="fa-solid fa-clock mr-1" /> {cropData.daysFromSowing || 61} ngày</span>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <i className="fa-solid fa-robot text-4xl mb-3" />
            <p className="font-bold text-lg">Hỏi trợ lý AI</p>
            <p className="text-sm text-white/80">Tư vấn 24/7</p>
          </button>
          
          <button
            onClick={() => navigate('/report')}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <i className="fa-solid fa-bug text-4xl mb-3" />
            <p className="font-bold text-lg">Báo cáo sâu bệnh</p>
            <p className="text-sm text-white/80">Cảnh báo cộng đồng</p>
          </button>
        </div>

        {/* Voice Input */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 text-center border border-indigo-100">
          <p className="text-lg text-gray-600 mb-4">
            <i className="fa-solid fa-microphone text-indigo-500 mr-2" />
            Nhấn để hỏi bằng giọng nói
          </p>
          <div className="flex justify-center mb-4">
            <VoiceButton size="xl" onTranscript={handleVoiceInput} />
          </div>
          <p className="text-gray-500">
            Ví dụ: "Lúa bị vàng lá thì làm sao?"
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <QuickAction icon="fa-calendar-days" label="Lịch" color="from-blue-400 to-indigo-500" onClick={() => navigate('/schedule')} />
          <QuickAction icon="fa-chart-line" label="Thống kê" color="from-emerald-400 to-teal-500" onClick={() => navigate('/stats')} />
          <QuickAction icon="fa-pills" label="Thuốc" color="from-pink-400 to-rose-500" onClick={() => navigate('/medicine')} />
          <QuickAction icon="fa-book" label="Kiến thức" color="from-amber-400 to-orange-500" onClick={() => navigate('/knowledge')} />
        </div>

        {/* GPS Status */}
        {gpsLoading && (
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
            <i className="fa-solid fa-spinner fa-spin text-blue-500" />
            <span className="text-blue-700">Đang lấy vị trí GPS...</span>
          </div>
        )}

        {gpsError && (
          <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
            <i className="fa-solid fa-location-crosshairs text-amber-500" />
            <span className="text-amber-700">Vui lòng bật định vị để cảnh báo chính xác hơn</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
      <i className={`fa-solid ${icon} text-white text-lg`} />
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </button>
);

export default HomePage;
