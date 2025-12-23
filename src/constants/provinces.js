// Danh sách các tỉnh thành ĐBSCL
export const MEKONG_PROVINCES = [
  { id: 1, code: 'AG', name: 'An Giang', lat: 10.5216, lng: 105.1258 },
  { id: 2, code: 'BL', name: 'Bạc Liêu', lat: 9.2941, lng: 105.7215 },
  { id: 3, code: 'BT', name: 'Bến Tre', lat: 10.2433, lng: 106.3755 },
  { id: 4, code: 'CM', name: 'Cà Mau', lat: 9.1526, lng: 105.1960 },
  { id: 5, code: 'CT', name: 'Cần Thơ', lat: 10.0452, lng: 105.7469 },
  { id: 6, code: 'DT', name: 'Đồng Tháp', lat: 10.4938, lng: 105.6881 },
  { id: 7, code: 'HG', name: 'Hậu Giang', lat: 9.7579, lng: 105.6412 },
  { id: 8, code: 'KG', name: 'Kiên Giang', lat: 10.0125, lng: 105.0809 },
  { id: 9, code: 'LA', name: 'Long An', lat: 10.6957, lng: 106.2431 },
  { id: 10, code: 'ST', name: 'Sóc Trăng', lat: 9.6037, lng: 105.9740 },
  { id: 11, code: 'TG', name: 'Tiền Giang', lat: 10.4493, lng: 106.3420 },
  { id: 12, code: 'TV', name: 'Trà Vinh', lat: 9.8124, lng: 106.2992 },
  { id: 13, code: 'VL', name: 'Vĩnh Long', lat: 10.2397, lng: 105.9571 },
];

// Loại giống lúa phổ biến ở ĐBSCL
export const RICE_VARIETIES = [
  { id: 1, name: 'OM 18', duration: 85, season: ['Đông Xuân', 'Hè Thu'] },
  { id: 2, name: 'ST 25', duration: 95, season: ['Đông Xuân', 'Hè Thu'] },
  { id: 3, name: 'Đài Thơm 8', duration: 90, season: ['Đông Xuân', 'Hè Thu'] },
  { id: 4, name: 'OM 5451', duration: 95, season: ['Đông Xuân', 'Hè Thu'] },
  { id: 5, name: 'Nhật Bản', duration: 110, season: ['Đông Xuân'] },
  { id: 6, name: 'Jasmine 85', duration: 100, season: ['Đông Xuân', 'Hè Thu'] },
];

// Các mùa vụ
export const CROP_SEASONS = [
  { id: 1, name: 'Đông Xuân', startMonth: 11, endMonth: 3 },
  { id: 2, name: 'Hè Thu', startMonth: 4, endMonth: 7 },
  { id: 3, name: 'Thu Đông', startMonth: 8, endMonth: 10 },
];
