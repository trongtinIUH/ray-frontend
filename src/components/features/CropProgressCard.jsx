/**
 * Crop Progress Card - Hiển thị tiến độ vụ mùa
 * UI rõ ràng, dễ hiểu cho người cao tuổi
 */

import React from 'react';
import Card from '../common/Card';
import { CROP_STAGES } from '../../services/cropService';

const CropProgressCard = ({ cropData }) => {
  if (!cropData) return null;

  const { 
    cropName, 
    sowingDate, 
    stage, 
    day, 
    progress, 
    season 
  } = cropData;

  // Tìm thông tin giai đoạn hiện tại
  const currentStageInfo = CROP_STAGES.find(s => s.id === stage) || CROP_STAGES[0];

  // Format ngày sạ
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Card 
      title="Vụ lúa hiện tại" 
      icon="🌾"
      bgColor="bg-gradient-to-br from-green-50 to-yellow-50"
      borderColor="border-green-300"
    >
      <div className="space-y-4">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Giống" value={cropName} highlight />
          <InfoItem label="Vụ mùa" value={season} />
          <InfoItem label="Ngày sạ" value={formatDate(sowingDate)} />
          <InfoItem label="Tiến độ" value={`Ngày ${day}/90`} />
        </div>

        {/* Giai đoạn hiện tại - nổi bật */}
        <div className="bg-white p-4 rounded-xl border-2 border-primary-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentStageInfo.icon}</span>
              <div>
                <p className="text-lg text-gray-600">Giai đoạn:</p>
                <p className="text-2xl font-bold text-primary-600">
                  {currentStageInfo.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg text-gray-600">Ngày:</p>
              <p className="text-2xl font-bold text-orange-600">{currentStageInfo.days}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg text-gray-600">Tiến độ tổng:</span>
            <span className="text-xl font-bold text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #22c55e 0%, #eab308 50%, #f97316 100%)'
              }}
            >
              {progress >= 20 && (
                <span className="text-white text-sm font-bold">{progress}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Stage Timeline */}
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-700 mb-3">Các giai đoạn:</p>
          <div className="flex overflow-x-auto gap-2 pb-2">
            {CROP_STAGES.map((stageItem, index) => {
              const isPast = CROP_STAGES.findIndex(s => s.id === stage) > index;
              const isCurrent = stageItem.id === stage;
              
              return (
                <div 
                  key={stageItem.id}
                  className={`
                    flex-shrink-0 px-4 py-3 rounded-xl text-center min-w-[80px]
                    ${isCurrent 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : isPast 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  <span className="text-2xl block mb-1">{stageItem.icon}</span>
                  <span className="text-sm font-medium">{stageItem.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lời khuyên theo giai đoạn */}
        <StageAdvice stage={stage} />
      </div>
    </Card>
  );
};

// Info Item Component
const InfoItem = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-lg">
    <span className="text-lg text-gray-600">{label}:</span>
    <span className={`text-lg font-bold ${highlight ? 'text-primary-600' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

// Stage Advice Component
const StageAdvice = ({ stage }) => {
  const advices = {
    'nảy_mầm': 'Giữ ruộng ẩm, không để ngập nước. Chú ý chuột và chim.',
    'mạ': 'Bón thúc đạm lần 1. Theo dõi sâu đục thân, rầy nâu.',
    'đẻ_nhánh': 'Bón thúc NPK. Giữ mực nước 3-5cm. Phòng ngừa đạo ôn.',
    'làm_đòng': 'Bón kali. Tăng mực nước. Đây là giai đoạn quan trọng nhất!',
    'trổ_bông': 'Giữ nước ổn định. Phòng ngừa bệnh lem lép hạt.',
    'chín': 'Tháo nước dần. Chuẩn bị thu hoạch khi lúa chín 85%.',
    'thu_hoạch': 'Thu hoạch khi độ ẩm hạt 20-22%. Tránh gặp mưa.'
  };

  const advice = advices[stage];
  if (!advice) return null;

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-semibold text-blue-800 text-lg">Lời khuyên:</p>
          <p className="text-blue-700 text-lg mt-1">{advice}</p>
        </div>
      </div>
    </div>
  );
};

export default CropProgressCard;
