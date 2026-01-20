# 🚀 FarmRay Frontend Quick Start Guide

> **Quick integration guide for Frontend developers**

---

## ⚡ TL;DR - 5 Minutes Setup

### 1. Environment Setup
```javascript
// .env.local
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_KEY=farmray-dev-key-2026
```

### 2. API Client Setup
```javascript
// src/api/client.js
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const apiClient = {
  // Public endpoint (no auth)
  async publicRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return response.json();
  },
  
  // Protected endpoint (API key required)
  async protectedRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        ...options.headers
      }
    });
    return response.json();
  },
  
  // Personal data access (API key + session token)
  async authenticatedRequest(endpoint, options = {}) {
    const sessionToken = localStorage.getItem('sessionToken');
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-Session-Token': sessionToken,
        ...options.headers
      }
    });
    return response.json();
  }
};
```

---

## 📱 Common Use Cases

### Use Case 1: Chat with AI
```javascript
// src/services/chatService.js
import { apiClient } from '../api/client';

export const chatService = {
  async sendMessage(message) {
    const farmerId = localStorage.getItem('farmerId');
    const sessionId = localStorage.getItem('sessionId') || `session_${Date.now()}`;
    
    const response = await apiClient.publicRequest('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        farmerId,
        userMessage: message,
        sessionId,
        currentCropType: localStorage.getItem('cropType'),
        location: localStorage.getItem('location')
      })
    });
    
    // Save sessionId for future messages
    if (response.success && response.data.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);
    }
    
    return response.data;
  },
  
  async getChatHistory(farmerId) {
    const response = await apiClient.publicRequest(`/api/chat/history/${farmerId}`);
    return response.data;
  },
  
  async getTodayChats(farmerId) {
    const response = await apiClient.publicRequest(`/api/chat/history/${farmerId}/today`);
    return response.data;
  },
  
  async markAsHelpful(farmerId, timestamp) {
    const response = await apiClient.publicRequest(
      `/api/chat/helpful/${farmerId}/${timestamp}`,
      { method: 'PUT' }
    );
    return response;
  }
};
```

### Example React Component
```jsx
// src/components/ChatBox.jsx
import React, { useState } from 'react';
import { chatService } from '../services/chatService';

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      type: 'user',
      content: message
    }]);
    
    try {
      const response = await chatService.sendMessage(message);
      
      // Add AI response to UI
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.aiResponse,
        intent: response.intent,
        keywords: response.keywords
      }]);
      
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      alert('Lỗi khi gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <p>{msg.content}</p>
            {msg.keywords && (
              <div className="keywords">
                {msg.keywords.map(k => <span key={k}>{k}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hỏi AI về canh tác..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
```

---

### Use Case 2: Register Farmer
```javascript
// src/services/farmerService.js
import { apiClient } from '../api/client';

export const farmerService = {
  async register(farmerData) {
    const response = await apiClient.publicRequest('/api/farmer/register', {
      method: 'POST',
      body: JSON.stringify(farmerData)
    });
    
    if (response.success) {
      // Store authentication data
      localStorage.setItem('farmerId', response.data.farmerId);
      localStorage.setItem('sessionToken', response.data.sessionToken);
      localStorage.setItem('farmerName', response.data.farmerName);
    }
    
    return response;
  },
  
  async getProfile(farmerId) {
    const response = await apiClient.authenticatedRequest(`/api/farmer/${farmerId}`);
    return response.data;
  },
  
  async updateProfile(farmerId, updates) {
    const response = await apiClient.authenticatedRequest(`/api/farmer/${farmerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.data;
  }
};
```

### Example Registration Form
```jsx
// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { farmerService } from '../services/farmerService';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmerName: '',
    phoneNumber: '',
    province: 'An Giang',
    ward: '',
    cropType: 'RICE_OM18',
    farmArea: 0
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await farmerService.register(formData);
      
      if (response.success) {
        alert('Đăng ký thành công!');
        navigate('/dashboard');
      } else {
        alert('Đăng ký thất bại: ' + response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Lỗi khi đăng ký');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Họ tên"
        value={formData.farmerName}
        onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
        required
      />
      
      <input
        type="tel"
        placeholder="Số điện thoại"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
        required
      />
      
      <select
        value={formData.province}
        onChange={(e) => setFormData({...formData, province: e.target.value})}
      >
        <option value="An Giang">An Giang</option>
        <option value="Đồng Tháp">Đồng Tháp</option>
        <option value="Cần Thơ">Cần Thơ</option>
      </select>
      
      <input
        type="text"
        placeholder="Xã/Phường"
        value={formData.ward}
        onChange={(e) => setFormData({...formData, ward: e.target.value})}
        required
      />
      
      <select
        value={formData.cropType}
        onChange={(e) => setFormData({...formData, cropType: e.target.value})}
      >
        <option value="RICE_OM18">Lúa OM 18</option>
        <option value="RICE_ST25">Lúa ST25</option>
        <option value="RICE_JASMINE">Lúa Jasmine</option>
      </select>
      
      <input
        type="number"
        step="0.1"
        placeholder="Diện tích (hecta)"
        value={formData.farmArea}
        onChange={(e) => setFormData({...formData, farmArea: parseFloat(e.target.value)})}
        required
      />
      
      <button type="submit">Đăng ký</button>
    </form>
  );
}

