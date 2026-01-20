# 📨 FarmRay - Thông Tin Gửi Team Frontend

> **Ngày gửi:** 2026-01-15  
> **Người gửi:** Backend Team  
> **Tiêu đề:** Tài liệu API & Hướng dẫn tích hợp Frontend

---

## 👋 Chào Team Frontend!

Backend team đã hoàn thành phần **Chat & AI Integration** và sẵn sàng cho Frontend tích hợp. Dưới đây là thông tin chi tiết:

---

## ✅ Đã Hoàn Thành

### 1. Chat & AI Service (100% Complete)
- ✅ **11 API endpoints** hoạt động hoàn hảo
- ✅ Tích hợp **OpenAI GPT-4o-mini** 
- ✅ **Intent detection** (6 loại)
- ✅ **Keyword extraction**
- ✅ **Vietnamese language support**
- ✅ Chat history management
- ✅ Feedback system
- ✅ Chat statistics

### 2. Authentication & Security
- ✅ **Multi-tier security** (Public, API Key, Session Token)
- ✅ **CORS configured** cho localhost:3000
- ✅ API Key: `farmray-dev-key-2026`

---

## 📚 Tài Liệu

Chúng tôi đã chuẩn bị **4 tài liệu** chi tiết cho team FE:

### 1. 📖 [FRONTEND_README.md](./FRONTEND_README.md)
**Đọc file này đầu tiên!**
- Overview toàn bộ project
- API status (completed vs in-progress)
- Quick links
- Troubleshooting
- Best practices

### 2. 📋 [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)
**API Reference đầy đủ**
- Chi tiết 11 Chat API endpoints
- Request/Response examples
- Data models (TypeScript interfaces)
- Error handling
- Authentication guide
- Use cases

### 3. 🚀 [FRONTEND_QUICK_START.md](./FRONTEND_QUICK_START.md)
**Code examples sẵn sàng copy-paste**
- 5 phút setup
- React components hoàn chỉnh
- API client setup
- TypeScript types
- Authentication context
- Common use cases

### 4. 🤖 [AI_SERVICE_INTEGRATION.md](./AI_SERVICE_INTEGRATION.md)
**Chi tiết về AI Service**
- OpenAI GPT-4o-mini integration
- Intent detection
- Keyword extraction
- Context-aware responses
- Vietnamese language support
- Performance optimization

---

## 🚀 Quick Start - 3 Bước

### Bước 1: Setup Environment
```bash
# .env.local
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_KEY=farmray-dev-key-2026
```

### Bước 2: Test Backend
```javascript
fetch('http://localhost:8080/actuator/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend OK:', data))
```

### Bước 3: Send First Chat
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
console.log('🤖 AI says:', data.data.aiResponse);
```

---

## 🔌 API Endpoints Sẵn Sàng

### ✅ Chat APIs (Public - No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/send` | Gửi tin nhắn, nhận AI response |
| GET | `/api/chat/history/{farmerId}` | Lấy toàn bộ chat history |
| GET | `/api/chat/history/{farmerId}/session/{sessionId}` | Lấy chat theo session |
| GET | `/api/chat/history/{farmerId}/today` | Lấy chat hôm nay |
| GET | `/api/chat/history/{farmerId}/latest?limit=10` | Lấy N tin mới nhất |
| GET | `/api/chat/history/{farmerId}/helpful` | Lấy tin đánh giá hữu ích |
| GET | `/api/chat/stats/{farmerId}` | Thống kê chat |
| PUT | `/api/chat/feedback` | Cập nhật feedback |
| PUT | `/api/chat/helpful/{farmerId}/{timestamp}` | Đánh dấu hữu ích |
| DELETE | `/api/chat/message/{farmerId}/{timestamp}` | Xóa tin nhắn |
| DELETE | `/api/chat/session/{farmerId}/{sessionId}` | Xóa session |

**Lưu ý:** Chat APIs là **Public**, không cần API Key!

---

## 📦 Sample Code

