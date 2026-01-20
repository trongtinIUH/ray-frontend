/**
 * Chat Service - Tích hợp AI ChatBot
 * Sử dụng 11 API endpoints từ Backend
 */

import { apiClient } from '../api/client';

// Lưu trữ session và farmer ID
const getStoredData = () => ({
  farmerId: localStorage.getItem('farmerId') || `farmer_${Date.now()}`,
  sessionId: localStorage.getItem('chatSessionId') || `session_${Date.now()}`,
  cropType: localStorage.getItem('cropType') || 'RICE_OM18',
  location: localStorage.getItem('location') || 'An Giang#Châu Phú'
});

export const chatService = {
  /**
   * 1.1 Gửi tin nhắn đến AI (Basic Chat)
   * POST /api/chat/send
   */
  async sendMessage(message, options = {}) {
    const { farmerId, sessionId, cropType, location } = getStoredData();
    
    const payload = {
      farmerId,
      userMessage: message,
      sessionId,
      messageType: options.messageType || 'TEXT',
      inputMethod: options.inputMethod || 'KEYBOARD',
      currentCropType: options.cropType || cropType,
      currentSeason: options.season || 'Đông Xuân',
      currentStage: options.stage || 'đẻ_nhánh',
      location: options.location || location,
      deviceInfo: navigator.userAgent,
      appVersion: '1.0.0'
    };

    const response = await apiClient.publicRequest('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    // Lưu lại sessionId và farmerId
    if (response.success && response.data) {
      localStorage.setItem('chatSessionId', response.data.sessionId);
      localStorage.setItem('farmerId', farmerId);
    }

    return response;
  },

  /**
   * 1.2 Gửi tin nhắn với Context đầy đủ
   * POST /api/chat/send-context
   */
  async sendMessageWithContext(message, context = {}) {
    const { farmerId, sessionId, cropType, location } = getStoredData();
    
    const payload = {
      farmerId,
      userMessage: message,
      sessionId,
      messageType: context.messageType || 'TEXT',
      inputMethod: context.inputMethod || 'KEYBOARD',
      currentCropType: context.cropType || cropType,
      currentSeason: context.season || 'Đông Xuân',
      currentStage: context.stage || 'đẻ_nhánh',
      location: context.location || location,
      // Context bổ sung
      weatherData: context.weatherData || null,
      recentAlerts: context.recentAlerts || [],
      previousMessages: context.previousMessages || [],
      deviceInfo: navigator.userAgent,
      appVersion: '1.0.0'
    };

    const response = await apiClient.publicRequest('/api/chat/send-context', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return response;
  },

  /**
   * 1.3 Lấy lịch sử chat của nông dân
   * GET /api/chat/history/{farmerId}
   */
  async getChatHistory(farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/history/${id}`);
  },

  /**
   * 1.4 Lấy chat hôm nay
   * GET /api/chat/history/{farmerId}/today
   */
  async getTodayChats(farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/history/${id}/today`);
  },

  /**
   * 1.5 Lấy tin nhắn theo session
   * GET /api/chat/session/{sessionId}
   */
  async getSessionMessages(sessionId = null) {
    const id = sessionId || getStoredData().sessionId;
    return apiClient.publicRequest(`/api/chat/session/${id}`);
  },

  /**
   * 1.6 Đánh dấu tin nhắn hữu ích
   * PUT /api/chat/helpful/{farmerId}/{timestamp}
   */
  async markAsHelpful(timestamp, farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/helpful/${id}/${timestamp}`, {
      method: 'PUT'
    });
  },

  /**
   * 1.7 Đánh dấu tin nhắn không hữu ích
   * PUT /api/chat/unhelpful/{farmerId}/{timestamp}
   */
  async markAsUnhelpful(timestamp, feedback = '', farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/unhelpful/${id}/${timestamp}`, {
      method: 'PUT',
      body: JSON.stringify({ feedback })
    });
  },

  /**
   * 1.8 Lấy thống kê chat
   * GET /api/chat/stats/{farmerId}
   */
  async getChatStats(farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/stats/${id}`);
  },

  /**
   * 1.9 Xóa lịch sử chat
   * DELETE /api/chat/history/{farmerId}
   */
  async clearChatHistory(farmerId = null) {
    const id = farmerId || getStoredData().farmerId;
    return apiClient.publicRequest(`/api/chat/history/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * 1.10 Lấy các chủ đề phổ biến
   * GET /api/chat/topics/popular
   */
  async getPopularTopics() {
    return apiClient.publicRequest('/api/chat/topics/popular');
  },

  /**
   * 1.11 Lấy gợi ý câu hỏi
   * GET /api/chat/suggestions/{cropType}
   */
  async getSuggestions(cropType = null) {
    const type = cropType || getStoredData().cropType;
    return apiClient.publicRequest(`/api/chat/suggestions/${type}`);
  },

  /**
   * Helper: Khởi tạo session mới
   */
  startNewSession() {
    const newSessionId = `session_${Date.now()}`;
    localStorage.setItem('chatSessionId', newSessionId);
    return newSessionId;
  },

  /**
   * Helper: Lưu thông tin nông dân
   */
  saveFarmerInfo(info) {
    if (info.farmerId) localStorage.setItem('farmerId', info.farmerId);
    if (info.cropType) localStorage.setItem('cropType', info.cropType);
    if (info.location) localStorage.setItem('location', info.location);
  }
};

export default chatService;
