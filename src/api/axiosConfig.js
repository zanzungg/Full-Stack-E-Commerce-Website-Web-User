import axios from 'axios';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from '../config/constants.js';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Promise để track refresh token đang chạy (tránh race condition)
let refreshTokenPromise = null;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Danh sách auth endpoints không cần refresh token
      const authEndpoints = [
        API_ENDPOINTS.LOGIN,
        API_ENDPOINTS.REGISTER,
        API_ENDPOINTS.REFRESH_TOKEN,
        API_ENDPOINTS.VERIFY_EMAIL,
        API_ENDPOINTS.RESEND_OTP,
        API_ENDPOINTS.FORGOT_PASSWORD,
        API_ENDPOINTS.VERIFY_RESET_CODE,
        API_ENDPOINTS.RESET_PASSWORD,
        API_ENDPOINTS.LOGOUT,
      ];

      const requestUrl = originalRequest.url.replace(API_BASE_URL, '');
      const isAuthEndpoint = authEndpoints.some(
        (endpoint) => requestUrl === endpoint
      );

      // Nếu là auth endpoint, throw error luôn
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Đánh dấu request đã retry
      originalRequest._retry = true;

      try {
        // Nếu đang có refresh token đang chạy, chờ nó
        if (refreshTokenPromise) {
          await refreshTokenPromise;
          // Lấy token mới từ localStorage và retry request
          const newToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        }

        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Tạo promise mới để các request khác chờ
        refreshTokenPromise = axios
          .post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
            refreshToken,
          })
          .finally(() => {
            // Reset promise sau khi hoàn thành
            refreshTokenPromise = null;
          });

        const response = await refreshTokenPromise;

        // Backend trả về: { message, error, success, data: { accessToken, refreshToken } }
        const newAccessToken =
          response.data?.data?.accessToken || response.data?.accessToken;
        const newRefreshToken =
          response.data?.data?.refreshToken || response.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        // Lưu tokens mới
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        // Retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Reset promise
        refreshTokenPromise = null;

        // Clear storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);

        // Dispatch custom event để AuthContext handle logout
        window.dispatchEvent(
          new CustomEvent('auth:logout', {
            detail: { reason: 'token_refresh_failed' },
          })
        );

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
