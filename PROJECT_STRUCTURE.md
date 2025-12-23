# 🌾 CẤU TRÚC DỰ ÁN - CẢNH BÁO MÙA VỤ (FarmRay)

## 📁 Cấu trúc thư mục Frontend

```
frontend-react/
│
├── public/                      # File tĩnh
│   ├── index.html
│   ├── manifest.json           # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── assets/                 # Hình ảnh, icons
│   │   ├── images/            # Logo, banner, hình minh họa
│   │   └── icons/             # Icon tùy chỉnh
│   │
│   ├── components/             # React components
│   │   ├── common/            # Components dùng chung
│   │   │   ├── Button.jsx     # Nút bấm to, dễ nhấn
│   │   │   ├── Card.jsx       # Card hiển thị thông tin
│   │   │   ├── Input.jsx      # Input field
│   │   │   ├── Loading.jsx    # Spinner loading
│   │   │   └── VoiceButton.jsx # Nút micro để nói
│   │   │
│   │   └── features/          # Components theo tính năng
│   │       ├── WeatherCard.jsx     # Thẻ hiển thị thời tiết
│   │       ├── AlertCard.jsx       # Thẻ cảnh báo
│   │       ├── DiseaseCard.jsx     # Thẻ sâu bệnh
│   │       ├── CropProgress.jsx    # Tiến độ sinh trưởng
│   │       └── ChatMessage.jsx     # Tin nhắn chatbot
│   │
│   ├── pages/                  # Các trang chính
│   │   ├── Home/
│   │   │   └── HomePage.jsx   # Trang chủ - Dashboard
│   │   ├── Weather/
│   │   │   └── WeatherPage.jsx # Trang thời tiết chi tiết
│   │   ├── Alert/
│   │   │   └── AlertPage.jsx  # Danh sách cảnh báo
│   │   ├── ChatBot/
│   │   │   └── ChatBotPage.jsx # Trợ lý AI
│   │   └── Profile/
│   │       └── ProfilePage.jsx # Thông tin cá nhân, vụ mùa
│   │
│   ├── services/               # API services
│   │   ├── api.js             # Axios instance + interceptors
│   │   ├── authService.js     # Đăng nhập, đăng ký
│   │   ├── weatherService.js  # Lấy dữ liệu thời tiết
│   │   ├── alertService.js    # Lấy cảnh báo
│   │   ├── cropService.js     # Quản lý vụ mùa
│   │   └── aiService.js       # Gọi AI để phân tích
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGeolocation.js  # Lấy GPS location
│   │   ├── useVoice.js        # Speech-to-Text, Text-to-Speech
│   │   └── useWeather.js      # Hook lấy thời tiết
│   │
│   ├── store/                  # Zustand state management
│   │   ├── userStore.js       # Thông tin user, tỉnh đã chọn
│   │   ├── weatherStore.js    # Dữ liệu thời tiết
│   │   └── alertStore.js      # Danh sách cảnh báo
│   │
│   ├── utils/                  # Helper functions
│   │   ├── dateHelper.js      # Format ngày tháng
│   │   ├── formatHelper.js    # Format số, tiền, nhiệt độ
│   │   └── validation.js      # Validate form
│   │
│   ├── constants/              # Hằng số, config
│   │   ├── api.js             # API endpoints
│   │   ├── provinces.js       # Danh sách tỉnh ĐBSCL
│   │   └── diseases.js        # Danh sách sâu bệnh
│   │
│   ├── styles/                 # Global styles
│   │   └── global.css         # Custom CSS
│   │
│   ├── App.js                  # Main App component
│   ├── App.css
│   ├── index.js               # Entry point
│   └── index.css              # Global CSS + Tailwind
│
├── .env                        # Environment variables
├── package.json
├── tailwind.config.js         # Config Tailwind (font size lớn)
└── postcss.config.js
```

---

## 📚 Thư viện đã cài đặt

### Core
- `react-router-dom` - Routing giữa các trang
- `axios` - HTTP client gọi API
- `zustand` - State management (nhẹ hơn Redux)

### UI & Styling
- `antd-mobile` - Component UI mobile-friendly
- `@ant-design/icons` - Icon set
- `react-icons` - Icon đa dạng
- `tailwindcss` - Utility-first CSS
- `postcss`, `autoprefixer` - Build CSS

### Data Visualization
- `recharts` - Biểu đồ nhiệt độ, độ ẩm

### Maps
- `leaflet`, `react-leaflet` - Hiển thị bản đồ tỉnh

### Utilities
- `dayjs` - Xử lý ngày tháng (nhẹ hơn moment.js)
- `react-hook-form` - Form validation

---

## 🎨 Nguyên tắc thiết kế (UX cho người lớn tuổi)

### 1. Typography (Chữ viết)
- **Font size mặc định**: 18px (lớn hơn web thường 16px)
- **Line height**: 1.6 (dễ đọc)
- **Font weight**: Medium/Bold cho tiêu đề
- **Tránh chữ in hoa toàn bộ** (khó đọc)

