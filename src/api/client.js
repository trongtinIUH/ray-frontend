/**
 * FarmRay API Client
 * Hỗ trợ 3 cấp độ authentication:
 * 1. Public - Không cần auth
 * 2. Protected - Cần X-API-Key
 * 3. Authenticated - Cần X-API-Key + X-Session-Token
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_KEY = process.env.REACT_APP_API_KEY || 'farmray-dev-key-2026';

/**
 * Xử lý response từ API
 * Handle các trường hợp: JSON, empty response, non-JSON
 */
const handleResponse = async (response) => {
  // Lấy content-type để kiểm tra
  const contentType = response.headers.get('content-type');
  
  // Xử lý response rỗng hoặc non-JSON
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
  }
  
  if (!response.ok) {
    const error = new Error(data?.message || `Lỗi ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  // Trả về response thành công
  return data || { success: true };
};

/**
 * API Client chính
 */
export const apiClient = {
  /**
   * Public endpoint - Không cần authentication
   * Dùng cho: Chat, Weather, Registration
   */
  async publicRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  /**
   * Protected endpoint - Cần API Key
   * Dùng cho: Crop cycle, Disease alerts
   */
  async protectedRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-Key': API_KEY,
          ...options.headers
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  /**
   * Authenticated endpoint - Cần API Key + Session Token
   * Dùng cho: Personal data, Profile
   */
  async authenticatedRequest(endpoint, options = {}) {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (!sessionToken) {
      throw new Error('Vui lòng đăng nhập để tiếp tục');
    }
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-Key': API_KEY,
          'X-Session-Token': sessionToken,
          ...options.headers
        }
      });
      return handleResponse(response);
    } catch (error) {
      // Nếu token hết hạn, xóa và báo lỗi
      if (error.status === 401) {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('farmerId');
      }
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const sessionToken = localStorage.getItem('sessionToken');
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'X-API-Key': API_KEY,
          ...(sessionToken && { 'X-Session-Token': sessionToken })
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }
};

export default apiClient;
