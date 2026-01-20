# 🤖 FarmRay AI Service Integration Guide

> **AI Service:** Python FastAPI + OpenAI GPT-4o-mini  
> **Integration:** Backend tự động gọi AI service, Frontend chỉ cần gọi Backend API  

---

## 📋 Overview

### Architecture Flow
```
Frontend → Backend (Spring Boot) → AI Service (FastAPI) → OpenAI GPT-4o-mini
   ↓           ↓                        ↓                      ↓
Store to    Route to                Process &               Generate
Browser     DynamoDB                Context Builder         AI Response
```

### Key Features
- ✅ **OpenAI GPT-4o-mini** integration
- ✅ **Context-aware responses** (crop cycle, weather, farmer info)
- ✅ **Intent detection** (6 types)
- ✅ **Keyword extraction**
- ✅ **Token usage tracking**
- ✅ **Vietnamese language support**

---

## 🔌 AI Service Endpoints

### Base URL
```
Development: http://localhost:8000
Production:  https://ai.farmray.com
```

---

## 1. Basic Chat

**Endpoint:** `POST /chat`

### Request
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

### Response
```json
{
  "messageId": "uuid-123",
  "sessionId": "session_456",
  "aiResponse": "Vàng lá ở lúa có thể do nhiều nguyên nhân:\n\n1. **Thiếu dinh dưỡng**: Đặc biệt là đạm (N). Bón thêm phân đạm như Ure.\n2. **Bệnh vàng lá**: Do vi khuẩn hoặc virus. Kiểm tra xem có vết nâu không.\n3. **Sâu hại**: Rầy nâu có thể gây vàng lá. Kiểm tra gốc lúa.\n\n**Khuyến nghị:**\n- Bón phân đạm: 50-70 kg Ure/ha\n- Kiểm tra sâu bệnh\n- Thoát nước tốt\n\nBạn muốn tôi giải thích thêm về nguyên nhân nào không?",
  "intent": "DISEASE_INQUIRY",
  "confidenceScore": 0.85,
  "keywords": ["vàng lá", "bệnh", "dinh dưỡng", "sâu hại"],
  "relatedTopics": ["phân bón", "sâu bệnh", "rầy nâu", "đạm"],
  "modelUsed": "gpt-4o-mini",
  "tokensUsed": 724,
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

## 2. Chat with Context

**Endpoint:** `POST /chat/context`

### Request
```json
{
  "chatRequest": {
    "farmerId": "farmer_123",
    "userMessage": "Thời tiết này có ảnh hưởng gì đến lúa không?",
    "sessionId": "session_456"
  },
  "cropCycle": {
    "farmerId": "farmer_123",
    "cycleId": "cycle_789",
    "cropType": "RICE_OM18",
    "season": "Đông Xuân",
    "currentStage": "làm_đòng",
    "farmArea": 2.5,
    "province": "An Giang",
    "ward": "Vĩnh Xương"
  },
  "farmer": {
    "farmerId": "farmer_123",
    "farmerName": "Nguyễn Văn A",
    "province": "An Giang",
    "ward": "Vĩnh Xương"
  },
  "weather": {
    "locationId": "An Giang#Vĩnh Xương",
    "provinceName": "An Giang",
    "wardName": "Vĩnh Xương",
    "temperature": 28.5,
    "humidity": 85,
    "rainfall": 15.0,
    "rainfall24h": 35.0,
    "windSpeed": 5.2
  }
}
```

### Response
```json
{
  "messageId": "uuid-456",
  "sessionId": "session_456",
  "aiResponse": "Dựa vào thời tiết hiện tại ở Vĩnh Xương, An Giang và lúa OM18 của anh đang ở giai đoạn làm đòng:\n\n**Phân tích:**\n- 🌡️ Nhiệt độ 28.5°C: Phù hợp cho giai đoạn làm đòng\n- 💧 Độ ẩm 85%: Hơi cao, cần chú ý bệnh đạo ôn\n- 🌧️ Mưa 35mm/24h: Lượng mưa nhiều\n\n**Ảnh hưởng:**\n1. ✅ Nhiệt độ tốt cho sinh trưởng\n2. ⚠️ Độ ẩm cao + mưa nhiều → Nguy cơ bệnh nấm\n3. ⚠️ Cần thoát nước tốt để tránh ngập úng\n\n**Khuyến nghị:**\n- Kiểm tra hệ thống thoát nước\n- Phun thuốc phòng bệnh đạo ôn (Tricyclazole)\n- Theo dõi lúa hàng ngày\n\nDiện tích 2.5ha của anh cần khoảng 1.5 lít thuốc.",
  "intent": "WEATHER_INQUIRY",
  "confidenceScore": 0.92,
  "keywords": ["thời tiết", "ảnh hưởng", "làm đòng", "mưa"],
  "relatedTopics": ["độ ẩm", "bệnh đạo ôn", "thoát nước"],
  "modelUsed": "gpt-4o-mini",
  "tokensUsed": 856,
  "timestamp": "2026-01-15T10:35:00Z"
}
```

---

## 🔄 Backend Integration

### Backend tự động gọi AI Service

**File:** `FR_ChatHistory_Service.java`

```java
@Service
public class FR_ChatHistory_Service {
    private final AIChatClient aiChatClient;
    
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        // 1. Get context (crop cycle, farmer, weather)
        FR_CropCycle cropCycle = cropCycleService.getActiveCycle(request.getFarmerId());
        FR_Farmer farmer = farmerRepository.findById(request.getFarmerId());
        FR_WeatherData weather = weatherService.getCurrentWeather(farmer.getProvince(), farmer.getWard());
        
