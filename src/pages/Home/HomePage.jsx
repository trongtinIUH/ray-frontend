import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import VoiceButton from '../common/VoiceButton';
import WeatherCard from '../components/features/WeatherCard';
import AlertCard from '../components/features/AlertCard';
import useGeolocation from '../hooks/useGeolocation';
import useUserStore from '../store/userStore';

const HomePage = () => {
  const { location, error: gpsError, loading: gpsLoading } = useGeolocation();
  const { selectedProvince, user } = useUserStore();

  // Mock data cho demo
  const mockWeatherData = {
    main: {
      temp: 32,
      feels_like: 35,
      humidity: 85,
    },
    weather: [
      {
        main: 'Clouds',
        description: 'có mây',
      }
    ],
  };

  const mockAlert = {
    type: 'disease_warning',
    level: 'high',
    message: 'Độ ẩm cao 85%, nhiệt độ 32°C. Nguy cơ cao bệnh Đạo ôn và Sâu cuốn lá trong 3 ngày tới.',
    disease: 'Đạo ôn cổ bông',
    treatment: [
      'Beam 75WG - 30g/bình 16 lít',
      'Validacin 3L - 50ml/bình 16 lít',
      'Phun vào buổi sáng sớm hoặc chiều mát',
    ],
  };

  const handleVoiceInput = (transcript) => {
    console.log('Người dùng nói:', transcript);
    // TODO: Gửi transcript đến AI chatbot
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🌾</span>
            <div>
              <h1 className="text-3xl font-bold text-primary-600">FarmRay</h1>
              <p className="text-lg text-gray-600">Cảnh báo mùa vụ thông minh</p>
            </div>
          </div>
          {user && (
            <div className="text-right">
              <p className="text-xl font-semibold">Xin chào, {user.name || 'Bác'}</p>
              <p className="text-lg text-gray-600">
                📍 {selectedProvince?.name || 'Chưa chọn tỉnh'}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* GPS Status */}
        {gpsLoading && (
          <Card title="Vị trí" icon="📍">
            <p className="text-center text-gray-600">Đang lấy vị trí của bạn...</p>
          </Card>
        )}
        
        {gpsError && (
          <Card title="Vị trí" icon="⚠️" bgColor="bg-yellow-50" borderColor="border-yellow-300">
            <p className="text-yellow-800 text-lg">
              Không thể lấy vị trí GPS. Vui lòng bật định vị trên điện thoại.
            </p>
          </Card>
        )}

        {location && (
          <Card title="Vị trí hiện tại" icon="📍" bgColor="bg-green-50" borderColor="border-green-300">
            <p className="text-lg">
              Tọa độ: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
            <p className="text-gray-600">Độ chính xác: {Math.round(location.accuracy)}m</p>
          </Card>
        )}

        {/* Thời tiết */}
        <WeatherCard weatherData={mockWeatherData} />

        {/* Cảnh báo */}
        <AlertCard alert={mockAlert} />

        {/* Vụ mùa hiện tại */}
        <Card title="Vụ lúa hiện tại" icon="🌾">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Giống:</span>
              <span className="font-bold text-primary-600">OM 18</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Ngày sạ:</span>
              <span className="font-bold">15/11/2024</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Tiến độ:</span>
              <span className="font-bold">Ngày 38/90</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600">Giai đoạn:</span>
              <span className="font-bold text-orange-600">Đẻ nhánh</span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-primary-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: '42%' }}
                >
                  <span className="text-white text-sm font-bold flex items-center justify-center h-full">
                    42%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Nút hỏi trợ lý AI */}
        <div className="text-center space-y-4">
          <Button
            variant="primary"
            size="xl"
            icon="🤖"
            fullWidth
            onClick={() => alert('Chuyển đến trang ChatBot (chưa làm)')}
          >
            Hỏi trợ lý AI
          </Button>

          {/* Voice Button */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg text-gray-600">Hoặc nhấn micro để nói:</p>
            <VoiceButton 
              size="xl" 
              onTranscript={handleVoiceInput}
            />
            <p className="text-sm text-gray-500 max-w-md">
              Ví dụ: "Lúa bị vàng lá thì làm sao?" hoặc "Thời tiết tuần sau thế nào?"
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 pb-6">
        <p className="text-lg">Made with ❤️ for Vietnamese Farmers 🌾</p>
      </footer>
    </div>
  );
};

export default HomePage;
