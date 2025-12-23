# 📝 Hướng dẫn phát triển Frontend

## 🚀 Bắt đầu nhanh

```bash
# Chạy dev server
npm start

# Mở trình duyệt tại http://localhost:3000
```

## 📂 Cấu trúc thư mục

- **assets/** - Hình ảnh, icons
- **components/** - React components
  - `common/` - Button, Card, Input... (dùng chung)
  - `features/` - WeatherCard, AlertCard... (theo tính năng)
- **pages/** - Các trang (HomePage, WeatherPage...)
- **services/** - API calls (axios)
- **hooks/** - Custom hooks (useGeolocation, useVoice...)
- **store/** - Zustand stores (userStore, weatherStore...)
- **utils/** - Helper functions
- **constants/** - Hằng số, config

## 🎯 Nguyên tắc code

### 1. Components
- Mỗi component 1 file riêng
- Tên file: PascalCase (VD: `Button.jsx`)
- Export default

### 2. Styling
- Dùng TailwindCSS
- Font size tối thiểu: `text-lg` (18px)
- Nút bấm: `min-h-[44px] min-w-[44px]`

### 3. Accessibility
- Icon + Text (không dùng icon đơn)
- Alt text cho hình ảnh
- Aria labels cho buttons

## 📱 Responsive

Breakpoints:
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl)

Luôn code Mobile First!

## 🔗 API Integration

```javascript
import api from '../services/api';

// GET request
const data = await api.get('/crops');

// POST request
const result = await api.post('/crops', { name: 'OM 18' });
```

## 🎤 Voice Features

```javascript
import useVoice from '../hooks/useVoice';

const { speak, startListening, transcript } = useVoice();

// Text-to-Speech
speak('Xin chào bác');

// Speech-to-Text
startListening(); // User nói
console.log(transcript); // Kết quả
```

## 🗺️ Geolocation

```javascript
import useGeolocation from '../hooks/useGeolocation';

const { location, error, loading } = useGeolocation();
// location = { lat, lng, accuracy }
```

## ✅ Checklist trước khi commit

- [ ] Code chạy không lỗi
- [ ] Font size >= 18px
- [ ] Nút bấm >= 44x44px
- [ ] Test trên mobile
- [ ] Không có console.log