        // 2. Call AI service with context
        AIChatResponse aiResponse = aiChatClient.chatWithContext(
            request,
            cropCycle,
            farmer,
            weather
        );
        
        // 3. Save to DynamoDB
        FR_ChatHistory chatHistory = FR_ChatHistory.builder()
            .farmerId(request.getFarmerId())
            .timestamp(Instant.now().toString())
            .messageId(aiResponse.getMessageId())
            .sessionId(aiResponse.getSessionId())
            .userMessage(request.getUserMessage())
            .aiResponse(aiResponse.getAiResponse())
            .intent(aiResponse.getIntent())
            .confidenceScore(aiResponse.getConfidenceScore())
            .keywords(aiResponse.getKeywords())
            .relatedTopics(aiResponse.getRelatedTopics())
            .modelUsed(aiResponse.getModelUsed())
            .tokensUsed(aiResponse.getTokensUsed())
            .build();
        
        chatHistoryRepository.save(chatHistory);
        
        // 4. Return response
        return ChatMessageResponse.from(chatHistory);
    }
}
```

---

## 📊 Intent Detection

### 6 Intent Types

| Intent | Description | Example Questions | Confidence |
|--------|-------------|-------------------|-----------|
| `DISEASE_INQUIRY` | Câu hỏi về sâu bệnh | "Lúa bị vàng lá", "Có sâu đục thân" | 0.8+ |
| `FERTILIZER_INQUIRY` | Câu hỏi về phân bón | "Bón phân gì?", "Thiếu đạm" | 0.8+ |
| `PESTICIDE_INQUIRY` | Câu hỏi về thuốc trừ sâu | "Thuốc trừ rầy nâu", "Phun thuốc gì?" | 0.8+ |
| `WEATHER_INQUIRY` | Câu hỏi về thời tiết | "Mưa nhiều ảnh hưởng gì?", "Nắng nóng" | 0.8+ |
| `CULTIVATION_ADVICE` | Tư vấn kỹ thuật | "Khi nào cấy?", "Làm đòng thế nào?" | 0.8+ |
| `GENERAL_INQUIRY` | Câu hỏi chung | "Xin chào", "Cảm ơn" | 0.5+ |

### Intent-based UI Suggestions

```javascript
// Frontend can use intent to show relevant UI
const getIntentIcon = (intent) => {
  const icons = {
    'DISEASE_INQUIRY': '🦠',
    'FERTILIZER_INQUIRY': '🌾',
    'PESTICIDE_INQUIRY': '💊',
    'WEATHER_INQUIRY': '🌦️',
    'CULTIVATION_ADVICE': '👨‍🌾',
    'GENERAL_INQUIRY': '💬'
  };
  return icons[intent] || '💬';
};

