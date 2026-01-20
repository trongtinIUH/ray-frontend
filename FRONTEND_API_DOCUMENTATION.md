# 📱 FarmRay API Documentation - Frontend Integration Guide

> **Version:** 1.0.0  
> **Last Updated:** 2026-01-15  
> **Backend:** Spring Boot 4.0.1 + Java 21  
> **AI Service:** Python FastAPI + OpenAI GPT-4o-mini  
> **Database:** AWS DynamoDB  

---

## 📋 Table of Contents

1. [Authentication & Security](#authentication--security)
2. [Base URLs & Configuration](#base-urls--configuration)
3. [API Endpoints](#api-endpoints)
   - [Chat & AI Service](#1-chat--ai-service)
   - [Farmer Management](#2-farmer-management)
   - [Crop Cycle Management](#3-crop-cycle-management)
   - [Weather Data](#4-weather-data)
   - [Disease Alerts](#5-disease-alerts)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Examples & Use Cases](#examples--use-cases)

---

## 🔐 Authentication & Security

FarmRay sử dụng **Multi-tier Security Strategy** với 3 cấp độ:

### 1. Public Endpoints (No Auth)
Không cần header gì cả:
- ✅ `GET /actuator/health` - Health check
- ✅ `GET /api/weather/**` - Thông tin thời tiết công khai
- ✅ `POST /api/farmer/register` - Đăng ký nông dân
- ✅ `POST /api/chat/**` - Chat với AI
- ✅ `GET /api/chat/**` - Lấy lịch sử chat

### 2. API Key Protected (Header Required)
Tất cả các endpoint còn lại yêu cầu:
```http
X-API-Key: farmray-dev-key-2026
```

### 3. Session Token (Application Level)
Để truy cập dữ liệu cá nhân, cần thêm:
```http
X-Session-Token: {token từ registration/login}
```

### Example Headers
```javascript
// Public endpoint
fetch('http://localhost:8080/api/chat/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Protected endpoint
fetch('http://localhost:8080/api/cropcycle/farmer123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'farmray-dev-key-2026'
  }
})

// Personal data access
fetch('http://localhost:8080/api/cropcycle/farmer123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'farmray-dev-key-2026',
    'X-Session-Token': 'user-session-token-here'
  }
})
```

---

## 🌐 Base URLs & Configuration

### Development
```
Backend API: http://localhost:8080
AI Service:  http://localhost:8000
```

### Production
```
Backend API: https://api.farmray.com
AI Service:  https://ai.farmray.com
```

### CORS Configuration
Backend đã cấu hình CORS cho:
- `http://localhost:3000` (React Dev)
- `https://farmray-frontend.vercel.app`
- `https://farmray.com`

---

## 📡 API Endpoints

---

## 1. Chat & AI Service

### 1.1 Send Message (Basic Chat)
**Endpoint:** `POST /api/chat/send`  
**Auth:** ❌ Public  
**Description:** Gửi tin nhắn và nhận AI response

**Request Body:**
```json
{
  "farmerId": "farmer_123",
  "userMessage": "Lúa của tôi bị vàng lá, phải làm sao?",
  "sessionId": "session_456",
  "messageType": "TEXT",
  "inputMethod": "KEYBOARD",
  "currentCropType": "RICE_OM18",
  "currentSeason": "Đông Xuân",
  "currentStage": "đẻ_nhánh",
  "location": "An Giang#Vĩnh Xương",
  "deviceInfo": "Android 13",
  "appVersion": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "msg_uuid_123",
    "sessionId": "session_456",
    "timestamp": "2026-01-15T10:30:00Z",
    "userMessage": "Lúa của tôi bị vàng lá, phải làm sao?",
    "aiResponse": "Vàng lá ở lúa có thể do nhiều nguyên nhân...",
    "intent": "DISEASE_INQUIRY",
    "confidenceScore": 0.85,
    "keywords": ["vàng lá", "bệnh"],
    "relatedTopics": ["vàng lá", "phân bón", "sâu bệnh"],
    "modelUsed": "gpt-4o-mini",
    "tokensUsed": 724
  },
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

### 1.2 Get Chat History
**Endpoint:** `GET /api/chat/history/{farmerId}`  
**Auth:** ❌ Public  
**Description:** Lấy toàn bộ chat history của farmer

**Response:**
```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "data": {
    "farmerId": "farmer_123",
    "totalMessages": 45,
    "messages": [
      {
        "messageId": "msg_uuid_123",
        "timestamp": "2026-01-15T10:30:00Z",
        "userMessage": "...",
        "aiResponse": "...",
        "intent": "DISEASE_INQUIRY",
        "isHelpful": true
      }
    ]
  }
}
```

---

### 1.3 Get Chat by Session
**Endpoint:** `GET /api/chat/history/{farmerId}/session/{sessionId}`  
**Auth:** ❌ Public

---

### 1.4 Get Today's Chats
**Endpoint:** `GET /api/chat/history/{farmerId}/today`  
**Auth:** ❌ Public

---

### 1.5 Get Latest Messages
**Endpoint:** `GET /api/chat/history/{farmerId}/latest?limit=10`  
**Auth:** ❌ Public  
**Query Params:** `limit` (default: 10)

---

### 1.6 Get Helpful Messages
**Endpoint:** `GET /api/chat/history/{farmerId}/helpful`  
**Auth:** ❌ Public  
**Description:** Lấy các tin nhắn được đánh giá hữu ích

---

### 1.7 Get Chat Stats
**Endpoint:** `GET /api/chat/stats/{farmerId}`  
**Auth:** ❌ Public

**Response:**
```json
{
  "success": true,
  "data": {
    "farmerId": "farmer_123",
    "totalMessages": 156,
    "totalSessions": 23,
    "averageMessagesPerSession": 6.78,
    "totalHelpfulMessages": 89,
    "helpfulPercentage": 57.05,
    "intentBreakdown": {
      "DISEASE_INQUIRY": 45,
      "FERTILIZER_INQUIRY": 32,
      "WEATHER_INQUIRY": 28,
      "CULTIVATION_ADVICE": 51
    },
    "mostActiveDay": "2026-01-10",
    "lastChatDate": "2026-01-15T10:30:00Z"
  }
}
```

---

### 1.8 Update Feedback
**Endpoint:** `PUT /api/chat/feedback`  
**Auth:** ❌ Public

**Request Body:**
```json
{
  "farmerId": "farmer_123",
  "timestamp": "2026-01-15T10:30:00Z",
  "isHelpful": true,
  "rating": 5,
  "feedback": "Rất hữu ích!"
}
```

---

### 1.9 Mark as Helpful
**Endpoint:** `PUT /api/chat/helpful/{farmerId}/{timestamp}`  
**Auth:** ❌ Public

---

### 1.10 Delete Message
**Endpoint:** `DELETE /api/chat/message/{farmerId}/{timestamp}`  
**Auth:** ❌ Public

---

### 1.11 Delete Session
**Endpoint:** `DELETE /api/chat/session/{farmerId}/{sessionId}`  
**Auth:** ❌ Public

---

## 2. Farmer Management

### 2.1 Register Farmer
**Endpoint:** `POST /api/farmer/register`  
**Auth:** ❌ Public  
**Status:** 🚧 To Be Implemented

**Expected Request Body:**
```json
{
  "farmerName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "email": "nguyenvana@example.com",
  "province": "An Giang",
  "ward": "Vĩnh Xương",
  "address": "123 Đường ABC",
  "latitude": 10.5,
  "longitude": 105.5,
  "cropType": "RICE_OM18",
  "farmArea": 2.5
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Farmer registered successfully",
  "data": {
    "farmerId": "farmer_uuid_123",
    "sessionToken": "session_token_abc",
    "farmerName": "Nguyễn Văn A",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

---

### 2.2 Get Farmer Profile
**Endpoint:** `GET /api/farmer/{farmerId}`  
**Auth:** ✅ API Key + Session Token  
**Status:** 🚧 To Be Implemented

---

### 2.3 Update Farmer Profile
**Endpoint:** `PUT /api/farmer/{farmerId}`  
**Auth:** ✅ API Key + Session Token  
**Status:** 🚧 To Be Implemented

---

## 3. Crop Cycle Management

### 3.1 Create Crop Cycle
**Endpoint:** `POST /api/cropcycle`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

**Expected Request Body:**
```json
{
  "farmerId": "farmer_123",
  "cropType": "RICE_OM18",
  "season": "Đông Xuân",
  "startDate": "2026-01-15",
  "endDate": "2026-05-15",
  "currentStage": "gieo_mạ",
  "farmArea": 2.5,
  "expectedYield": 7.5,
  "province": "An Giang",
  "ward": "Vĩnh Xương",
  "notes": "Chu kỳ mới"
}
```

---

### 3.2 Get Crop Cycles by Farmer
**Endpoint:** `GET /api/cropcycle/farmer/{farmerId}`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "cycleId": "cycle_123",
      "farmerId": "farmer_123",
      "cropType": "RICE_OM18",
      "season": "Đông Xuân",
      "startDate": "2026-01-15",
      "endDate": "2026-05-15",
      "currentStage": "đẻ_nhánh",
      "farmArea": 2.5,
      "isActive": true,
      "isCompleted": false
    }
  ]
}
```

---

### 3.3 Get Active Crop Cycle
**Endpoint:** `GET /api/cropcycle/farmer/{farmerId}/active`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

---

### 3.4 Update Crop Cycle Stage
**Endpoint:** `PUT /api/cropcycle/{farmerId}/{startDate}/stage`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

**Request Body:**
```json
{
  "currentStage": "làm_đòng",
  "notes": "Chuyển sang giai đoạn mới"
}
```

---

### 3.5 Complete Crop Cycle
**Endpoint:** `PUT /api/cropcycle/{farmerId}/{startDate}/complete`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

**Request Body:**
```json
{
  "actualEndDate": "2026-05-10",
  "actualYield": 8.2,
  "notes": "Hoàn thành tốt"
}
```

---

## 4. Weather Data

### 4.1 Get Current Weather
**Endpoint:** `GET /api/weather/{province}/{ward}`  
**Auth:** ❌ Public  
**Status:** 🚧 To Be Implemented

**Example:**
```
GET /api/weather/AnGiang/VinhXuong
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "locationId": "An Giang#Vĩnh Xương",
    "provinceName": "An Giang",
    "wardName": "Vĩnh Xương",
    "timestamp": "2026-01-15T10:30:00Z",
    "temperature": 28.5,
    "humidity": 85,
    "rainfall": 15.0,
    "rainfall24h": 35.0,
    "windSpeed": 5.2,
    "windDirection": 45,
    "windDirectionName": "Đông Bắc",
    "pressure": 1013,
    "uvIndex": 7.5,
    "weatherCondition": "PARTLY_CLOUDY",
    "weatherDescription": "Có mây, khả năng mưa rào"
  }
}
```

---

### 4.2 Get Weather Forecast
**Endpoint:** `GET /api/weather/{province}/{ward}/forecast?days=7`  
**Auth:** ❌ Public  
**Status:** 🚧 To Be Implemented

---

### 4.3 Get Weather History
**Endpoint:** `GET /api/weather/{province}/{ward}/history?from={date}&to={date}`  
**Auth:** ❌ Public  
**Status:** 🚧 To Be Implemented

---

## 5. Disease Alerts

### 5.1 Get Disease Alerts
**Endpoint:** `GET /api/disease/alerts/{farmerId}`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "alertId": "alert_123",
      "farmerId": "farmer_123",
      "alertTimestamp": "2026-01-15T10:30:00Z",
      "diseaseType": "FUNGAL",
      "diseaseName": "Đạo ôn lúa",
      "severityLevel": "HIGH",
      "province": "An Giang",
      "ward": "Vĩnh Xương",
      "description": "Phát hiện bệnh đạo ôn lúa trong khu vực",
      "symptoms": ["Vết bệnh hình thoi", "Màu nâu đỏ"],
      "recommendations": ["Phun thuốc Tricyclazole", "Tăng cường thoát nước"],
      "riskScore": 0.85,
      "isRead": false,
      "isResolved": false
    }
  ]
}
```

---

### 5.2 Get Unread Alerts
**Endpoint:** `GET /api/disease/alerts/{farmerId}/unread`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

---

### 5.3 Mark Alert as Read
**Endpoint:** `PUT /api/disease/alerts/{farmerId}/{alertTimestamp}/read`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

---

### 5.4 Resolve Alert
**Endpoint:** `PUT /api/disease/alerts/{farmerId}/{alertTimestamp}/resolve`  
**Auth:** ✅ API Key Required  
**Status:** 🚧 To Be Implemented

---

## 📊 Data Models

### Farmer Entity
```typescript
interface Farmer {
  farmerId: string;              // UUID or phone number
  farmerName: string;
  phoneNumber: string;
  email?: string;
  province: string;              // "An Giang"
  ward: string;                  // "Vĩnh Xương"
  address?: string;
  latitude?: number;
  longitude?: number;
  cropType?: string;             // "RICE_OM18" | "RICE_ST25"
  farmArea?: number;             // hectares
  isActive?: boolean;
  isVerified?: boolean;
  createdAt: string;             // ISO 8601
  updatedAt: string;
  lastLoginAt?: string;
}
```

---

### Crop Cycle Entity
```typescript
interface CropCycle {
  farmerId: string;
  startDate: string;             // "2026-01-15" (Sort Key)
  cycleId: string;               // UUID
  cropType: string;              // "RICE_OM18"
  season: string;                // "Đông Xuân" | "Hè Thu" | "Thu Đông"
  currentStage: string;          // "gieo_mạ" | "cấy" | "đẻ_nhánh" | "làm_đòng" | "trổ_bông" | "chín"
  endDate: string;               // Expected end date
  actualEndDate?: string;
  cycleDays?: number;
  farmArea: number;              // hectares
  expectedYield?: number;        // tons
  actualYield?: number;
  province: string;
  ward: string;
  locationId?: string;           // "An Giang#Vĩnh Xương"
  isActive: boolean;
  isCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### Weather Data Entity
```typescript
interface WeatherData {
  locationId: string;            // "An Giang#Vĩnh Xương" (Partition Key)
  timestamp: string;             // ISO 8601 (Sort Key)
  provinceName: string;
  wardName: string;
  latitude?: number;
  longitude?: number;
  
  // Temperature
  temperature: number;           // °C
  tempMin?: number;
  tempMax?: number;
  feelsLike?: number;
  
  // Humidity & Rain
  humidity: number;              // %
  rainfall?: number;             // mm
  rainfall1h?: number;
  rainfall24h?: number;
  
  // Wind
  windSpeed?: number;            // m/s
  windDirection?: number;        // degrees
  windDirectionName?: string;    // "Đông Bắc"
  
  // Atmospheric
  pressure?: number;             // hPa
  visibility?: number;           // km
  cloudiness?: number;           // %
  uvIndex?: number;
  
  // Condition
  weatherCondition: string;      // "CLEAR" | "CLOUDY" | "RAIN" | "THUNDERSTORM"
  weatherDescription?: string;
}
```

---

### Disease Alert Entity
```typescript
interface DiseaseAlert {
  farmerId: string;              // Partition Key
  alertTimestamp: string;        // ISO 8601 (Sort Key)
  alertId: string;               // UUID
  diseaseType: string;           // "FUNGAL" | "BACTERIAL" | "VIRAL" | "PEST"
  diseaseName: string;           // "Đạo ôn lúa"
  severityLevel: string;         // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  province: string;
  ward: string;
  locationId?: string;
  description: string;
  symptoms: string[];
  recommendations: string[];
  riskScore?: number;            // 0.0 - 1.0
  affectedAreaPercent?: number;
  isRead: boolean;
  isResolved: boolean;
  alertDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  source?: string;               // "AI" | "MANUAL" | "EXTERNAL_API"
}
```

---

### Chat History Entity
```typescript
interface ChatHistory {
  farmerId: string;              // Partition Key
  timestamp: string;             // ISO 8601 (Sort Key)
  messageId: string;             // UUID
  sessionId: string;             // Session identifier
  userMessage: string;
  aiResponse: string;
  messageType?: string;          // "TEXT" | "VOICE" | "IMAGE"
  inputMethod?: string;          // "KEYBOARD" | "VOICE"
  currentCropType?: string;
  currentSeason?: string;
  currentStage?: string;
  location?: string;             // "An Giang#Vĩnh Xương"
  intent?: string;               // "DISEASE_INQUIRY" | "FERTILIZER_INQUIRY" | ...
  confidenceScore?: number;      // 0.0 - 1.0
  keywords?: string[];
  relatedTopics?: string[];
  isHelpful?: boolean;
  rating?: number;               // 1-5
  feedback?: string;
  createdAt: string;
  deviceInfo?: string;
  appVersion?: string;
  modelUsed?: string;            // "gpt-4o-mini"
  tokensUsed?: number;
}
```

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error description",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid API key
- `403 Forbidden` - Invalid session token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - External service (AI) unavailable

---

## 💡 Examples & Use Cases

### Use Case 1: User Registration Flow
```javascript
// 1. Register farmer
const registerResponse = await fetch('http://localhost:8080/api/farmer/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    farmerName: "Nguyễn Văn A",
    phoneNumber: "0123456789",
    province: "An Giang",
    ward: "Vĩnh Xương",
    cropType: "RICE_OM18",
    farmArea: 2.5
  })
});

const { farmerId, sessionToken } = await registerResponse.json();

// 2. Store tokens in localStorage
localStorage.setItem('farmerId', farmerId);
localStorage.setItem('sessionToken', sessionToken);
```

---

### Use Case 2: Chat with AI
```javascript
const sendMessage = async (message) => {
  const farmerId = localStorage.getItem('farmerId');
  const sessionId = localStorage.getItem('sessionId') || `session_${Date.now()}`;
  
  const response = await fetch('http://localhost:8080/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      farmerId,
      userMessage: message,
      sessionId,
      currentCropType: "RICE_OM18",
      location: "An Giang#Vĩnh Xương"
    })
  });
  
  const data = await response.json();
  return data.data; // { aiResponse, intent, keywords, ... }
};
```

---

### Use Case 3: Get Weather & Disease Alerts
```javascript
// Get current weather
const weather = await fetch('http://localhost:8080/api/weather/AnGiang/VinhXuong')
  .then(res => res.json());

