// Danh sách sâu bệnh phổ biến
export const RICE_DISEASES = [
  {
    id: 1,
    name: 'Sâu Cuốn Lá',
    type: 'pest',
    severity: 'medium',
    symptoms: ['Lá bị cuốn thành ống', 'Lá héo vàng'],
    conditions: {
      temperature: { min: 25, max: 32 },
      humidity: { min: 70, max: 90 },
    },
    treatment: [
      'Thuốc sinh học B.t (Bacillus thuringiensis)',
      'Trebon 10EC',
      'Regent 50SC',
    ],
  },
  {
    id: 2,
    name: 'Rầy Nâu',
    type: 'pest',
    severity: 'high',
    symptoms: ['Lúa vàng lá rồi khô', 'Bộ lá đốm nâu', 'Cây bị đổ'],
    conditions: {
      temperature: { min: 25, max: 30 },
      humidity: { min: 80, max: 95 },
    },
    treatment: [
      'Admire 200SL',
      'Actara 25WG',
      'Applaud 25WP',
    ],
  },
  {
    id: 3,
    name: 'Đạo Ôn',
    type: 'disease',
    severity: 'high',
    symptoms: ['Đốm nâu trên lá', 'Cổ bông gãy', 'Hạt lép'],
    conditions: {
      temperature: { min: 20, max: 28 },
      humidity: { min: 90, max: 100 },
      rain: true,
    },
    treatment: [
      'Beam 75WG',
      'Filia 525SE',
      'Validacin 3L',
    ],
  },
  {
    id: 4,
    name: 'Bạc Lá',
    type: 'disease',
    severity: 'medium',
    symptoms: ['Lá có vệt bạc', 'Lá vàng héo'],
    conditions: {
      temperature: { min: 25, max: 35 },
      humidity: { min: 60, max: 80 },
    },
    treatment: [
      'Admire 200SL',
      'Confidor 200SL',
    ],
  },
  {
    id: 5,
    name: 'Bệnh Khô Vằn',
    type: 'disease',
    severity: 'medium',
    symptoms: ['Đốm vằn trên lá', 'Lá khô từ gốc'],
    conditions: {
      temperature: { min: 28, max: 35 },
      humidity: { min: 70, max: 85 },
    },
    treatment: [
      'Validacin 3L',
      'Amistar 25SC',
    ],
  },
];

// Giai đoạn sinh trưởng của lúa
export const RICE_GROWTH_STAGES = [
  { id: 1, name: 'Sạ - Gieo hạt', days: 0, riskLevel: 'low' },
  { id: 2, name: 'Mạ - Làm đòng', days: 15, riskLevel: 'medium' },
  { id: 3, name: 'Đẻ nhánh', days: 30, riskLevel: 'high' },
  { id: 4, name: 'Làm đòng', days: 45, riskLevel: 'high' },
  { id: 5, name: 'Trổ bông', days: 60, riskLevel: 'critical' },
  { id: 6, name: 'Chín sữa', days: 75, riskLevel: 'medium' },
  { id: 7, name: 'Chín vàng', days: 90, riskLevel: 'low' },
  { id: 8, name: 'Thu hoạch', days: 100, riskLevel: 'low' },
];
