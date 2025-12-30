import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { userService } from '../api/services/userService';
import { STORAGE_KEYS } from '../config/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Khôi phục trạng thái khi load trang
  useEffect(() => {
    checkAuth();

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
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      // Nếu có accessToken, fetch profile
      if (token) {
        try {
          const response = await userService.getProfile();
          const userData = response.data;

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem(
            STORAGE_KEYS.USER_INFO,
            JSON.stringify(userData)
          );
        } catch (error) {
          // Nếu có refreshToken, axios interceptor sẽ tự động refresh
          // Nếu không có, logout
          if (!refreshToken) {
            logout();
          }
        }
      }
      // Nếu không có accessToken nhưng có refreshToken
      else if (refreshToken) {
        try {
          // Thử refresh token trước
          const refreshResponse = await authService.refreshToken();

          // Backend trả về: { data: { accessToken, refreshToken } }
          const newAccessToken =
            refreshResponse.data?.accessToken || refreshResponse.accessToken;
          const newRefreshToken =
            refreshResponse.data?.refreshToken || refreshResponse.refreshToken;

          if (newAccessToken) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }

            // Fetch profile sau khi có token mới
            const response = await userService.getProfile();
            const userData = response.data;

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem(
              STORAGE_KEYS.USER_INFO,
              JSON.stringify(userData)
            );
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      } else {
        // Không có cả 2 token → logout
        logout();
      }
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
      const accessToken = response.data?.accessToken;
      const refreshToken = response.data?.refreshToken;

      if (!accessToken) {
        throw new Error('No access token received from server');
      }

      // Save tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      // Fetch user profile
      const profileResponse = await userService.getProfile();
      const userData = profileResponse.data;

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

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      const response = await authService.register(userData);
      return response;
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
      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
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

      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);
      const response = await authService.forgotPassword(email);
      return response;
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
      if (response.resetToken) {
        localStorage.setItem(STORAGE_KEYS.RESET_TOKEN, response.resetToken);
      }

      return response;
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

      return response;
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
      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setAuthLoading(true);
      const response = await userService.updateProfile(profileData);

      // Update user state with new data
      if (response.data) {
        updateUser(response.data);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setAuthLoading(true);
      const response = await userService.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateAvatar = async (file) => {
    try {
      setAuthLoading(true);
      const response = await userService.updateAvatar(file);

      // Update user state with new avatar
      if (response.data) {
        updateUser(response.data);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData));
  };

  const refreshUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      const userData = response.data;
      updateUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authLoading,
    login,
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