### Chat Component (React)
```jsx
import { useState } from 'react';

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const sendMessage = async () => {
    const response = await fetch('http://localhost:8080/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmerId: localStorage.getItem('farmerId') || 'test_farmer',
        userMessage: message,
        sessionId: localStorage.getItem('sessionId') || `session_${Date.now()}`
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setMessages([...messages, {
        user: message,
        ai: data.data.aiResponse,
        intent: data.data.intent,
        keywords: data.data.keywords
      }]);
      setMessage('');
    }
  };
  
  return (
    <div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <p><strong>You:</strong> {msg.user}</p>
            <p><strong>AI:</strong> {msg.ai}</p>
            <div>
              {msg.keywords?.map(k => <span key={k} className="tag">{k}</span>)}
            </div>
          </div>
        ))}
      </div>
      
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

**Full examples:** Xem [FRONTEND_QUICK_START.md](./FRONTEND_QUICK_START.md)

---

## 🧪 Test Data

### Test Farmer IDs
```
test_farmer
farmer_123
demo_farmer
```

### Sample Messages
```
"Lúa bị vàng lá phải làm sao?"
"Khi nào bón phân đạm?"
"Thời tiết mưa nhiều ảnh hưởng gì?"
"Cách phòng trừ sâu đục thân?"
```

### Expected AI Response
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "msg_uuid",
    "sessionId": "session_456",
    "aiResponse": "Vàng lá có thể do...",
    "intent": "DISEASE_INQUIRY",
    "confidenceScore": 0.85,
    "keywords": ["vàng lá", "bệnh"],
    "relatedTopics": ["phân bón", "sâu bệnh"],
    "modelUsed": "gpt-4o-mini",
    "tokensUsed": 724
  }
}
```

---

## 🚧 Upcoming APIs (In Progress)

### Farmer Management
- `POST /api/farmer/register` - Đăng ký nông dân
- `GET /api/farmer/{farmerId}` - Lấy thông tin
- `PUT /api/farmer/{farmerId}` - Cập nhật

### Crop Cycle
- `POST /api/cropcycle` - Tạo chu kỳ mới
- `GET /api/cropcycle/farmer/{farmerId}/active` - Lấy chu kỳ đang hoạt động
- `PUT /api/cropcycle/{farmerId}/{startDate}/stage` - Cập nhật giai đoạn

### Weather
- `GET /api/weather/{province}/{ward}` - Thời tiết hiện tại
- `GET /api/weather/{province}/{ward}/forecast` - Dự báo 7 ngày

### Disease Alerts
- `GET /api/disease/alerts/{farmerId}` - Cảnh báo dịch bệnh
- `GET /api/disease/alerts/{farmerId}/unread` - Cảnh báo chưa đọc

**ETA:** Sẽ thông báo khi hoàn thành từng module

---

## 🔐 Authentication Guide

### 3 Security Levels

#### Level 1: Public (No Auth)
```javascript
// Chat APIs - không cần header gì
fetch('http://localhost:8080/api/chat/send', {
  method: 'POST',
  body: JSON.stringify({ ... })
})
```

#### Level 2: API Key Protected
```javascript
// Crop Cycle, Disease Alerts - cần API Key
fetch('http://localhost:8080/api/cropcycle/farmer_123', {
  headers: {
    'X-API-Key': 'farmray-dev-key-2026'
  }
})
```

#### Level 3: Session Token
```javascript
// Personal data - cần API Key + Session Token
fetch('http://localhost:8080/api/farmer/farmer_123', {
  headers: {
    'X-API-Key': 'farmray-dev-key-2026',
    'X-Session-Token': localStorage.getItem('sessionToken')
  }
})
```

**Chi tiết:** Xem [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)

---

## 🎯 AI Features

### Intent Detection (6 Types)
AI tự động phân loại câu hỏi:
- `DISEASE_INQUIRY` - Hỏi về sâu bệnh
- `FERTILIZER_INQUIRY` - Hỏi về phân bón
- `PESTICIDE_INQUIRY` - Hỏi về thuốc trừ sâu
- `WEATHER_INQUIRY` - Hỏi về thời tiết
- `CULTIVATION_ADVICE` - Tư vấn kỹ thuật
- `GENERAL_INQUIRY` - Câu hỏi chung

### Keyword Extraction
AI tự động trích xuất từ khóa:
```
User: "Lúa bị vàng lá, có vết nâu"
Keywords: ["vàng lá", "vết nâu", "bệnh lúa"]
Related: ["đạo ôn", "phân bón", "dinh dưỡng"]
```

