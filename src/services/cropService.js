/**
 * Crop Cycle Service - Quản lý vụ mùa
 */

import { apiClient } from '../api/client';

export const cropService = {
  /**
   * Tạo vụ mùa mới
   * POST /api/cropcycle
   */
  async createCropCycle(cropData) {
    const farmerId = localStorage.getItem('farmerId');
    
    const payload = {
      farmerId,
      cropType: cropData.cropType,
      riceSeedType: cropData.riceSeedType,
      season: cropData.season,
      sowingDate: cropData.sowingDate,
      expectedHarvestDate: cropData.expectedHarvestDate,
      fieldSize: cropData.fieldSize,
      location: {
        lat: cropData.lat,
        lng: cropData.lng
      },
      notes: cropData.notes || ''
    };

    const response = await apiClient.protectedRequest('/api/cropcycle', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Lưu thông tin vụ mùa hiện tại
    if (response.success && response.data) {
      localStorage.setItem('currentCropId', response.data.cropCycleId);
      localStorage.setItem('cropType', cropData.cropType);
    }

    return response;
  },

  /**
   * Lấy danh sách vụ mùa của nông dân
   * GET /api/cropcycle/farmer/{farmerId}
   */
  async getCropCycles(farmerId = null) {
    const id = farmerId || localStorage.getItem('farmerId');
    return apiClient.protectedRequest(`/api/cropcycle/farmer/${id}`);
  },

  /**
   * Lấy chi tiết vụ mùa
   * GET /api/cropcycle/{cropCycleId}
   */
  async getCropCycleDetail(cropCycleId = null) {
    const id = cropCycleId || localStorage.getItem('currentCropId');
    return apiClient.protectedRequest(`/api/cropcycle/${id}`);
  },

  /**
   * Cập nhật giai đoạn vụ mùa
   * PUT /api/cropcycle/{cropCycleId}/stage
   */
  async updateStage(stage, notes = '', cropCycleId = null) {
    const id = cropCycleId || localStorage.getItem('currentCropId');
    
    return apiClient.protectedRequest(`/api/cropcycle/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage, notes, updatedAt: new Date().toISOString() })
    });
  },

  /**
   * Ghi nhận hoạt động (bón phân, phun thuốc, tưới nước...)
   * POST /api/cropcycle/{cropCycleId}/activity
   */
  async logActivity(activity, cropCycleId = null) {
    const id = cropCycleId || localStorage.getItem('currentCropId');
    
    const payload = {
      activityType: activity.type,
      description: activity.description,
      quantity: activity.quantity || null,
      unit: activity.unit || null,
      cost: activity.cost || 0,
      date: activity.date || new Date().toISOString(),
      notes: activity.notes || ''
    };

    return apiClient.protectedRequest(`/api/cropcycle/${id}/activity`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Lấy lịch sử hoạt động
   * GET /api/cropcycle/{cropCycleId}/activities
   */
  async getActivities(cropCycleId = null) {
    const id = cropCycleId || localStorage.getItem('currentCropId');
    return apiClient.protectedRequest(`/api/cropcycle/${id}/activities`);
  },

  /**
   * Đánh dấu thu hoạch xong
   * PUT /api/cropcycle/{cropCycleId}/harvest
   */
  async markHarvested(harvestData, cropCycleId = null) {
    const id = cropCycleId || localStorage.getItem('currentCropId');
    
    const payload = {
      actualHarvestDate: harvestData.date || new Date().toISOString(),
      yield: harvestData.yield,
      yieldUnit: harvestData.unit || 'kg',
      quality: harvestData.quality || 'good',
      notes: harvestData.notes || ''
    };

    return apiClient.protectedRequest(`/api/cropcycle/${id}/harvest`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  /**
   * Xóa vụ mùa
   * DELETE /api/cropcycle/{cropCycleId}
   */
  async deleteCropCycle(cropCycleId) {
    return apiClient.authenticatedRequest(`/api/cropcycle/${cropCycleId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Tính toán giai đoạn hiện tại dựa trên ngày sạ
   */
  calculateCurrentStage(sowingDate) {
    const sowing = new Date(sowingDate);
    const today = new Date();
    const daysPassed = Math.floor((today - sowing) / (1000 * 60 * 60 * 24));

    // Các giai đoạn lúa (tính theo ngày)
    if (daysPassed < 0) return { stage: 'chuẩn_bị', day: 0, progress: 0 };
    if (daysPassed <= 10) return { stage: 'nảy_mầm', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    if (daysPassed <= 25) return { stage: 'mạ', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    if (daysPassed <= 50) return { stage: 'đẻ_nhánh', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    if (daysPassed <= 65) return { stage: 'làm_đòng', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    if (daysPassed <= 80) return { stage: 'trổ_bông', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    if (daysPassed <= 90) return { stage: 'chín', day: daysPassed, progress: Math.round((daysPassed / 90) * 100) };
    return { stage: 'thu_hoạch', day: daysPassed, progress: 100 };
  }
};

// Constants
export const CROP_TYPES = [
  { id: 'RICE_OM18', name: 'Lúa OM18', icon: '🌾' },
  { id: 'RICE_IR504', name: 'Lúa IR504', icon: '🌾' },
  { id: 'RICE_ST24', name: 'Lúa ST24', icon: '🌾' },
  { id: 'RICE_ST25', name: 'Lúa ST25', icon: '🌾' },
  { id: 'RICE_JASMINE', name: 'Lúa Jasmine', icon: '🌾' },
  { id: 'RICE_OTHER', name: 'Lúa khác', icon: '🌾' }
];

export const CROP_STAGES = [
  { id: 'chuẩn_bị', name: 'Chuẩn bị', icon: '🌱', days: '0' },
  { id: 'nảy_mầm', name: 'Nảy mầm', icon: '🌱', days: '1-10' },
  { id: 'mạ', name: 'Mạ', icon: '🌿', days: '11-25' },
  { id: 'đẻ_nhánh', name: 'Đẻ nhánh', icon: '🌿', days: '26-50' },
  { id: 'làm_đòng', name: 'Làm đòng', icon: '🌾', days: '51-65' },
  { id: 'trổ_bông', name: 'Trổ bông', icon: '🌾', days: '66-80' },
  { id: 'chín', name: 'Chín', icon: '🌾', days: '81-90' },
  { id: 'thu_hoạch', name: 'Thu hoạch', icon: '🎉', days: '90+' }
];

export const SEASONS = [
  { id: 'dong_xuan', name: 'Đông Xuân', months: 'Tháng 11 - Tháng 2' },
  { id: 'he_thu', name: 'Hè Thu', months: 'Tháng 4 - Tháng 8' },
  { id: 'mua', name: 'Vụ Mùa', months: 'Tháng 6 - Tháng 11' }
];

export const ACTIVITY_TYPES = [
  { id: 'fertilize', name: 'Bón phân', icon: '🧪' },
  { id: 'spray', name: 'Phun thuốc', icon: '💊' },
  { id: 'water', name: 'Tưới nước', icon: '💧' },
  { id: 'weed', name: 'Làm cỏ', icon: '🌿' },
  { id: 'inspect', name: 'Kiểm tra', icon: '🔍' },
  { id: 'other', name: 'Khác', icon: '📝' }
];

export default cropService;
