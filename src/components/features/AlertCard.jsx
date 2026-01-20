import React from 'react';
import Card from '../common/Card';
import { getAlertColor } from '../../utils/formatHelper';

// Component hiển thị cảnh báo
const AlertCard = ({ alert }) => {
  if (!alert) return null;

  const { level, message, disease, treatment } = alert;

  const levelText = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    critical: 'Rất cao',
  };

  const levelIcon = {
    low: '✅',
    medium: '⚠️',
    high: '🔶',
    critical: '🚨',
  };

  return (
    <Card 
      title="Cảnh báo" 
      icon={levelIcon[level] || '⚠️'}
      bgColor={level === 'critical' ? 'bg-red-50' : level === 'high' ? 'bg-orange-50' : 'bg-yellow-50'}
      borderColor={level === 'critical' ? 'border-red-300' : level === 'high' ? 'border-orange-300' : 'border-yellow-300'}
    >
      <div className="space-y-4">
        {/* Mức độ */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">Mức độ:</span>
          <span className={`px-4 py-2 rounded-full text-xl font-bold ${getAlertColor(level)}`}>
            {levelText[level]}
          </span>
        </div>

        {/* Thông điệp */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <p className="text-xl leading-relaxed">{message}</p>
        </div>

        {/* Sâu bệnh (nếu có) */}
        {disease && (
          <div>
            <h3 className="text-xl font-bold mb-2">🐛 Loại sâu bệnh:</h3>
            <p className="text-lg bg-white p-3 rounded-lg border-2 border-gray-200">
              {disease}
            </p>
          </div>
        )}

        {/* Cách xử lý (nếu có) */}
        {treatment && treatment.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-2">💊 Thuốc đề xuất:</h3>
            <ul className="space-y-2">
              {treatment.map((drug, index) => (
                <li 
                  key={index}
                  className="bg-white p-3 rounded-lg border-2 border-green-200 text-lg flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span>
                  <span>{drug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertCard;
