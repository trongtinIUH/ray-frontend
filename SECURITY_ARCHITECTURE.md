# 🔐 FarmRay Security Architecture

## 📋 Tổng Quan

FarmRay sử dụng **Multi-tier Security Strategy** với 3 cấp độ bảo mật:

1. **Public Endpoints** - Không cần authentication
2. **API Key Protected** - Yêu cầu header `X-API-Key`
3. **Session Token** - Xác thực dữ liệu cá nhân (kiểm tra trong Controller)

---

## 🏗️ Kiến Trúc Security

### 1. Public Endpoints (No Auth Required)

Các endpoint công khai không cần header gì cả:

```
GET  /actuator/health          - Health check
GET  /api/weather/**           - Thông tin thời tiết công khai
POST /api/farmer/register      - Đăng ký nông dân
POST /api/chat/**              - Chat với AI
GET  /api/chat/**              - Lấy lịch sử chat
OPTIONS /**                    - CORS preflight
```

**Ví dụ:**
```bash
curl http://localhost:8080/api/weather/AnGiang/VinhXuong
# Không cần header
```

---

### 2. API Key Protected Endpoints

Tất cả các endpoint còn lại yêu cầu **API Key** trong header:

```
Header: X-API-Key: farmray-dev-key-2026
```

**Ví dụ:**
```bash
curl -H "X-API-Key: farmray-dev-key-2026" \
  http://localhost:8080/api/cropcycle/farmer123
```

**Protected Endpoints:**
- `POST /api/cropcycle/**` - CRUD chu kỳ canh tác
- `GET /api/disease/**` - Thông tin bệnh
- `POST /api/pesticide/**` - Thông tin thuốc trừ sâu
- ... và tất cả các endpoint khác

---

### 3. Session Token (Application Level)

**Session Token** được sử dụng để xác thực dữ liệu cá nhân **ở tầng Controller**, không phải Security Filter.

#### Cách hoạt động:

1. **User đăng ký/login** → Backend trả về Session Token
2. **User gửi request** → Đính kèm token trong header
3. **Controller validate** → Kiểm tra token có khớp với farmerId không

#### Ví dụ Flow:

```java
// 1. Farmer Register - Trả về session token
POST /api/farmer/register
Response: {
  "farmerId": "farmer_123",
  "sessionToken": "farmer_123.1705298400000.abc123def"
}

// 2. Gọi API với session token
GET /api/cropcycle/farmer_123
Headers:
  X-API-Key: farmray-dev-key-2026
  X-Session-Token: farmer_123.1705298400000.abc123def

// 3. Controller validate
@GetMapping("/{farmerId}")
public ResponseEntity<?> getCropCycle(
    @PathVariable String farmerId,
    @RequestHeader("X-Session-Token") String sessionToken
) {
    // Validate token
    if (!sessionTokenManager.validateSessionToken(sessionToken, farmerId)) {
        return ResponseEntity.status(401).body("Invalid session token");
    }
    
    // Proceed with business logic
    return ResponseEntity.ok(cropCycleService.getByFarmerId(farmerId));
}
```

---

## 🔧 Implementation Details

### SecurityConfig.java

```java
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final ApiKeyAuthenticationFilter apiKeyAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/weather/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/farmer/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/chat/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/chat/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // All other endpoints require API Key
                .anyRequest().authenticated()
            )
            .addFilterBefore(apiKeyAuthenticationFilter, 
                           UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### ApiKeyAuthenticationFilter.java

```java
@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    
    private static final String API_KEY_HEADER = "X-API-Key";
    
    @Value("${farmray.api.key:farmray-dev-key-2026}")
    private String validApiKey;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        String apiKey = request.getHeader(API_KEY_HEADER);
        
        // Validate API key
        if (apiKey != null && apiKey.equals(validApiKey)) {
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                    "api-user", null,
                    Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_API_USER")
                    )
                );
            
            SecurityContextHolder.getContext()
                .setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### SessionTokenManager.java

```java
@Component
public class SessionTokenManager {
    
    @Value("${farmray.session.secret:farmray-session-secret-2026}")
    private String sessionSecret;
    
    // Generate token: farmerId.timestamp.hash
    public String generateSessionToken(String farmerId) {
        long timestamp = System.currentTimeMillis();
        String data = farmerId + ":" + timestamp;
        String hash = Integer.toHexString(
            (data + sessionSecret).hashCode()
        );
        
        return farmerId + "." + timestamp + "." + hash;
    }
    
    // Validate token
    public boolean validateSessionToken(String token, String farmerId) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;
            
            String tokenFarmerId = parts[0];
            long timestamp = Long.parseLong(parts[1]);
            String hash = parts[2];
            
            // Check farmerId matches
            if (!tokenFarmerId.equals(farmerId)) {
                return false;
            }
            
            // Check token not expired (24 hours)
            long now = System.currentTimeMillis();
            if (now - timestamp > 24 * 60 * 60 * 1000) {
                return false;
            }
            
            // Validate hash
            String data = tokenFarmerId + ":" + timestamp;
            String expectedHash = Integer.toHexString(
                (data + sessionSecret).hashCode()
            );
            
            return hash.equals(expectedHash);
            
        } catch (Exception e) {
            return false;
        }
    }
    
    // Extract farmerId from token
    public String extractFarmerId(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        
        try {
            String[] parts = token.split("\\.");
            if (parts.length >= 1) {
                return parts[0];
            }
        } catch (Exception e) {
            // Invalid token
        }
        
        return null;
    }
}
```