export default RegisterForm;
```

---

### Use Case 3: Display Weather
```javascript
// src/services/weatherService.js
import { apiClient } from '../api/client';

export const weatherService = {
  async getCurrentWeather(province, ward) {
    const response = await apiClient.publicRequest(
      `/api/weather/${province}/${ward}`
    );
    return response.data;
  },
  
  async getForecast(province, ward, days = 7) {
    const response = await apiClient.publicRequest(
      `/api/weather/${province}/${ward}/forecast?days=${days}`
    );
    return response.data;
  }
};
```

### Weather Widget Component
```jsx
// src/components/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';

function WeatherWidget({ province, ward }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadWeather();
  }, [province, ward]);
  
  const loadWeather = async () => {
    try {
      const data = await weatherService.getCurrentWeather(province, ward);
      setWeather(data);
    } catch (error) {
      console.error('Weather error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Đang tải thời tiết...</div>;
  if (!weather) return <div>Không có dữ liệu thời tiết</div>;
  
  return (
    <div className="weather-widget">
      <h3>Thời tiết {weather.wardName}, {weather.provinceName}</h3>
      <div className="weather-main">
        <div className="temperature">{weather.temperature}°C</div>
        <div className="condition">{weather.weatherDescription}</div>
      </div>
      
      <div className="weather-details">
        <div>💧 Độ ẩm: {weather.humidity}%</div>
        <div>🌧️ Lượng mưa: {weather.rainfall || 0} mm</div>
        <div>💨 Gió: {weather.windSpeed} m/s {weather.windDirectionName}</div>
        <div>☀️ UV Index: {weather.uvIndex}</div>
      </div>
      
      {weather.rainfall24h > 50 && (
        <div className="alert">
          ⚠️ Đã mưa {weather.rainfall24h} mm trong 24h qua
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
```

---

### Use Case 4: Crop Cycle Tracker
```javascript
// src/services/cropCycleService.js
import { apiClient } from '../api/client';

export const cropCycleService = {
  async create(cycleData) {
    const response = await apiClient.protectedRequest('/api/cropcycle', {
      method: 'POST',
      body: JSON.stringify(cycleData)
    });
    return response.data;
  },
  
  async getActiveCycle(farmerId) {
    const response = await apiClient.protectedRequest(
      `/api/cropcycle/farmer/${farmerId}/active`
    );
    return response.data;
  },
  
  async updateStage(farmerId, startDate, newStage, notes) {
    const response = await apiClient.protectedRequest(
      `/api/cropcycle/${farmerId}/${startDate}/stage`,
      {
        method: 'PUT',
        body: JSON.stringify({ currentStage: newStage, notes })
      }
    );
    return response.data;
  },
  
  async completeCycle(farmerId, startDate, actualEndDate, actualYield) {
    const response = await apiClient.protectedRequest(
      `/api/cropcycle/${farmerId}/${startDate}/complete`,
      {
        method: 'PUT',
        body: JSON.stringify({ actualEndDate, actualYield })
      }
    );
    return response.data;
  }
};
```

### Crop Cycle Tracker Component
```jsx
// src/components/CropCycleTracker.jsx
import React, { useState, useEffect } from 'react';
import { cropCycleService } from '../services/cropCycleService';

const STAGES = [
  { id: 'gieo_mạ', name: 'Gieo mạ', days: '0-20' },
  { id: 'cấy', name: 'Cấy', days: '20-25' },
  { id: 'đẻ_nhánh', name: 'Đẻ nhánh', days: '25-45' },
  { id: 'làm_đòng', name: 'Làm đòng', days: '45-60' },
  { id: 'trổ_bông', name: 'Trổ bông', days: '60-75' },
  { id: 'chín', name: 'Chín', days: '75-90' },
  { id: 'thu_hoạch', name: 'Thu hoạch', days: '90+' }
];

function CropCycleTracker() {
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const farmerId = localStorage.getItem('farmerId');
  
  useEffect(() => {
    loadActiveCycle();
  }, []);
  
  const loadActiveCycle = async () => {
    try {
      const data = await cropCycleService.getActiveCycle(farmerId);
      setCycle(data);
    } catch (error) {
      console.error('Crop cycle error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStageChange = async (newStage) => {
    try {
      await cropCycleService.updateStage(
        cycle.farmerId,
        cycle.startDate,
        newStage,
        `Chuyển sang giai đoạn ${newStage}`
      );
      loadActiveCycle(); // Reload
    } catch (error) {
      console.error('Update stage error:', error);
      alert('Lỗi khi cập nhật giai đoạn');
    }
  };
  
  if (loading) return <div>Đang tải...</div>;
  if (!cycle) return <div>Chưa có chu kỳ canh tác nào</div>;
  
  const currentStageIndex = STAGES.findIndex(s => s.id === cycle.currentStage);
  
  return (
    <div className="crop-cycle-tracker">
      <h2>Chu Kỳ Canh Tác</h2>
      
      <div className="cycle-info">
        <div>Loại cây: {cycle.cropType}</div>
        <div>Mùa vụ: {cycle.season}</div>
        <div>Bắt đầu: {cycle.startDate}</div>
        <div>Diện tích: {cycle.farmArea} ha</div>
      </div>
      
      <div className="stage-progress">
        {STAGES.map((stage, idx) => (
          <div
            key={stage.id}
            className={`stage ${idx <= currentStageIndex ? 'completed' : ''} ${stage.id === cycle.currentStage ? 'current' : ''}`}
          >
            <div className="stage-name">{stage.name}</div>
            <div className="stage-days">{stage.days} ngày</div>
            {stage.id !== cycle.currentStage && idx > currentStageIndex && (
              <button onClick={() => handleStageChange(stage.id)}>
                Chuyển giai đoạn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CropCycleTracker;
```

---

### Use Case 5: Disease Alerts
```javascript
// src/services/diseaseService.js
import { apiClient } from '../api/client';

export const diseaseService = {
  async getAlerts(farmerId) {
    const response = await apiClient.protectedRequest(
      `/api/disease/alerts/${farmerId}`
    );
    return response.data;
  },
  
  async getUnreadAlerts(farmerId) {
    const response = await apiClient.protectedRequest(
      `/api/disease/alerts/${farmerId}/unread`
    );
    return response.data;
  },
  
  async markAsRead(farmerId, alertTimestamp) {
    const response = await apiClient.protectedRequest(
      `/api/disease/alerts/${farmerId}/${alertTimestamp}/read`,
      { method: 'PUT' }
    );
    return response;
  },
  
  async resolveAlert(farmerId, alertTimestamp) {
    const response = await apiClient.protectedRequest(
      `/api/disease/alerts/${farmerId}/${alertTimestamp}/resolve`,
      { method: 'PUT' }
    );
    return response;
  }
};
```

### Disease Alerts Component
```jsx
// src/components/DiseaseAlerts.jsx
import React, { useState, useEffect } from 'react';
import { diseaseService } from '../services/diseaseService';

function DiseaseAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const farmerId = localStorage.getItem('farmerId');
  
  useEffect(() => {
    loadAlerts();
  }, []);
  
  const loadAlerts = async () => {
    try {
      const data = await diseaseService.getAlerts(farmerId);
      setAlerts(data);
    } catch (error) {
      console.error('Disease alerts error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMarkRead = async (alertTimestamp) => {
    try {
      await diseaseService.markAsRead(farmerId, alertTimestamp);
      loadAlerts(); // Reload
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };
  
  const handleResolve = async (alertTimestamp) => {
    try {
      await diseaseService.resolveAlert(farmerId, alertTimestamp);
      loadAlerts(); // Reload
    } catch (error) {
      console.error('Resolve error:', error);
    }
  };
  
  const getSeverityColor = (level) => {
    const colors = {
      'LOW': '#4caf50',
      'MEDIUM': '#ff9800',
      'HIGH': '#f44336',
      'CRITICAL': '#9c27b0'
    };
    return colors[level] || '#999';
  };
  
  if (loading) return <div>Đang tải cảnh báo...</div>;
  
  return (
    <div className="disease-alerts">
      <h2>Cảnh Báo Dịch Bệnh ({alerts.length})</h2>
      
      {alerts.length === 0 && (
        <div className="no-alerts">✅ Không có cảnh báo dịch bệnh</div>
      )}
      
      {alerts.map((alert) => (
        <div
          key={alert.alertId}
          className={`alert-card ${alert.isRead ? 'read' : 'unread'}`}
          style={{ borderLeft: `4px solid ${getSeverityColor(alert.severityLevel)}` }}
        >
          <div className="alert-header">
            <h3>{alert.diseaseName}</h3>
            <span className="severity" style={{ color: getSeverityColor(alert.severityLevel) }}>
              {alert.severityLevel}
            </span>
          </div>
          
          <p className="description">{alert.description}</p>
          
          <div className="symptoms">
            <strong>Triệu chứng:</strong>
            <ul>
              {alert.symptoms.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
          
          <div className="recommendations">
            <strong>Khuyến nghị:</strong>
            <ul>
              {alert.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
          </div>
          
          <div className="alert-footer">
            <div>📍 {alert.ward}, {alert.province}</div>
            <div>⚠️ Nguy cơ: {(alert.riskScore * 100).toFixed(0)}%</div>
            
            {!alert.isRead && (
              <button onClick={() => handleMarkRead(alert.alertTimestamp)}>
                Đánh dấu đã đọc
              </button>
            )}
            
            {!alert.isResolved && (
              <button onClick={() => handleResolve(alert.alertTimestamp)}>
                Đã xử lý
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DiseaseAlerts;
```

---

## 🎨 TypeScript Interfaces

### Core Types
```typescript
// src/types/index.ts

export interface Farmer {
  farmerId: string;
  farmerName: string;
  phoneNumber: string;
  email?: string;
  province: string;
  ward: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  cropType?: CropType;
  farmArea?: number;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CropCycle {
  farmerId: string;
  startDate: string;
  cycleId: string;
  cropType: CropType;
  season: Season;
  currentStage: CropStage;
  endDate: string;
  actualEndDate?: string;
  farmArea: number;
  expectedYield?: number;
  actualYield?: number;
  province: string;
  ward: string;
  isActive: boolean;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  locationId: string;
  timestamp: string;
  provinceName: string;
  wardName: string;
  temperature: number;
  humidity: number;
  rainfall?: number;
  rainfall24h?: number;
  windSpeed?: number;
  windDirection?: number;
  windDirectionName?: string;
  pressure?: number;
  uvIndex?: number;
  weatherCondition: WeatherCondition;
  weatherDescription?: string;
}

export interface DiseaseAlert {
  alertId: string;
  farmerId: string;
  alertTimestamp: string;
  diseaseType: DiseaseType;
  diseaseName: string;
  severityLevel: SeverityLevel;
  province: string;
  ward: string;
  description: string;
  symptoms: string[];
  recommendations: string[];
  riskScore?: number;
  isRead: boolean;
  isResolved: boolean;
}

export interface ChatMessage {
  messageId: string;
  farmerId: string;
  timestamp: string;
  sessionId: string;
  userMessage: string;
  aiResponse: string;
  intent?: Intent;
  confidenceScore?: number;
  keywords?: string[];
  relatedTopics?: string[];
  isHelpful?: boolean;
  rating?: number;
}

export type CropType = 
  | "RICE_OM18" 
  | "RICE_ST25" 
  | "RICE_JASMINE" 
  | "RICE_IR50404" 
  | "CORN" 
  | "VEGETABLE" 
  | "OTHER";

export type Season = "Đông Xuân" | "Hè Thu" | "Thu Đông";

export type CropStage = 
  | "gieo_mạ" 
  | "cấy" 
  | "đẻ_nhánh" 
  | "làm_đòng" 
  | "trổ_bông" 
  | "chín" 
  | "thu_hoạch";

export type WeatherCondition = 
  | "CLEAR" 
  | "PARTLY_CLOUDY" 
  | "CLOUDY" 
  | "RAIN" 
  | "HEAVY_RAIN" 
  | "THUNDERSTORM" 
  | "FOG" 
  | "WINDY";

export type DiseaseType = "FUNGAL" | "BACTERIAL" | "VIRAL" | "PEST" | "NUTRIENT";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Intent = 
  | "DISEASE_INQUIRY" 
  | "FERTILIZER_INQUIRY" 
  | "PESTICIDE_INQUIRY" 
  | "WEATHER_INQUIRY" 
  | "CULTIVATION_ADVICE" 
  | "GENERAL_INQUIRY";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
}
```

---

## 🔒 Authentication Flow

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { farmerService } from '../services/farmerService';

interface AuthContextType {
  farmerId: string | null;
  sessionToken: string | null;
  farmerName: string | null;
  isAuthenticated: boolean;
  login: (farmerId: string, sessionToken: string, farmerName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [farmerName, setFarmerName] = useState<string | null>(null);
  
  useEffect(() => {
    // Load from localStorage on mount
    const storedFarmerId = localStorage.getItem('farmerId');
    const storedToken = localStorage.getItem('sessionToken');
    const storedName = localStorage.getItem('farmerName');
    
    if (storedFarmerId && storedToken) {
      setFarmerId(storedFarmerId);
      setSessionToken(storedToken);
      setFarmerName(storedName);
    }
  }, []);
  
  const login = (farmerId: string, sessionToken: string, farmerName: string) => {
    localStorage.setItem('farmerId', farmerId);
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('farmerName', farmerName);
    
    setFarmerId(farmerId);
    setSessionToken(sessionToken);
    setFarmerName(farmerName);
  };
  
  const logout = () => {
    localStorage.removeItem('farmerId');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('farmerName');
    
    setFarmerId(null);
    setSessionToken(null);
    setFarmerName(null);
  };
  
  const isAuthenticated = !!farmerId && !!sessionToken;
  
  return (
    <AuthContext.Provider value={{ 
      farmerId, 
      sessionToken, 
      farmerName, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## ✅ Testing Checklist

### Before Integration
- [ ] Backend is running on `http://localhost:8080`
- [ ] AI Service is running on `http://localhost:8000`
- [ ] Health check endpoint works: `GET /actuator/health`
- [ ] API key is configured: `farmray-dev-key-2026`

### After Integration
- [ ] Chat functionality works
- [ ] Messages are saved to DynamoDB
- [ ] AI responses are relevant
- [ ] Weather widget displays correctly
- [ ] Crop cycle tracker updates stages
- [ ] Disease alerts show up
- [ ] Error handling works (404, 500, etc.)

---

## 🐛 Troubleshooting

### Issue: CORS Error
```
Access to fetch at 'http://localhost:8080' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:** Backend đã cấu hình CORS cho `localhost:3000`. Kiểm tra lại URL trong `.env`

---

### Issue: 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or missing API key"
}
```

**Solution:** Thêm header `X-API-Key: farmray-dev-key-2026`

---

### Issue: 503 Service Unavailable
```json
{
  "success": false,
  "message": "AI service is unavailable"
}
```

**Solution:** Kiểm tra AI service (Python FastAPI) có đang chạy không

---

## 📞 Support

- **Backend Issues:** Check logs in terminal
- **API Questions:** See `FRONTEND_API_DOCUMENTATION.md`
- **Integration Help:** Contact backend team

---

## 🎯 Next Steps

1. ✅ Setup API client
2. ✅ Implement chat feature
3. 🚧 Implement farmer registration
4. 🚧 Implement crop cycle tracker
5. 🚧 Implement weather widget
6. 🚧 Implement disease alerts
7. 🚧 Add real-time notifications

---

**Happy Coding! 🚀**

