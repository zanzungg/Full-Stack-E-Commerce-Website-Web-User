import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

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

  // Google Authentication
  loginWithGoogle: async (userData) => {
    // userData = { name, email, avatar, mobile }
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.GOOGLE_LOGIN,
        userData
      );
      return response;
    } catch (error) {
      // Nếu email đã tồn tại với password login
      if (error.response?.status === 409) {
        const err = new Error('Email already registered with password login');
        err.code = 'GOOGLE_EMAIL_CONFLICT';
        throw err;
      }
    }
  },
};
