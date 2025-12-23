# 🌾 FarmRay - Hệ thống Cảnh báo Mùa vụ cho Nông dân

> Ứng dụng web thông minh giúp nông dân Đồng bằng sông Cửu Long dự báo thời tiết, sâu bệnh và đưa ra lời khuyên canh tác dựa trên AI.

---

## 📖 Giới thiệu

**FarmRay** là một dự án web application được thiết kế đặc biệt cho nông dân trồng lúa tại vùng Đồng bằng sông Cửu Long (ĐBSCL). Hệ thống kết hợp dữ liệu thời tiết real-time, trí tuệ nhân tạo (AI) và kiến thức nông nghiệp để:

- 🌦️ **Dự báo thời tiết** chi tiết theo từng tỉnh/huyện
- 🐛 **Cảnh báo sâu bệnh** dựa trên khí hậu và giai đoạn sinh trưởng
- 💊 **Gợi ý thuốc BVTV** phù hợp với từng loại dịch hại
- 🤖 **Trợ lý AI** hỗ trợ giải đáp thắc mắc 24/7
- 🎤 **Giao diện giọng nói** thân thiện với người lớn tuổi

---

## 🎯 Tính năng chính

### 1. Dashboard Thời tiết & Cảnh báo
- Hiển thị thời tiết hiện tại tại vị trí ruộng lúa (GPS)
- Dự báo 7 ngày (nhiệt độ, độ ẩm, lượng mưa)
- Cảnh báo nguy cơ sâu bệnh (Đạo ôn, Rầy nâu, Sâu cuốn lá...)
- Biểu đồ trực quan, font chữ to, dễ đọc

### 2. Quản lý Vụ mùa
- Nhập thông tin vụ lúa (ngày sạ, giống lúa, diện tích)
- Theo dõi tiến độ sinh trưởng
- Nhắc nhở công việc (rải phân, tưới nước, phun thuốc)

### 3. Trợ lý AI Chatbot
- Hỏi đáp về kỹ thuật canh tác
- Nhận diện bệnh qua hình ảnh (chụp lá lúa)
- Gợi ý xử lý sâu bệnh cụ thể
- Hỗ trợ giọng nói (Speech-to-Text & Text-to-Speech)

### 4. Thân thiện với người lớn tuổi
- Giao diện đơn giản, trực quan
- Font chữ to (18px mặc định)
- Nút bấm to (min 44x44px)
- Tính năng đọc nội dung bằng giọng nói
- Sử dụng icon + emoji trực quan

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **React** 19.x - Framework chính
- **React Router** - Điều hướng trang
- **Zustand** - State management (nhẹ, đơn giản)
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Ant Design Mobile** - UI Components cho mobile
- **Recharts** - Biểu đồ
- **Leaflet** - Bản đồ

### Backend (Repository riêng)
- **Spring Boot** (Java) - RESTful API
- **Spring Security** - Authentication/Authorization
- **PostgreSQL/MySQL** - Database chính
- **AWS S3** - Lưu trữ hình ảnh

### AI Service (Repository riêng)
- **Python** (Flask/FastAPI)
- **Pandas, NumPy** - Xử lý dữ liệu
- **Scikit-learn** - Machine Learning
- **OpenAI API / AWS Bedrock** - Chatbot AI
- **TensorFlow** - Nhận diện hình ảnh

### External APIs
- **OpenWeatherMap** - Dữ liệu thời tiết
- **Web Speech API** - Speech-to-Text, Text-to-Speech

---

## 📦 Cài đặt

### Yêu cầu hệ thống
- **Node.js** >= 16.x
- **npm** >= 8.x

### Các bước cài đặt

1. **Clone repository**
```bash
git clone https://github.com/your-username/farmray-frontend.git
cd farmray-frontend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình Environment Variables**

4. **Chạy development server**
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu trúc dự án

```
src/
├── assets/          # Hình ảnh, icons
├── components/      
│   ├── common/     # Button, Card, Input...
│   └── features/   # WeatherCard, AlertCard...
├── pages/          # HomePage, WeatherPage, ChatBotPage...
├── services/       # API calls
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── utils/          # Helper functions
├── constants/      # Danh sách tỉnh, sâu bệnh, API endpoints
└── styles/         # Global CSS
```

Xem chi tiết tại [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🚀 Scripts

### Development
```bash
npm start          # Chạy dev server (http://localhost:3000)
npm test           # Chạy tests
```

### Production
```bash
npm run build      # Build production
npm run serve      # Serve build folder (cần cài serve: npm i -g serve)
```

---

## 🌐 Kết nối với Backend & AI


## 🎨 Design Principles (Thiết kế cho người lớn tuổi)

### Typography
- Font size: **18px** (base) - Lớn hơn mặc định
- Line height: **1.6** - Dễ đọc
- Font weight: **Medium/Bold** cho tiêu đề

### Colors
- **Primary**: Xanh lúa `#22c55e` - Màu chủ đạo
- **Warning**: Vàng `#eab308` - Cảnh báo
- **Danger**: Đỏ `#ef4444` - Nguy hiểm
- **Background**: Trắng/Kem nhạt - Dễ nhìn
- **Text**: Đen đậm - Độ tương phản cao

### Touch Targets
- Kích thước tối thiểu: **44x44px**
- Padding lớn cho nút bấm
- Khoảng cách giữa các nút >= 8px

### Accessibility
- Hỗ trợ giọng nói (Voice input/output)
- Icon + Text (không dùng icon đơn thuần)
- Emoji trực quan (☀️🌧️⚠️🌾)

---

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Ant Design Mobile](https://mobile.ant.design/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 🤝 Đóng góp

Dự án này là một phần của đồ án tốt nghiệp. Mọi góp ý xin gửi về:
- Email: your-email@example.com
- GitHub Issues: [Link Issues](https://github.com/your-username/farmray-frontend/issues)

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Tác giả

**Your Name**  
Full-stack Developer  : trongtinIUH

---

## 🙏 Lời cảm ơn

- Bộ Nông nghiệp và Phát triển Nông thôn - Cung cấp dữ liệu sâu bệnh
- Cục Bảo vệ Thực vật - Tài liệu kỹ thuật
- Nông dân ĐBSCL - Đóng góp ý kiến thực tế

---

**Made with ❤️ for Vietnamese Farmers 🌾**
# ray-frontend
