import { createContext, useState, useContext, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authService } from '../api/services/authService';
import { userService } from '../api/services/userService';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const queryClient = useQueryClient();

  // Khôi phục trạng thái khi load trang
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }

    // Lắng nghe event logout từ axios interceptor
    const handleAuthLogout = (event) => {
      logout();
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await userService.getProfile();
      updateUser(response.data?.data);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setAuthLoading(true);

      const response = await authService.login(credentials);

      // Backend trả về: { data: { accessToken, refreshToken } }
      const accessToken = response.data?.data.accessToken;
      const refreshToken = response.data?.data.refreshToken;

      // Save tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      // Fetch user profile
      const profileResponse = await userService.getProfile();
      const userData = profileResponse.data?.data;

      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthLoading(true);

      // Đăng nhập với Google qua Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Chuẩn bị dữ liệu user để gửi lên backend
      const userData = {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || '',
        mobile: firebaseUser.phoneNumber || '',
      };

      // Gửi thông tin user lên backend
      const response = await authService.loginWithGoogle(userData);

      // Backend trả về: { data: { user, accessToken, refreshToken } }
      const responseData = response.data?.data;

      if (!responseData || !responseData.accessToken) {
        throw new Error('No access token received from server');
      }

      const accessToken = responseData.accessToken;
      const refreshToken = responseData.refreshToken;
      const userInfo = responseData.user;
      console.log('User info from backend:', userInfo);

      // Save tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      // Save user info
      if (userInfo) {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      // Nếu user đóng popup, không hiển thị lỗi
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelled');
      }
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      const response = await authService.register(userData);
      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      setAuthLoading(true);
      const response = await authService.verifyEmail({ email, otp });
      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);
      const response = await authService.forgotPassword(email);
      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyResetCode = async (email, otp) => {
    try {
      setAuthLoading(true);
      const response = await authService.verifyResetCode({ email, otp });

      // Lưu resetToken vào localStorage
      if (response?.data?.resetToken) {
        localStorage.setItem(
          STORAGE_KEYS.RESET_TOKEN,
          response.data.resetToken
        );
      }

      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      setAuthLoading(true);
      const response = await authService.resetPassword({
        resetToken,
        newPassword,
      });

      // Clear resetToken sau khi thành công
      localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);

      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const resendOTP = async (email) => {
    try {
      setAuthLoading(true);
      const response = await authService.resendVerificationOTP(email);
      return response?.data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await userService.updateProfile(profileData);
      // Update user state with new data
      if (response?.data?.data) {
        updateUser(response.data.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await userService.changePassword(passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateAvatar = async (file) => {
    try {
      const response = await userService.updateAvatar(file);
      await refreshUserProfile();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(newUser));
      return newUser;
    });
  };

  const refreshUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      const userData = response?.data?.data;
      updateUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);

      // Kiểm tra có token không trước khi gọi API
      const hasToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (hasToken) {
        try {
          // Gọi API logout để invalidate token trên server
          await authService.logout();
        } catch (apiError) {
          // Nếu 401, token đã hết hạn, vẫn tiếp tục logout client
        }
      } else {
      }
    } catch (error) {
      // Vẫn tiếp tục logout ở client ngay cả khi API thất bại
    } finally {
      // Clear tất cả dữ liệu local
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);

      // Clear React Query cache
      queryClient.clear();

      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authLoading,
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    resendOTP,
    updateProfile,
    changePassword,
    updateAvatar,
    checkAuth,
    updateUser,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
