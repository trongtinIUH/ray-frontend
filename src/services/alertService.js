/**
 * Alert Service - Cảnh báo dịch bệnh & sâu bệnh
 */

import { apiClient } from '../api/client';

export const alertService = {
  /**
   * Lấy danh sách cảnh báo theo vị trí
   * GET /api/alerts?lat={lat}&lng={lng}&radius={radius}
   */
  async getAlertsByLocation(lat, lng, radius = 10) {
    return apiClient.publicRequest(`/api/alerts?lat=${lat}&lng=${lng}&radius=${radius}`);
  },

  /**
   * Lấy danh sách cảnh báo theo tỉnh
   * GET /api/alerts/province/{province}
   */
  async getAlertsByProvince(province) {
    return apiClient.publicRequest(`/api/alerts/province/${encodeURIComponent(province)}`);
  },

  /**
   * Lấy chi tiết cảnh báo
   * GET /api/alerts/{alertId}
   */
  async getAlertDetail(alertId) {
    return apiClient.publicRequest(`/api/alerts/${alertId}`);
  },

  /**
   * Báo cáo dịch bệnh mới (từ nông dân)
   * POST /api/alerts/report
   */
  async reportDisease(reportData) {
    const farmerId = localStorage.getItem('farmerId');
    
    const payload = {
      farmerId,
      diseaseType: reportData.diseaseType,
      severity: reportData.severity, // 'low', 'medium', 'high', 'critical'
      description: reportData.description,
      location: {
        lat: reportData.lat,
        lng: reportData.lng,
        province: reportData.province,
        district: reportData.district
      },
      cropType: reportData.cropType || localStorage.getItem('cropType'),
      imageUrl: reportData.imageUrl || null,
      reportedAt: new Date().toISOString()
    };

    return apiClient.protectedRequest('/api/alerts/report', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Đánh dấu đã đọc cảnh báo
   * PUT /api/alerts/{alertId}/read
   */
  async markAsRead(alertId) {
    return apiClient.protectedRequest(`/api/alerts/${alertId}/read`, {
      method: 'PUT'
    });
  },

  /**
   * Lấy cảnh báo chưa đọc
   * GET /api/alerts/unread/{farmerId}
   */
  async getUnreadAlerts(farmerId = null) {
    const id = farmerId || localStorage.getItem('farmerId');
    return apiClient.protectedRequest(`/api/alerts/unread/${id}`);
  },

  /**
   * Lấy thống kê cảnh báo theo thời gian
   * GET /api/alerts/stats?days={days}
   */
  async getAlertStats(days = 7) {
    return apiClient.publicRequest(`/api/alerts/stats?days=${days}`);
  },

  /**
   * Phân tích nguy cơ dựa trên vị trí và thời tiết
   * POST /api/alerts/analyze-risk
   */
  async analyzeRisk(data) {
    const payload = {
      lat: data.lat,
      lng: data.lng,
      cropType: data.cropType || localStorage.getItem('cropType'),
      cropStage: data.cropStage,
      weatherData: data.weatherData
    };

    return apiClient.protectedRequest('/api/alerts/analyze-risk', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

// Constants cho các loại cảnh báo
export const ALERT_TYPES = {
  DISEASE_OUTBREAK: 'disease_outbreak',   // Dịch bệnh bùng phát
  PEST_WARNING: 'pest_warning',           // Cảnh báo sâu rầy
  WEATHER_WARNING: 'weather_warning',     // Cảnh báo thời tiết
  FLOOD_RISK: 'flood_risk',               // Nguy cơ ngập úng
  DROUGHT_RISK: 'drought_risk'            // Nguy cơ hạn hán
};

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const COMMON_DISEASES = [
  { id: 'dao_on', name: 'Đạo ôn', icon: '🍂' },
  { id: 'bac_la', name: 'Bạc lá', icon: '🦠' },
  { id: 'sau_cuon_la', name: 'Sâu cuốn lá', icon: '🐛' },
  { id: 'ray_nau', name: 'Rầy nâu', icon: '🪲' },
  { id: 'vang_la', name: 'Vàng lá', icon: '🍃' },
  { id: 'lem_lep_hat', name: 'Lem lép hạt', icon: '🌾' },
  { id: 'kham_la', name: 'Khảm lá', icon: '🍁' },
  { id: 'sau_duc_than', name: 'Sâu đục thân', icon: '🐛' }
];

export default alertService;
