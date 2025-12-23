import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('vi');
dayjs.extend(relativeTime);

// Format ngày tháng
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return dayjs(date).format(format);
};

// Format ngày giờ
export const formatDateTime = (date, format = 'DD/MM/YYYY HH:mm') => {
  return dayjs(date).format(format);
};

// Lấy thời gian tương đối (vừa xong, 2 giờ trước...)
export const fromNow = (date) => {
  return dayjs(date).fromNow();
};

// Tính số ngày từ ngày sạ đến hiện tại
export const getDaysFromPlanting = (plantingDate) => {
  const now = dayjs();
  const planted = dayjs(plantingDate);
  return now.diff(planted, 'day');
};

// Xác định giai đoạn sinh trưởng dựa vào số ngày
export const getGrowthStage = (daysFromPlanting) => {
  if (daysFromPlanting < 15) return 'Sạ - Gieo hạt';
  if (daysFromPlanting < 30) return 'Mạ - Làm đòng';
  if (daysFromPlanting < 45) return 'Đẻ nhánh';
  if (daysFromPlanting < 60) return 'Làm đòng';
  if (daysFromPlanting < 75) return 'Trổ bông';
  if (daysFromPlanting < 90) return 'Chín sữa';
  if (daysFromPlanting < 100) return 'Chín vàng';
  return 'Thu hoạch';
};

// Tính ngày dự kiến thu hoạch
export const getExpectedHarvestDate = (plantingDate, duration = 90) => {
  return dayjs(plantingDate).add(duration, 'day').format('DD/MM/YYYY');
};
