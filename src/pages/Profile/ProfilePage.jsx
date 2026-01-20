/**
 * ProfilePage - Trang hồ sơ người dùng
 * Quản lý thông tin nông dân, vụ mùa, cài đặt
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { farmerService } from '../../services/farmerService';
// cropService sẽ được dùng khi tích hợp quản lý mùa vụ

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const stored = farmerService.getStoredInfo();
      
      // Mock profile data
      setProfile({
        name: stored.farmerName || 'Bác nông dân',
        phone: '0912 345 678',
        location: stored.location?.replace('#', ', ') || 'An Giang, Châu Phú',
        cropType: 'Lúa OM18',
        fieldSize: 2.5,
        registeredAt: '2025-11-01'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-lg text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-primary-500 text-white shadow-lg z-30">
        <div className="flex items-center justify-between px-4 py-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.name || 'Đang tải...'}</h1>
              <p className="text-primary-100">📍 {profile?.location}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/profile/edit')}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <span className="text-2xl">✏️</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon="🌾" value="2.5" label="ha ruộng" />
          <StatCard icon="📅" value="3" label="vụ mùa" />
          <StatCard icon="💬" value="45" label="câu hỏi" />
        </div>

        {/* Crop Info */}
        <Card title="🌾 Vụ mùa hiện tại">
          <div className="space-y-3">
            <ProfileItem label="Giống lúa" value="OM18" />
            <ProfileItem label="Vụ mùa" value="Đông Xuân 2025-2026" />
            <ProfileItem label="Diện tích" value="2.5 ha" />
            <ProfileItem label="Ngày sạ" value="15/11/2025" />
          </div>
          <Button
            variant="outline"
            size="medium"
            fullWidth
            className="mt-4"
            onClick={() => navigate('/crop/edit')}
          >
            Cập nhật vụ mùa
          </Button>
        </Card>

        {/* Personal Info */}
        <Card title="👤 Thông tin cá nhân">
          <div className="space-y-3">
            <ProfileItem label="Họ tên" value={profile?.name || '-'} />
            <ProfileItem label="Số điện thoại" value={profile?.phone || '-'} />
            <ProfileItem label="Địa chỉ" value={profile?.location || '-'} />
            <ProfileItem label="Ngày đăng ký" value="01/11/2025" />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="⚙️ Cài đặt & Tiện ích">
          <div className="space-y-2">
            <SettingItem 
              icon="🔔" 
              label="Thông báo" 
              description="Bật/tắt cảnh báo"
              onClick={() => navigate('/settings/notifications')}
            />
            <SettingItem 
              icon="🗣️" 
              label="Giọng nói" 
              description="Cài đặt Text-to-Speech"
              onClick={() => navigate('/settings/voice')}
            />
            <SettingItem 
              icon="📊" 
              label="Lịch sử chat" 
              description="Xem câu hỏi đã hỏi"
              onClick={() => navigate('/chat/history')}
            />
            <SettingItem 
              icon="📱" 
              label="Cài app" 
              description="Thêm vào màn hình chính"
              onClick={() => {/* PWA install prompt */}}
            />
          </div>
        </Card>

        {/* Help & Support */}
        <Card title="❓ Hỗ trợ">
          <div className="space-y-2">
            <SettingItem 
              icon="📖" 
              label="Hướng dẫn sử dụng" 
              onClick={() => navigate('/help')}
            />
            <SettingItem 
              icon="📞" 
              label="Liên hệ hỗ trợ" 
              onClick={() => window.open('tel:1900123456')}
            />
            <SettingItem 
              icon="ℹ️" 
              label="Về FarmRay" 
              onClick={() => navigate('/about')}
            />
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          size="large"
          fullWidth
          onClick={() => {
            farmerService.logout();
            navigate('/');
          }}
        >
          🚪 Đăng xuất
        </Button>

        {/* Version */}
        <p className="text-center text-gray-500 text-base pb-4">
          FarmRay v1.0.0 • Made with ❤️ for Vietnamese Farmers
        </p>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          <NavItem icon="🏠" label="Trang chủ" onClick={() => navigate('/')} />
          <NavItem icon="🌤️" label="Thời tiết" onClick={() => navigate('/weather')} />
          <NavItem icon="🤖" label="Hỏi AI" onClick={() => navigate('/chat')} />
          <NavItem icon="⚠️" label="Cảnh báo" onClick={() => navigate('/alerts')} />
          <NavItem icon="👤" label="Tôi" active />
        </div>
      </nav>
    </div>
  );
};

// Stat Card
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
    <span className="text-3xl">{icon}</span>
    <p className="text-2xl font-bold text-primary-600 mt-1">{value}</p>
    <p className="text-base text-gray-600">{label}</p>
  </div>
);

// Profile Item
const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-lg text-gray-600">{label}</span>
    <span className="text-lg font-semibold text-gray-800">{value}</span>
  </div>
);

// Setting Item
const SettingItem = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
  >
    <span className="text-2xl">{icon}</span>
    <div className="flex-1 text-left">
      <p className="text-lg font-semibold text-gray-800">{label}</p>
      {description && <p className="text-base text-gray-500">{description}</p>}
    </div>
    <span className="text-xl text-gray-400">→</span>
  </button>
);

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

export default ProfilePage;
