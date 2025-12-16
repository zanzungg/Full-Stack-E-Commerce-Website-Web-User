import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../config/constants';

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response;
  },

  register: async (userData) => {
    // userData = { name, email, phone, password }
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    localStorage.clear();
    return response;
  },

  verifyEmail: async (otpData) => {
    // otpData = { email, otp }
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_EMAIL,
      otpData
    );
    return response;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response;
  },

  verifyResetCode: async (otpData) => {
    // otpData = { email, otp }
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_RESET_CODE,
      otpData
    );
    return response;
  },

  resetPassword: async (resetData) => {
    // resetData = { resetToken, newPassword }
    const response = await axiosInstance.post(
      API_ENDPOINTS.RESET_PASSWORD,
      resetData
    );
    return response;
  },

  // Resend OTP cho email verification
  resendVerificationOTP: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESEND_OTP, {
      email,
    });
    return response;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response;
  },
};