### Context-Aware Responses
Backend tự động gửi context cho AI:
- Thông tin nông dân (tỉnh, xã)
- Chu kỳ canh tác hiện tại
- Thời tiết hiện tại

**Frontend chỉ cần gọi `/api/chat/send`, không lo context!**

---

## 📊 Data Models

### TypeScript Interfaces
```typescript
interface ChatMessage {
  messageId: string;
  sessionId: string;
  farmerId: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  intent?: string;
  confidenceScore?: number;
  keywords?: string[];
  relatedTopics?: string[];
  isHelpful?: boolean;
  rating?: number;
}

interface Farmer {
  farmerId: string;
  farmerName: string;
  phoneNumber: string;
  province: string;
  ward: string;
  cropType?: string;
  farmArea?: number;
}

interface CropCycle {
  farmerId: string;
  cycleId: string;
  cropType: string;
  season: string;
  currentStage: string;
  startDate: string;
  farmArea: number;
  isActive: boolean;
}
```

**Full types:** Xem [FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
```
✅ Backend đã config CORS cho localhost:3000
❌ Nếu vẫn lỗi → kiểm tra port frontend
```

### Issue 2: 401 Unauthorized
```
✅ Chat APIs không cần auth
✅ Other APIs cần X-API-Key: farmray-dev-key-2026
```

### Issue 3: AI Response Slow
```
✅ Normal: 2-5 seconds
❌ >10s → Check AI service running
```

### Issue 4: Empty Response
```
✅ Check request format
✅ Check farmerId exists
✅ Check backend logs
```

---

## 📞 Liên Hệ & Support

### Backend Team
- **Slack:** #farmray-backend
- **Email:** backend@farmray.com
- **Response Time:** < 2 hours (working hours)

### AI Team
- **Slack:** #farmray-ai
- **Email:** ai@farmray.com

### Câu Hỏi Thường Gặp
- **API issues:** Post vào #farmray-backend
- **Documentation:** Create issue in repo
- **Feature requests:** Discuss with PM

---

## ✅ Checklist Cho Frontend

### Trước Khi Bắt Đầu
- [ ] Đọc [FRONTEND_README.md](./FRONTEND_README.md)
- [ ] Đọc [FRONTEND_QUICK_START.md](./FRONTEND_QUICK_START.md)
- [ ] Setup `.env` với API URL & Key
- [ ] Test backend connection (`/actuator/health`)

### Implement Chat Feature
- [ ] Create ChatBox component
- [ ] Integrate `/api/chat/send`
- [ ] Display AI responses
- [ ] Show intent & keywords
- [ ] Add feedback buttons
- [ ] Test với sample data

### Testing
- [ ] Test happy path (send message → get response)
- [ ] Test error cases (network error, empty message)
- [ ] Test on mobile
- [ ] Test performance (response time)

### Ready for Production
- [ ] Error handling complete
- [ ] Loading states
- [ ] Offline mode
- [ ] Analytics tracking

---

## 🎁 Bonus

### Postman Collection
```
Import URL: [TBD]
```

### Sample Frontend Repo
```
GitHub: [TBD]
```

### Video Tutorial
```
YouTube: [TBD]
```

---

## 📅 Timeline

### Week 1 (2026-01-15 - 2026-01-21)
- ✅ Chat API completed
- ✅ Documentation ready
- 🎯 **Frontend starts integration**

### Week 2 (2026-01-22 - 2026-01-28)
- 🚧 Farmer Management API
- 🚧 Frontend testing

### Week 3 (2026-01-29 - 2026-02-04)
- 🚧 Crop Cycle API
- 🚧 Weather API
- 🚧 Disease Alert API

### Week 4 (2026-02-05 - 2026-02-11)
- 🎯 Full integration testing
- 🎯 Bug fixes
- 🎯 Performance optimization

---

## 🚀 Let's Build Something Amazing!

Backend team đã sẵn sàng hỗ trợ team Frontend!

**Questions?** Slack us at #farmray-backend

**Issues?** Open issue in repo

**Need help?** We're here! 🙋‍♂️

---

**Happy Coding! 🌾🚀**

---

**Prepared by:** Backend Team  
**Date:** 2026-01-15  
**Version:** 1.0.0

