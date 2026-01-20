# 📱 FarmRay - Frontend Team Documentation

> **Complete integration guide for Frontend developers**  
> **Last Updated:** 2026-01-15  
> **Version:** 1.0.0

---

## 📚 Table of Contents

1. [Quick Start](#-quick-start)
2. [Available Documentation](#-available-documentation)
3. [API Status](#-api-status)
4. [Key Information](#-key-information)
5. [Common Flows](#-common-flows)
6. [Contact](#-contact)

---

## 🚀 Quick Start

### 1. Setup Environment
```bash
# .env.local
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AI_SERVICE_URL=http://localhost:8000
REACT_APP_API_KEY=farmray-dev-key-2026
```

### 2. Install Dependencies
```bash
npm install axios
# or
npm install
```

### 3. Test Backend Connection
```javascript
fetch('http://localhost:8080/actuator/health')
  .then(res => res.json())
  .then(data => console.log('Backend status:', data))
```

### 4. Send First Chat Message
```javascript
const response = await fetch('http://localhost:8080/api/chat/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    farmerId: 'test_farmer',
    userMessage: 'Xin chào AI!',
    sessionId: 'test_session'
  })
});

const data = await response.json();
console.log('AI Response:', data.data.aiResponse);
```

---

## 📖 Available Documentation

### For Frontend Team

| Document | Description | Link |
|----------|-------------|------|
| **API Documentation** | Complete API reference | [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md) |
| **Quick Start Guide** | Setup & code examples | [FRONTEND_QUICK_START.md](./FRONTEND_QUICK_START.md) |
| **AI Integration** | AI service details | [AI_SERVICE_INTEGRATION.md](./AI_SERVICE_INTEGRATION.md) |
| **Security Guide** | Authentication & authorization | [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) |

### For Backend Team

| Document | Description |
|----------|-------------|
| README.md | Project overview |
| SECURITY_ARCHITECTURE.md | Security implementation |

---

## ✅ API Status

### Completed & Ready for Integration

#### 1. Chat & AI Service ✅
- ✅ `POST /api/chat/send` - Send message to AI
- ✅ `GET /api/chat/history/{farmerId}` - Get chat history
- ✅ `GET /api/chat/history/{farmerId}/session/{sessionId}` - Get session chats
- ✅ `GET /api/chat/history/{farmerId}/today` - Get today's chats
- ✅ `GET /api/chat/history/{farmerId}/latest?limit=10` - Get latest messages
- ✅ `GET /api/chat/history/{farmerId}/helpful` - Get helpful messages
- ✅ `GET /api/chat/stats/{farmerId}` - Get chat statistics
- ✅ `PUT /api/chat/feedback` - Update message feedback
- ✅ `PUT /api/chat/helpful/{farmerId}/{timestamp}` - Mark as helpful
- ✅ `DELETE /api/chat/message/{farmerId}/{timestamp}` - Delete message
- ✅ `DELETE /api/chat/session/{farmerId}/{sessionId}` - Delete session

**Status:** 🟢 **READY TO USE**

---

### In Progress / To Be Implemented

#### 2. Farmer Management 🚧
- 🚧 `POST /api/farmer/register` - Register new farmer
- 🚧 `GET /api/farmer/{farmerId}` - Get farmer profile
- 🚧 `PUT /api/farmer/{farmerId}` - Update farmer profile
- 🚧 `DELETE /api/farmer/{farmerId}` - Delete farmer account

**Status:** 🟡 **IN PROGRESS**

---

#### 3. Crop Cycle Management 🚧
- 🚧 `POST /api/cropcycle` - Create crop cycle
- 🚧 `GET /api/cropcycle/farmer/{farmerId}` - Get all cycles
- 🚧 `GET /api/cropcycle/farmer/{farmerId}/active` - Get active cycle
- 🚧 `GET /api/cropcycle/{farmerId}/{startDate}` - Get specific cycle
- 🚧 `PUT /api/cropcycle/{farmerId}/{startDate}` - Update cycle
- 🚧 `PUT /api/cropcycle/{farmerId}/{startDate}/stage` - Update stage
- 🚧 `PUT /api/cropcycle/{farmerId}/{startDate}/complete` - Complete cycle
- 🚧 `DELETE /api/cropcycle/{farmerId}/{startDate}` - Delete cycle

**Status:** 🟡 **IN PROGRESS**

---

#### 4. Weather Data 🚧
- 🚧 `GET /api/weather/{province}/{ward}` - Get current weather
- 🚧 `GET /api/weather/{province}/{ward}/forecast?days=7` - Get forecast
- 🚧 `GET /api/weather/{province}/{ward}/history` - Get weather history
- 🚧 `GET /api/weather/alerts/{province}/{ward}` - Get weather alerts

**Status:** 🟡 **IN PROGRESS**

---

#### 5. Disease Alerts 🚧
- 🚧 `GET /api/disease/alerts/{farmerId}` - Get all alerts
- 🚧 `GET /api/disease/alerts/{farmerId}/unread` - Get unread alerts
- 🚧 `GET /api/disease/alerts/{farmerId}/active` - Get active alerts
- 🚧 `PUT /api/disease/alerts/{farmerId}/{timestamp}/read` - Mark as read
- 🚧 `PUT /api/disease/alerts/{farmerId}/{timestamp}/resolve` - Resolve alert
- 🚧 `DELETE /api/disease/alerts/{farmerId}/{timestamp}` - Delete alert

**Status:** 🟡 **IN PROGRESS**

---

## 🔑 Key Information

### Base URLs
```
Backend API:  http://localhost:8080       (Development)
AI Service:   http://localhost:8000       (Development)
Frontend:     http://localhost:3000       (Development)
```

### Authentication

#### 1. Public Endpoints (No Auth Required)
```
✅ Chat APIs (/api/chat/**)
✅ Weather APIs (/api/weather/**)
✅ Farmer Registration (/api/farmer/register)
✅ Health Check (/actuator/health)
```

#### 2. Protected Endpoints (API Key Required)
```
Header: X-API-Key: farmray-dev-key-2026

✅ Crop Cycle APIs (/api/cropcycle/**)
✅ Disease Alerts (/api/disease/**)
✅ Farmer Profile (/api/farmer/{id})
```

#### 3. Personal Data Access (API Key + Session Token)
```
Header: X-API-Key: farmray-dev-key-2026
Header: X-Session-Token: {token-from-registration}

✅ Update farmer profile
✅ Delete farmer account
✅ Access personal data
```

### Standard Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
}
```

---

## 📊 Common Flows

### Flow 1: User Registration & First Chat
```mermaid
User Registration
    ↓
Store farmerId & sessionToken
    ↓
Setup Chat Session
    ↓
Send First Message
    ↓
Display AI Response
```

**Code:**
```javascript
// 1. Register
const registerResponse = await fetch('/api/farmer/register', {
  method: 'POST',
  body: JSON.stringify({ farmerName: 'Nguyễn Văn A', ... })
});
const { farmerId, sessionToken } = await registerResponse.json();

// 2. Store tokens
localStorage.setItem('farmerId', farmerId);
localStorage.setItem('sessionToken', sessionToken);

// 3. Send message
const chatResponse = await fetch('/api/chat/send', {
  method: 'POST',
  body: JSON.stringify({
    farmerId,
    userMessage: 'Xin chào!',
    sessionId: `session_${Date.now()}`
  })
});
```

---

### Flow 2: Dashboard - Display Weather & Alerts
```mermaid
Get User Location (province, ward)
    ↓
Fetch Current Weather ──→ Display Weather Widget
    ↓
Fetch Disease Alerts ──→ Display Alert Count
    ↓
Fetch Active Crop Cycle ──→ Display Progress Tracker
```

**Code:**
```javascript
// Parallel fetch for better performance
const [weather, alerts, cropCycle] = await Promise.all([
  fetch('/api/weather/AnGiang/VinhXuong').then(r => r.json()),
  fetch('/api/disease/alerts/farmer_123', {
    headers: { 'X-API-Key': 'farmray-dev-key-2026' }
  }).then(r => r.json()),
  fetch('/api/cropcycle/farmer/farmer_123/active', {
    headers: { 'X-API-Key': 'farmray-dev-key-2026' }
  }).then(r => r.json())
]);
```

---

### Flow 3: Crop Cycle Management
```mermaid
Create Crop Cycle
    ↓
Track Daily Progress
    ↓
Update Crop Stage
    ↓
Monitor Weather & Alerts
    ↓
Complete Cycle (Harvest)
```

**Code:**
```javascript
// 1. Create cycle
await fetch('/api/cropcycle', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'farmray-dev-key-2026'
  },
  body: JSON.stringify({
    farmerId: 'farmer_123',
    cropType: 'RICE_OM18',
    season: 'Đông Xuân',
    startDate: '2026-01-15',
    currentStage: 'gieo_mạ',
    farmArea: 2.5
  })
});

// 2. Update stage
await fetch('/api/cropcycle/farmer_123/2026-01-15/stage', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'farmray-dev-key-2026'
  },
  body: JSON.stringify({
    currentStage: 'đẻ_nhánh'
  })
});
```

---

### Flow 4: AI Chat with Context
```mermaid
User asks question
    ↓
Backend fetches context:
  - Current crop cycle
  - Farmer info
  - Current weather
    ↓
Backend calls AI Service
    ↓
AI generates response with context
    ↓
Save to DynamoDB
    ↓
Return to Frontend
    ↓
Display with intent & keywords
```

**Note:** Frontend chỉ cần gọi `/api/chat/send`, Backend tự động xử lý context.

---

## 🎨 UI Recommendations

### Chat Interface
```
┌─────────────────────────────────────┐
│  🌾 FarmRay AI Assistant            │
├─────────────────────────────────────┤
│                                      │
│  👨 Lúa bị vàng lá phải làm sao?    │
│                                      │
│  🤖 Vàng lá có thể do:              │
│     1. Thiếu dinh dưỡng...          │
│     2. Bệnh đạo ôn...               │
│                                      │
│     🏷️ vàng lá | bệnh | phân bón   │
│                                      │
│     📌 Chủ đề liên quan:            │
│     [Đạo ôn lúa] [Phân đạm] [Rầy]  │
│                                      │
│     👍 Hữu ích  |  ⭐ Đánh giá      │
│                                      │
├─────────────────────────────────────┤
│  💬 Hỏi AI...              [Gửi]   │
└─────────────────────────────────────┘
```

### Dashboard Layout
```
┌──────────────────────────────────────────────┐
│  🌾 Dashboard - Nguyễn Văn A                 │
├──────────────────────────────────────────────┤
│                                               │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │ 🌦️ Thời tiết│  │ ⚠️ Cảnh báo (3)     │   │
│  │ 28.5°C      │  │ - Đạo ôn lúa        │   │
│  │ 85% ẩm      │  │ - Mưa lớn           │   │
│  │ 15mm mưa    │  │ - Sâu đục thân      │   │
│  └─────────────┘  └─────────────────────┘   │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │ 🌱 Chu kỳ canh tác - Lúa OM18        │   │
│  │ ━━━━━━━●─────────  (45/90 ngày)     │   │
│  │ Giai đoạn: Đẻ nhánh                  │   │
│  └───────────────────────────────────────┘   │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │ 💬 Hỏi AI...                   [Gửi] │   │
│  └───────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 📦 TypeScript Types

### Installation
```bash
# Copy types from FRONTEND_API_DOCUMENTATION.md
# Or create src/types/farmray.ts
```

### Usage
```typescript
import { Farmer, CropCycle, WeatherData } from './types/farmray';

const farmer: Farmer = {
  farmerId: 'farmer_123',
  farmerName: 'Nguyễn Văn A',
  // ...
};
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error
**Error:**
```
Access to fetch has been blocked by CORS policy
```

**Solution:**
Backend đã cấu hình CORS cho `localhost:3000`. Kiểm tra:
1. Frontend chạy đúng port 3000
2. Backend đang chạy
3. URL trong `.env` đúng

---

### Issue 2: 401 Unauthorized
**Error:**
```json
{
  "success": false,
  "message": "Invalid or missing API key"
}
```

**Solution:**
Thêm header cho protected endpoints:
```javascript
headers: {
  'X-API-Key': 'farmray-dev-key-2026'
}
```

---

### Issue 3: AI Response Slow
**Error:** Response > 10 seconds

**Solution:**
1. Check AI service status: `curl http://localhost:8000/health`
2. Check OpenAI API key
3. Check network connectivity
4. Increase timeout in Frontend

---

### Issue 4: Empty Chat History
**Error:** `GET /api/chat/history/{farmerId}` returns empty

**Solution:**
1. Send a message first: `POST /api/chat/send`
2. Use correct farmerId
3. Check DynamoDB table `FR_ChatHistory`

---

## 📞 Contact & Support

### Backend Team
- **Lead:** [Backend Team Lead]
- **Email:** backend@farmray.com
- **Slack:** #farmray-backend

### AI Team
- **Lead:** [AI Team Lead]
- **Email:** ai@farmray.com
- **Slack:** #farmray-ai

### Documentation Issues
- **Report:** Create issue in project repository
- **Update:** Submit PR with changes

---

## 📅 Release Schedule

### Phase 1 - Chat & AI ✅ (Completed)
- ✅ Chat API
- ✅ AI Integration
- ✅ Chat History
- ✅ Intent Detection

### Phase 2 - Core Features 🚧 (In Progress)
- 🚧 Farmer Management
- 🚧 Crop Cycle Tracking
- 🚧 Weather Integration
- 🚧 Disease Alerts

### Phase 3 - Advanced Features 📅 (Planned)
- 📅 Image-based disease detection
- 📅 Voice input
- 📅 Real-time notifications
- 📅 Analytics dashboard

---

## 🔗 Quick Links

### Documentation
- [API Documentation](./FRONTEND_API_DOCUMENTATION.md) - Complete API reference
- [Quick Start](./FRONTEND_QUICK_START.md) - Code examples
- [AI Integration](./AI_SERVICE_INTEGRATION.md) - AI service details
- [Security](./SECURITY_ARCHITECTURE.md) - Authentication guide

### External Resources
- [OpenAI GPT-4o-mini Docs](https://platform.openai.com/docs)
- [AWS DynamoDB Docs](https://docs.aws.amazon.com/dynamodb/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

---

## ✅ Integration Checklist

### Setup
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure `.env`
- [ ] Test backend connection

### Chat Feature
- [ ] Implement chat UI
- [ ] Integrate `/api/chat/send`
- [ ] Display AI responses
- [ ] Show intent & keywords
- [ ] Add feedback system
- [ ] Implement chat history

### Dashboard
- [ ] Show weather widget
- [ ] Show disease alerts
- [ ] Show crop cycle progress
- [ ] Add navigation

### Testing
- [ ] Test on desktop
- [ ] Test on mobile
- [ ] Test error handling
- [ ] Test offline mode

---

## 🎯 Next Steps

1. **Read Documentation**
   - Start with [Quick Start Guide](./FRONTEND_QUICK_START.md)
   - Review [API Documentation](./FRONTEND_API_DOCUMENTATION.md)

2. **Implement Chat**
   - Use code examples from Quick Start
   - Test with sample data
   - Add error handling

3. **Wait for APIs**
   - Farmer Management (ETA: TBD)
   - Crop Cycle (ETA: TBD)
   - Weather (ETA: TBD)

4. **Integrate New Features**
   - Follow API documentation
   - Test thoroughly
   - Report issues

---

## 🏆 Best Practices

### 1. Error Handling
Always handle errors gracefully:
```javascript
try {
  const response = await fetch('/api/chat/send', { ... });
  const data = await response.json();
  
  if (!data.success) {
    toast.error(data.message);
  }
} catch (error) {
  toast.error('Network error');
}
```

### 2. Loading States
Show loading indicators:
```javascript
const [loading, setLoading] = useState(false);

const sendMessage = async () => {
  setLoading(true);
  try {
    // ... API call
  } finally {
    setLoading(false);
  }
};
```

### 3. Optimize Performance
Use parallel requests:
```javascript
const [weather, alerts, cycle] = await Promise.all([
  fetchWeather(),
  fetchAlerts(),
  fetchCropCycle()
]);
```

### 4. Cache Data
Cache frequently accessed data:
```javascript
// Use React Query or SWR
import useSWR from 'swr';

const { data, error } = useSWR(
  `/api/weather/AnGiang/VinhXuong`,
  fetcher,
  { refreshInterval: 300000 } // 5 minutes
);
```

---

**Happy Coding! 🚀🌾**

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-15  
**Maintained by:** FarmRay Backend Team