const getSuggestedActions = (intent) => {
  const actions = {
    'DISEASE_INQUIRY': [
      'Xem cảnh báo dịch bệnh',
      'Tìm thuốc trừ bệnh',
      'Gọi chuyên gia'
    ],
    'WEATHER_INQUIRY': [
      'Xem dự báo 7 ngày',
      'Kiểm tra lượng mưa',
      'Lời khuyên cho thời tiết này'
    ]
  };
  return actions[intent] || [];
};
```

---

## 🎯 Keyword Extraction

### How it works
AI tự động trích xuất keywords quan trọng từ câu hỏi:

**Input:** "Lúa bị vàng lá, có vết nâu, phải làm sao?"

**Output:**
```json
{
  "keywords": ["vàng lá", "vết nâu", "bệnh lúa"],
  "relatedTopics": ["đạo ôn lúa", "phân bón", "dinh dưỡng", "sâu bệnh"]
}
```

### Frontend Usage
```javascript
// Show keywords as tags
<div className="keywords">
  {message.keywords.map(keyword => (
    <span key={keyword} className="keyword-tag">
      {keyword}
    </span>
  ))}
</div>

// Show related topics as suggestions
<div className="related-topics">
  <h4>Chủ đề liên quan:</h4>
  {message.relatedTopics.map(topic => (
    <button 
      key={topic}
      onClick={() => askAbout(topic)}
    >
      {topic}
    </button>
  ))}
</div>
```

---

## 💰 Token Usage Tracking

### Why track tokens?
- 💵 **Cost management:** OpenAI charges by token
- 📊 **Analytics:** Track usage patterns
- 🎯 **Optimization:** Identify expensive queries

### Response includes token count
```json
{
  "modelUsed": "gpt-4o-mini",
  "tokensUsed": 724
}
```

### Backend tracks total usage
```java
// Get chat stats
public ChatStatsResponse getChatStats(String farmerId) {
    List<FR_ChatHistory> messages = repository.findByFarmerId(farmerId);
    
    int totalTokens = messages.stream()
        .mapToInt(m -> m.getTokensUsed() != null ? m.getTokensUsed() : 0)
        .sum();
    
    return ChatStatsResponse.builder()
        .totalMessages(messages.size())
        .totalTokensUsed(totalTokens)
        .estimatedCost(calculateCost(totalTokens))
        .build();
}
```

---

## 🌐 Vietnamese Language Support

### AI Service được train với Vietnamese context

**Ví dụ 1: Tên bệnh tiếng Việt**
```
User: "Lúa bị đạo ôn"
AI: "Đạo ôn lúa (Rice Blast) là bệnh nấm nguy hiểm..."
```

**Ví dụ 2: Tên địa phương**
```
User: "Ở An Giang gieo lúa khi nào?"
AI: "Ở An Giang, mùa Đông Xuân thường gieo từ tháng 11-12..."
```

**Ví dụ 3: Thuật ngữ canh tác**
```
User: "Làm đòng là gì?"
AI: "Làm đòng là giai đoạn lúa ngừng đẻ nhánh, bắt đầu làm hạt..."
```

---

## 🔧 Configuration

### Backend application.properties
```properties
# AI Service Configuration
ai.service.url=http://localhost:8000
ai.service.timeout=30000

# OpenAI Configuration (set in AI service .env)
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini
```

### AI Service .env
```bash
# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Server
HOST=0.0.0.0
PORT=8000

# CORS
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

---

## 📈 AI Response Quality

### Factors affecting quality

1. **Context completeness**
   - ✅ Better: Include crop cycle, weather, farmer info
   - ❌ Worse: Only send user message

2. **Question specificity**
   - ✅ Better: "Lúa OM18 giai đoạn làm đòng bị vàng lá"
   - ❌ Worse: "Lúa có vấn đề"

3. **Session continuity**
   - ✅ Better: Keep sessionId consistent
   - ❌ Worse: New session for every message

### Example: Good vs Bad