// Get disease alerts
const farmerId = localStorage.getItem('farmerId');
const alerts = await fetch(`http://localhost:8080/api/disease/alerts/${farmerId}`, {
  headers: {
    'X-API-Key': 'farmray-dev-key-2026'
  }
}).then(res => res.json());
```

---

### Use Case 4: Create & Manage Crop Cycle
```javascript
// Create new crop cycle
const createCycle = await fetch('http://localhost:8080/api/cropcycle', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'farmray-dev-key-2026',
    'X-Session-Token': localStorage.getItem('sessionToken')
  },
  body: JSON.stringify({
    farmerId: localStorage.getItem('farmerId'),
    cropType: "RICE_OM18",
    season: "Đông Xuân",
    startDate: "2026-01-15",
    endDate: "2026-05-15",
    currentStage: "gieo_mạ",
    farmArea: 2.5,
    expectedYield: 7.5,
    province: "An Giang",
    ward: "Vĩnh Xương"
  })
});

// Get active cycle
const activeCycle = await fetch(
  `http://localhost:8080/api/cropcycle/farmer/${farmerId}/active`,
  {
    headers: { 'X-API-Key': 'farmray-dev-key-2026' }
  }
).then(res => res.json());
```

---

## 🔄 AI Service Integration (Python FastAPI)

### AI Service Endpoints

#### 1. Basic Chat
```
POST http://localhost:8000/chat
```

**Request:**
```json
{
  "farmerId": "farmer_123",
  "userMessage": "Lúa bị vàng lá",
  "sessionId": "session_456",
  "currentCropType": "RICE_OM18",
  "location": "An Giang#Vĩnh Xương"
}
```

**Response:**
```json
{
  "messageId": "msg_uuid",
  "sessionId": "session_456",
  "aiResponse": "Vàng lá có thể do...",
  "intent": "DISEASE_INQUIRY",
  "confidenceScore": 0.85,
  "keywords": ["vàng lá", "bệnh"],
  "relatedTopics": ["dinh dưỡng", "sâu bệnh"],
  "modelUsed": "gpt-4o-mini",
  "tokensUsed": 724,
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

#### 2. Chat with Context
```
POST http://localhost:8000/chat/context
```

**Request:**
```json
{
  "chatRequest": {
    "farmerId": "farmer_123",
    "userMessage": "Thời tiết này có ảnh hưởng gì?",
    "sessionId": "session_456"
  },
  "cropCycle": {
    "farmerId": "farmer_123",
    "cropType": "RICE_OM18",
    "season": "Đông Xuân",
    "currentStage": "đẻ_nhánh",
    "farmArea": 2.5
  },
  "farmer": {
    "farmerId": "farmer_123",
    "farmerName": "Nguyễn Văn A",
    "province": "An Giang",
    "ward": "Vĩnh Xương"
  },
  "weather": {
    "locationId": "An Giang#Vĩnh Xương",
    "temperature": 28.5,
    "humidity": 85,
    "rainfall": 15.0
  }
}
```

**Note:** Backend tự động gọi AI service này, Frontend chỉ cần gọi `/api/chat/send`

---

## 📝 Intent Types

| Intent | Description | Confidence |
|--------|-------------|-----------|
| `DISEASE_INQUIRY` | Câu hỏi về sâu bệnh | 0.8 |
| `FERTILIZER_INQUIRY` | Câu hỏi về phân bón | 0.8 |
| `PESTICIDE_INQUIRY` | Câu hỏi về thuốc trừ sâu | 0.8 |
| `WEATHER_INQUIRY` | Câu hỏi về thời tiết | 0.8 |
| `CULTIVATION_ADVICE` | Tư vấn kỹ thuật canh tác | 0.8 |
| `GENERAL_INQUIRY` | Câu hỏi chung | 0.5 |

---

## 🎯 Crop Types

```typescript
type CropType = 
  | "RICE_OM18"      // Lúa OM 18
  | "RICE_ST25"      // Lúa ST25
  | "RICE_JASMINE"   // Lúa Jasmine
  | "RICE_IR50404"   // Lúa IR50404
  | "CORN"           // Ngô
  | "VEGETABLE"      // Rau
  | "OTHER";         // Khác
```

---

## 🌱 Crop Stages

```typescript
type CropStage = 
  | "gieo_mạ"        // Gieo mạ (0-20 ngày)
  | "cấy"            // Cấy (20-25 ngày)
  | "đẻ_nhánh"       // Đẻ nhánh (25-45 ngày)
  | "làm_đòng"       // Làm đòng (45-60 ngày)
  | "trổ_bông"       // Trổ bông (60-75 ngày)
  | "chín"           // Chín (75-90 ngày)
  | "thu_hoạch";     // Thu hoạch
```

---

## 🌾 Seasons

```typescript
type Season = 
  | "Đông Xuân"      // Nov - Mar
  | "Hè Thu"         // Apr - Jul
  | "Thu Đông";      // Aug - Oct
```

---

## 🌦️ Weather Conditions

```typescript
type WeatherCondition = 
  | "CLEAR"          // Trời quang
  | "PARTLY_CLOUDY"  // Có mây
  | "CLOUDY"         // U ám
  | "RAIN"           // Mưa
  | "HEAVY_RAIN"     // Mưa to
  | "THUNDERSTORM"   // Dông
  | "FOG"            // Sương mù
  | "WINDY";         // Gió mạnh
```

---

## 🦠 Disease Types

```typescript
type DiseaseType = 
  | "FUNGAL"         // Nấm
  | "BACTERIAL"      // Vi khuẩn
  | "VIRAL"          // Virus
  | "PEST"           // Sâu hại
  | "NUTRIENT";      // Dinh dưỡng
```

---

## ⚡ Performance Notes

- **Response Time:** < 2s for most endpoints
- **AI Chat Response:** < 5s (depends on OpenAI API)
- **Rate Limiting:** 100 requests/minute per API key
- **Pagination:** Use `limit` parameter (max: 100)

---

## 🔧 Testing

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

**Response:**
```json
{
  "status": "UP"
}
```

---

### Test Chat Endpoint
```bash
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "test_farmer",
    "userMessage": "Hello AI",
    "sessionId": "test_session"
  }'
```

---

## 📞 Support & Contact

- **Backend Team:** backend@farmray.com
- **AI Team:** ai@farmray.com
- **Documentation:** https://docs.farmray.com
- **API Status:** https://status.farmray.com

---

## 📅 Changelog

### v1.0.0 (2026-01-15)
- ✅ Chat & AI Service (Completed)
- ✅ Chat History Management (Completed)
- ✅ Security Configuration (Completed)
- 🚧 Farmer Management (In Progress)
- 🚧 Crop Cycle Management (In Progress)
- 🚧 Weather Data (In Progress)
- 🚧 Disease Alerts (In Progress)

---

## ✅ Ready for Integration

### Completed Features
1. ✅ Chat API (`/api/chat/**`)
2. ✅ AI Integration (OpenAI GPT-4o-mini)
3. ✅ Chat History CRUD
4. ✅ Intent Detection
5. ✅ Keyword Extraction
6. ✅ Chat Statistics
7. ✅ Feedback System

### Next Steps
1. 🚧 Implement Farmer Management API
2. 🚧 Implement Crop Cycle Management API
3. 🚧 Implement Weather Data API
4. 🚧 Implement Disease Alert API
5. 🚧 Add real-time notifications (WebSocket)
6. 🚧 Add image upload for disease detection

---

**Happy Coding! 🚀**

