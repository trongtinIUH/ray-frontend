/**
 * AlertsPage - Trang cảnh báo dịch bệnh
 * Hiển thị cảnh báo trong khu vực, lịch sử báo cáo
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COMMON_DISEASES } from '../../services/alertService';
// alertService và SEVERITY_LEVELS để dùng cho tương lai
import useVoice from '../../hooks/useVoice';

const AlertsPage = () => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'high', 'nearby'

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      
      // Mock data - thay bằng API thật
      const mockAlerts = [
        {
          id: 'alert_1',
          type: 'disease_outbreak',
          diseaseType: 'dao_on',
          diseaseName: 'Đạo ôn cổ bông',
          level: 'high',
          message: 'Phát hiện dịch Đạo ôn cổ bông tại xã Vĩnh Xương, cách ruộng bác 2km.',
          location: 'Vĩnh Xương, An Phú, An Giang',
          distance: 2,
          reportedBy: 'Bác Ba',
          treatment: ['Beam 75WG - 30g/bình 16 lít', 'Fujione 40EC - 25ml/bình 16 lít'],
          createdAt: '2026-01-15T08:30:00Z',
          isRead: false
        },
        {
          id: 'alert_2',
          type: 'pest_warning',
          diseaseType: 'ray_nau',
          diseaseName: 'Rầy nâu',
          level: 'medium',
          message: 'Cảnh báo mật độ rầy nâu cao tại huyện Châu Phú.',
          location: 'Châu Phú, An Giang',
          distance: 5,
          reportedBy: 'Trạm BVTV',
          treatment: ['Actara 25WG - 8g/bình 16 lít', 'Chess 50WG - 10g/bình 16 lít'],
          createdAt: '2026-01-14T14:00:00Z',
          isRead: true
        },
        {
          id: 'alert_3',
          type: 'weather_warning',
          diseaseType: 'weather',
          diseaseName: 'Mưa lớn',
          level: 'high',
          message: 'Dự báo mưa lớn 50-100mm trong 2 ngày tới. Kiểm tra bờ bao.',
          location: 'Toàn tỉnh An Giang',
          distance: 0,
          reportedBy: 'Đài khí tượng',
          treatment: ['Gia cố bờ bao', 'Chuẩn bị máy bơm'],
          createdAt: '2026-01-15T06:00:00Z',
          isRead: false
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const readAloud = (alert) => {
    const text = `Cảnh báo ${alert.level === 'high' ? 'khẩn cấp' : ''}. ${alert.diseaseName}. ${alert.message}`;
    speak(text);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'high') return alert.level === 'high' || alert.level === 'critical';
    if (filter === 'nearby') return alert.distance <= 5;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Đang tải cảnh báo..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b-2 border-gray-200 shadow-sm z-30">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-2xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">⚠️ Cảnh báo</h1>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} cảnh báo mới` : 'Không có cảnh báo mới'}
              </p>
            </div>
          </div>
          <button onClick={loadAlerts} className="p-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">🔄</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton 
            label="Tất cả" 
            count={alerts.length}
            active={filter === 'all'} 
            onClick={() => setFilter('all')} 
          />
          <FilterButton 
            label="🔴 Khẩn cấp" 
            count={alerts.filter(a => a.level === 'high' || a.level === 'critical').length}
            active={filter === 'high'} 
            onClick={() => setFilter('high')} 
          />
          <FilterButton 
            label="📍 Gần đây" 
            count={alerts.filter(a => a.distance <= 5).length}
            active={filter === 'nearby'} 
            onClick={() => setFilter('nearby')} 
          />
        </div>

        {/* Report Button */}
        <Button
          variant="warning"
          size="large"
          icon="📢"
          fullWidth
          onClick={() => navigate('/report')}
        >
          Báo cáo sâu bệnh mới
        </Button>

        {/* Alert List */}
        {filteredAlerts.length === 0 ? (
          <Card bgColor="bg-green-50" borderColor="border-green-300">
            <div className="text-center py-8">
              <span className="text-6xl">✅</span>
              <p className="text-2xl font-bold text-green-700 mt-4">Không có cảnh báo</p>
              <p className="text-lg text-green-600 mt-2">Khu vực của bác đang an toàn!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onRead={() => readAloud(alert)}
                onViewDetail={() => navigate(`/alerts/${alert.id}`)}
              />
            ))}
          </div>
        )}

        {/* Disease Reference */}
        <Card title="📚 Tra cứu sâu bệnh phổ biến">
          <div className="grid grid-cols-2 gap-3">
            {COMMON_DISEASES.slice(0, 6).map(disease => (
              <button
                key={disease.id}
                onClick={() => navigate(`/disease/${disease.id}`)}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <span className="text-2xl">{disease.icon}</span>
                <span className="text-lg font-medium">{disease.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <NavItem icon="🏠" label="Trang chủ" onClick={() => navigate('/')} />
          <NavItem icon="🌤️" label="Thời tiết" onClick={() => navigate('/weather')} />
          <NavItem icon="🤖" label="Hỏi AI" onClick={() => navigate('/chat')} />
          <NavItem icon="⚠️" label="Cảnh báo" active />
          <NavItem icon="👤" label="Tôi" onClick={() => navigate('/profile')} />
        </div>
      </nav>
    </div>
  );
};

// Filter Button
const FilterButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
      ${active 
        ? 'bg-primary-500 text-white' 
        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300'
      }
    `}
  >
    <span className="text-lg font-medium">{label}</span>
    <span className={`px-2 py-0.5 rounded-full text-sm ${active ? 'bg-white/30' : 'bg-gray-200'}`}>
      {count}
    </span>
  </button>
);

// Alert Item
const AlertItem = ({ alert, onRead, onViewDetail }) => {
  const levelColors = {
    low: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
    high: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-700' }
  };

  const colors = levelColors[alert.level] || levelColors.medium;
  const diseaseInfo = COMMON_DISEASES.find(d => d.id === alert.diseaseType);

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 ${!alert.isRead ? 'ring-2 ring-offset-2 ring-primary-400' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{diseaseInfo?.icon || '⚠️'}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{alert.diseaseName}</h3>
            <span className={`px-3 py-1 rounded-full text-base font-medium ${colors.badge}`}>
              {alert.level === 'high' ? 'Khẩn cấp' : alert.level === 'critical' ? 'Rất khẩn' : 'Cảnh báo'}
            </span>
          </div>
        </div>
        {!alert.isRead && (
          <span className="w-3 h-3 bg-red-500 rounded-full" />
        )}
      </div>

      {/* Message */}
      <p className="text-xl text-gray-800 mb-3">{alert.message}</p>

      {/* Location & Distance */}
      <div className="flex items-center gap-2 text-lg text-gray-600 mb-3">
        <span>📍</span>
        <span>{alert.location}</span>
        {alert.distance > 0 && (
          <span className="font-bold text-orange-600">({alert.distance}km)</span>
        )}
      </div>

      {/* Treatment (collapsed) */}
      {alert.treatment && alert.treatment.length > 0 && (
        <div className="bg-white/50 p-3 rounded-lg mb-3">
          <p className="font-bold text-gray-700 mb-2">💊 Thuốc đề xuất:</p>
          <p className="text-lg">{alert.treatment[0]}</p>
          {alert.treatment.length > 1 && (
            <p className="text-base text-gray-500">+ {alert.treatment.length - 1} loại khác</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRead}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors"
        >
          <span>🔊</span> Đọc cho tôi
        </button>
        <button
          onClick={onViewDetail}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-100 text-primary-700 rounded-xl font-medium hover:bg-primary-200 transition-colors"
        >
          <span>📄</span> Chi tiết
        </button>
      </div>

      {/* Time */}
      <p className="text-base text-gray-500 mt-3 text-right">
        {new Date(alert.createdAt).toLocaleString('vi-VN')}
      </p>
    </div>
  );
};

// Nav Item
const NavItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-3 px-3 min-w-[64px] min-h-[64px] transition-all
      ${active ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-primary-500'}
    `}
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export default AlertsPage;