**❌ Bad Request (Low quality response)**
```json
{
  "farmerId": "farmer_123",
  "userMessage": "Bệnh"
}
```

**✅ Good Request (High quality response)**
```json
{
  "farmerId": "farmer_123",
  "userMessage": "Lúa OM18 của tôi giai đoạn đẻ nhánh bị vàng lá, có vết nâu",
  "sessionId": "session_456",
  "currentCropType": "RICE_OM18",
  "currentStage": "đẻ_nhánh",
  "location": "An Giang#Vĩnh Xương"
}
```

---

## 🐛 Error Handling

### AI Service Errors

**1. OpenAI API Error**
```json
{
  "success": false,
  "message": "AI service error: OpenAI API timeout"
}
```

**2. Service Unavailable**
```json
{
  "success": false,
  "message": "AI service is unavailable"
}
```

**3. Invalid Request**
```json
{
  "success": false,
  "message": "farmerId and userMessage are required"
}
```

### Frontend Handling
```javascript
try {
  const response = await chatService.sendMessage(message);
  
  if (!response.success) {
    // Show error to user
    toast.error(response.message);
  }
} catch (error) {
  // Network error
  toast.error('Không thể kết nối đến server');
}
```

---

## 📊 Analytics & Monitoring

### Track AI Usage

**Backend logs:**
```
2026-01-15 10:30:00 - 🤖 [AI] Sending chat request for farmer: farmer_123
2026-01-15 10:30:03 - ✅ [AI] Received response - Intent: DISEASE_INQUIRY, Tokens: 724
```

**Metrics to track:**
1. **Response time:** < 5s target
2. **Token usage:** Average per message
3. **Intent distribution:** Which topics are most common
4. **Confidence scores:** Average confidence
5. **Error rate:** AI service errors

---

## 🚀 Performance Optimization

### 1. Context Caching
```java
// Cache crop cycle, farmer, weather for 5 minutes
@Cacheable(value = "farmerContext", key = "#farmerId")
public FarmerContext getFarmerContext(String farmerId) {
    // Fetch all context data
}
```

### 2. Async Processing
```java
@Async
public CompletableFuture<AIChatResponse> chatAsync(ChatMessageRequest request) {
    return CompletableFuture.completedFuture(
        aiChatClient.chatWithContext(request, ...)
    );
}
```

### 3. Response Streaming (Future)
```
// Stream AI response word-by-word
WebSocket: /ws/chat/{sessionId}
```

---

## 🔮 Future Enhancements

### Planned Features
1. 🎤 **Voice Input:** Convert speech to text
2. 📸 **Image Analysis:** Detect diseases from photos
3. 🌍 **Multi-language:** English, Khmer support
4. 📚 **Knowledge Base:** RAG with agriculture documents
5. 🔔 **Proactive Alerts:** AI suggests actions based on context
6. 📊 **Advanced Analytics:** Predict crop yields, disease risks

---

## 📝 Testing AI Service

### Test Endpoints

**1. Health Check**
```bash
curl http://localhost:8000/health
```

**2. Basic Chat**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "test_farmer",
    "userMessage": "Lúa bị vàng lá",
    "sessionId": "test_session"
  }'
```

**3. Chat with Context**
```bash
curl -X POST http://localhost:8000/chat/context \
  -H "Content-Type: application/json" \
  -d @test_context_request.json
```

---

## 📞 Support

### AI Service Issues
- Check logs: `docker logs ai-service`
- Verify OpenAI API key
- Check rate limits
- Monitor token usage

### Integration Issues
- Verify AI service URL in `application.properties`
- Check network connectivity
- Review timeout settings
- Check request/response format

---

## ✅ Integration Checklist

- [x] AI Service running on port 8000
- [x] OpenAI API key configured
- [x] Backend can reach AI service
- [x] Chat endpoint works
- [x] Context endpoint works
- [x] Responses saved to DynamoDB
- [x] Intent detection working
- [x] Keywords extracted
- [x] Vietnamese responses correct
- [ ] Frontend displays AI responses
- [ ] Error handling implemented
- [ ] Analytics dashboard setup

---

**AI Integration Complete! 🤖✨**

