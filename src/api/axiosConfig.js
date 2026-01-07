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
    return response;
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
        API_ENDPOINTS.GOOGLE_LOGIN,
      ];

      const requestPath = new URL(originalRequest.url, API_BASE_URL).pathname;

      if (authEndpoints.includes(requestPath)) {
        return Promise.reject(error);
      }

      // Đánh dấu request đã retry
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (!refreshToken) throw new Error('No refresh token');

          // Use raw axios to avoid interceptor recursion
          refreshTokenPromise = axios
            .post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
              refreshToken,
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }

        const refreshResponse = await refreshTokenPromise;
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
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
