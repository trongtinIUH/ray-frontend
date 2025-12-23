import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store quản lý thông tin người dùng
const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      selectedProvince: null,
      currentCrop: null,
      
      // Đăng nhập
      login: (userData, tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({
          user: userData,
          isAuthenticated: true,
        });
      },
      
      // Đăng xuất
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          selectedProvince: null,
          currentCrop: null,
        });
      },
      
      // Cập nhật thông tin user
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      // Chọn tỉnh
      setProvince: (province) => {
        set({ selectedProvince: province });
      },
      
      // Chọn vụ mùa hiện tại
      setCrop: (crop) => {
        set({ currentCrop: crop });
      },
    }),
    {
      name: 'user-storage', // Tên key trong localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedProvince: state.selectedProvince,
        currentCrop: state.currentCrop,
      }),
    }
  )
);

export default useUserStore;
