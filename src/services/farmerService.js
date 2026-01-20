/**
 * Farmer Service - Quản lý thông tin nông dân
 */

import { apiClient } from '../api/client';

export const farmerService = {
  /**
   * Đăng ký nông dân mới (Public)
   * POST /api/farmer/register
   */
  async register(farmerData) {
    const payload = {
      name: farmerData.name,
      phone: farmerData.phone,
      province: farmerData.province,
      district: farmerData.district,
      village: farmerData.village,
      cropType: farmerData.cropType || 'RICE_OM18',
      fieldSize: farmerData.fieldSize || 0,
      location: {
        lat: farmerData.lat || 0,
        lng: farmerData.lng || 0
      }
    };

    const response = await apiClient.publicRequest('/api/farmer/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Lưu thông tin vào localStorage
    if (response.success && response.data) {
      localStorage.setItem('farmerId', response.data.farmerId);
      localStorage.setItem('farmerName', response.data.name);
      localStorage.setItem('sessionToken', response.data.sessionToken);
      localStorage.setItem('location', `${farmerData.province}#${farmerData.district}`);
    }

    return response;
  },

  /**
   * Lấy thông tin nông dân (Protected)
   * GET /api/farmer/{farmerId}
   */
  async getProfile(farmerId = null) {
    const id = farmerId || localStorage.getItem('farmerId');
    if (!id) throw new Error('Không tìm thấy thông tin nông dân');
    
    return apiClient.protectedRequest(`/api/farmer/${id}`);
  },

  /**
   * Cập nhật thông tin nông dân (Authenticated)
   * PUT /api/farmer/{farmerId}
   */
  async updateProfile(farmerData) {
    const farmerId = localStorage.getItem('farmerId');
    if (!farmerId) throw new Error('Vui lòng đăng nhập');

    return apiClient.authenticatedRequest(`/api/farmer/${farmerId}`, {
      method: 'PUT',
      body: JSON.stringify(farmerData)
    });
  },

  /**
   * Cập nhật vị trí GPS
   * PUT /api/farmer/{farmerId}/location
   */
  async updateLocation(lat, lng) {
    const farmerId = localStorage.getItem('farmerId');
    if (!farmerId) throw new Error('Vui lòng đăng nhập');

    return apiClient.authenticatedRequest(`/api/farmer/${farmerId}/location`, {
      method: 'PUT',
      body: JSON.stringify({ lat, lng })
    });
  },

  /**
   * Kiểm tra đăng nhập
   */
  isLoggedIn() {
    return !!localStorage.getItem('farmerId') && !!localStorage.getItem('sessionToken');
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem('farmerId');
    localStorage.removeItem('farmerName');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('chatSessionId');
  },

  /**
   * Lấy thông tin đã lưu
   */
  getStoredInfo() {
    return {
      farmerId: localStorage.getItem('farmerId'),
      farmerName: localStorage.getItem('farmerName'),
      location: localStorage.getItem('location'),
      cropType: localStorage.getItem('cropType')
    };
  }
};

export default farmerService;