### 2. Colors (Màu sắc)
- **Primary (Xanh lúa)**: `#22c55e` - Màu chủ đạo
- **Warning (Vàng)**: `#eab308` - Cảnh báo vừa
- **Danger (Đỏ)**: `#ef4444` - Nguy hiểm
- **Background**: Trắng hoặc kem nhạt (#fef9c3)
- **Text**: Đen đậm (#1f2937) - Độ tương phản cao

### 3. Touch Targets (Vùng chạm)
- **Kích thước tối thiểu**: 44x44px
- **Khoảng cách giữa các nút**: >= 8px
- **Nút to, rõ ràng**: Padding lớn

### 4. Icons & Images
- **Dùng icon + text**: Không dùng icon đơn thuần
- **Hình ảnh lớn**: Hình sâu bệnh phải rõ nét, to
- **Emoji**: Sử dụng emoji để trực quan (☀️🌧️⚠️)

### 5. Voice Interface
- **Micro button**: Luôn hiển thị rõ ràng
- **Feedback âm thanh**: Có tiếng "beep" khi bắt đầu/kết thúc ghi âm
- **Text-to-Speech**: Có nút "🔊 Đọc cho tôi nghe"

---

## 🔗 Luồng hoạt động chính

### 1. Đăng ký/Đăng nhập
```
User → Chọn Tỉnh → Nhập thông tin ruộng lúa
  ↓
Hệ thống lưu GPS location
  ↓
Dashboard
```

### 2. Dashboard (Trang chủ)
```
┌─────────────────────────────────┐
│  📍 Đồng Tháp, Cao Lãnh         │ (Tỉnh của user)
│  ☀️ 32°C - Nắng nhẹ            │ (Thời tiết hôm nay)
├─────────────────────────────────┤
│  ⚠️ CẢNH BÁO                    │
│  Độ ẩm cao 95%, nguy cơ Đạo ôn  │ (Cảnh báo đỏ)
│  👉 Nên phun Beam 75WG          │
├─────────────────────────────────┤
│  🌾 Vụ lúa hiện tại             │
│  OM 18 - Ngày 45/90             │
│  Giai đoạn: Làm đòng            │ (Progress bar)
├─────────────────────────────────┤
│  🤖 [Hỏi trợ lý AI]   🎤       │ (Nút to ở giữa)
└─────────────────────────────────┘
```

### 3. Trợ lý AI (ChatBot)
```
User: 🎤 "Lúa bị vàng lá thì phải làm sao?"
  ↓ (Speech-to-Text)
AI phân tích dựa trên:
  - Giai đoạn sinh trưởng
  - Thời tiết gần đây
  - Cơ sở dữ liệu bệnh
  ↓
AI: "Có thể là thiếu đạm hoặc bệnh Khô vằn.
     Bác kiểm tra xem lá có vằn không?
     Nếu có, rải thêm phân đạm..."
  ↓ (Text-to-Speech)
🔊 Đọc to câu trả lời
```

---

## 🔌 Kết nối với Backend & AI

### Backend (Spring Boot) - Port 8080
```
/api/auth/*       - Đăng nhập, đăng ký
/api/user/*       - Thông tin user
/api/crops/*      - Quản lý vụ mùa
/api/alerts/*     - Cảnh báo từ hệ thống
```

### AI Service (Python) - Port 5000
```
/api/ai/predict        - Dự báo sâu bệnh
/api/ai/analyze        - Phân tích thời tiết + giai đoạn lúa
/api/ai/chat           - Chatbot AI
/api/ai/image-recognition - Nhận diện bệnh qua hình ảnh
```

### External APIs
```
OpenWeatherMap - Thời tiết real-time
AWS Bedrock/OpenAI - LLM cho chatbot
```

---

## 🚀 Các bước tiếp theo

### 1. Tạo components cơ bản (common)
- Button.jsx
- Card.jsx
- VoiceButton.jsx

### 2. Tạo HomePage.jsx
- Layout responsive
- Hiển thị thời tiết
- Hiển thị cảnh báo (mock data trước)

### 3. Tạo WeatherPage.jsx
- Biểu đồ nhiệt độ 7 ngày
- Độ ẩm, tốc độ gió

### 4. Tạo ChatBotPage.jsx
- Input text + Voice button
- Hiển thị tin nhắn (chat UI)
- Tích hợp với AI service

### 5. Kết nối Backend
- Viết các service (authService, weatherService...)
- Test API endpoints

### 6. PWA Setup
- Service Worker
- Manifest.json
- Offline mode

---

## 📝 Ghi chú quan trọng

1. **Mobile First**: Luôn test trên mobile trước
2. **Accessibility**: Chú ý contrast ratio, font size
3. **Performance**: Lazy load images, code splitting
4. **Error Handling**: Hiển thị lỗi bằng tiếng Việt dễ hiểu
5. **Offline Mode**: Cache dữ liệu thời tiết gần nhất

---

## 🛠️ Commands hữu ích

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install thêm package
npm install <package-name>
```

---

**Lưu ý**: File này là tài liệu tham khảo. Cập nhật khi có thay đổi cấu trúc.