---

## 🚀 Cách Sử Dụng

### 1. Public Access (No Login)

```bash
# Health check
curl http://localhost:8080/actuator/health

# Get weather
curl http://localhost:8080/api/weather/AnGiang/VinhXuong

# Chat với AI (anonymous)
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "anonymous_123",
    "userMessage": "Lúa bị vàng lá phải làm sao?",
    "sessionId": "temp_session_456"
  }'
```

### 2. API Key Protected

```bash
# Get crop cycle data
curl -H "X-API-Key: farmray-dev-key-2026" \
  http://localhost:8080/api/cropcycle/farmer_123
```

### 3. Session Token (Personal Data)

```bash
# 1. Register farmer - Get session token
curl -X POST http://localhost:8080/api/farmer/register \
  -H "Content-Type: application/json" \
  -d '{
    "farmerName": "Nguyễn Văn A",
    "province": "An Giang",
    "ward": "Vĩnh Xương"
  }'

Response:
{
  "farmerId": "farmer_abc123",
  "sessionToken": "farmer_abc123.1705298400000.def456ghi"
}

# 2. Use session token to access personal data
curl -H "X-API-Key: farmray-dev-key-2026" \
     -H "X-Session-Token: farmer_abc123.1705298400000.def456ghi" \
  http://localhost:8080/api/cropcycle/farmer_abc123
```

---

## 🔒 Security Levels

| Level | Auth Method | Use Case | Example |
|-------|-------------|----------|---------|
| **Public** | None | Health, Weather, Public chat | `/actuator/health` |
| **API Key** | `X-API-Key` | General data access | `/api/cropcycle/**` |
| **Session Token** | `X-Session-Token` + API Key | Personal data | `/api/cropcycle/farmer_123` |

---

## ⚙️ Configuration

### application.properties

```properties
# API Key (change in production!)
farmray.api.key=${FARMRAY_API_KEY:farmray-dev-key-2026}

# Session Token Secret (change in production!)
farmray.session.secret=${FARMRAY_SESSION_SECRET:farmray-session-secret-2026}

# Session Token Expiration (24 hours)
farmray.session.expiration=86400000
```

### Environment Variables (.env)

```bash
# Production
FARMRAY_API_KEY=your-secure-api-key-here
FARMRAY_SESSION_SECRET=your-secure-session-secret-here
```

---

## 🎯 Ưu Điểm

✅ **Đơn giản**: Không phức tạp như JWT  
✅ **Linh hoạt**: Hỗ trợ cả user login và anonymous  
✅ **An toàn**: Session token có expiration (24h)  
✅ **Hiệu năng**: Validation nhanh, không cần decode JWT  
✅ **CORS-friendly**: Không conflict với CORS preflight  

---

## 📝 Notes

1. **API Key** là để bảo vệ backend khỏi abuse, không phải user authentication
2. **Session Token** là để validate ownership của data (farmerId)
3. Token format: `farmerId.timestamp.hash` → Dễ debug, dễ validate
4. Token expiration: 24 giờ → Cân bằng security & UX
5. **Production**: Phải đổi `farmray.api.key` và `farmray.session.secret`

---

## 🔐 So sánh với JWT

| Feature | FarmRay Token | JWT |
|---------|---------------|-----|
| Complexity | ✅ Simple | ❌ Complex |
| Size | ✅ Small (~50 chars) | ❌ Large (~200+ chars) |
| Stateless | ✅ Yes | ✅ Yes |
| Expiration | ✅ Built-in | ✅ Built-in |
| Signature | ✅ Hash | ✅ RSA/HMAC |
| Decode | ✅ Split by `.` | ❌ Base64 + Crypto |
| Overhead | ✅ Low | ❌ Medium |

---

## ✅ Summary

- **Public endpoints**: Không cần auth (weather, health, chat)
- **Protected endpoints**: Cần `X-API-Key` header
- **Personal data**: Cần `X-API-Key` + `X-Session-Token`
- **No JWT dependency**: Đơn giản, nhanh, đủ dùng cho nông dân app
- **Anonymous support**: User không cần đăng ký vẫn chat được

---

**Status**: ✅ READY FOR PRODUCTION

**Last Updated**: 2026-01-15

