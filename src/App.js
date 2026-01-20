/**
 * FarmRay - Ứng dụng cảnh báo mùa vụ thông minh
 * Hỗ trợ nông dân Đồng bằng sông Cửu Long
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Lazy load các trang để tối ưu performance
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatBot/ChatPage'));
const WeatherPage = lazy(() => import('./pages/Weather/WeatherPage'));
const AlertsPage = lazy(() => import('./pages/Alert/AlertsPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));

// Loading fallback
const PageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
    <LoadingSpinner size="large" text="Đang tải trang..." />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Additional Routes (placeholder) */}
          <Route path="/report" element={<ComingSoon title="Báo cáo sâu bệnh" />} />
          <Route path="/schedule" element={<ComingSoon title="Lịch chăm sóc" />} />
          <Route path="/stats" element={<ComingSoon title="Thống kê" />} />
          <Route path="/medicine" element={<ComingSoon title="Tra cứu thuốc" />} />
          <Route path="/knowledge" element={<ComingSoon title="Kiến thức nông nghiệp" />} />
          <Route path="/disease/:id" element={<ComingSoon title="Chi tiết sâu bệnh" />} />
          <Route path="/alerts/:id" element={<ComingSoon title="Chi tiết cảnh báo" />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

// Coming Soon Page
const ComingSoon = ({ title }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
    <span className="text-8xl mb-6">🚧</span>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    <p className="text-xl text-gray-600 text-center mb-8">
      Tính năng đang được phát triển.<br />
      Vui lòng quay lại sau!
    </p>
    <button
      onClick={() => window.history.back()}
      className="px-8 py-4 bg-primary-500 text-white text-xl font-semibold rounded-xl hover:bg-primary-600 transition-colors"
    >
      ← Quay lại
    </button>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
    <span className="text-8xl mb-6">🔍</span>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy trang</h1>
    <p className="text-xl text-gray-600 text-center mb-8">
      Trang bạn tìm kiếm không tồn tại.
    </p>
    <a
      href="/"
      className="px-8 py-4 bg-primary-500 text-white text-xl font-semibold rounded-xl hover:bg-primary-600 transition-colors"
    >
      🏠 Về trang chủ
    </a>
  </div>
);

export default App;
