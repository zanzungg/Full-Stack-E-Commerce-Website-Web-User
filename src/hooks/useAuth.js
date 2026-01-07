import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MyContext } from '../App';
import { useAuthContext } from '../contexts/AuthContext';
import { mapHttpError } from '../utils/mapHttpError';

export const useAuth = () => {
  const { openAlertBox } = useContext(MyContext);
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (credentials) => {
    try {
      const response = await authContext.login(credentials);

      openAlertBox('success', 'Login successful!');

      // Redirect về trang trước đó hoặc home
      const from = location.state?.from?.pathname || '/';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Invalid email or password'));
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await authContext.loginWithGoogle();

      openAlertBox('success', 'Login with Google successful!');

      const from = location.state?.from?.pathname || '/';
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

      return response;
    } catch (err) {
      // Bỏ qua trường hợp user đóng popup
      if (err.message === 'Login cancelled') {
        return;
      }

      openAlertBox('error', mapHttpError(err, 'Google login failed'));
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authContext.register(userData);

      openAlertBox(
        'success',
        'Registration successful! Please verify your email.'
      );

      // Navigate sang verify page với email và type
      navigate('/verify', {
        state: {
          email: userData.email,
          type: 'register',
        },
      });

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Registration failed'));
      throw err;
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await authContext.verifyEmail(email, otp);

      openAlertBox('success', 'Email verified successfully!');

      // Navigate về login sau khi verify thành công
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Verification failed'));
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authContext.forgotPassword(email);

      openAlertBox('success', `OTP sent to ${email}`);

      // Navigate sang verify page
      setTimeout(() => {
        navigate('/verify', {
          state: {
            email,
            type: 'reset-password',
          },
        });
      }, 1000);

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to send OTP'));
      throw err;
    }
  };

  const verifyResetCode = async (email, otp) => {
    try {
      const response = await authContext.verifyResetCode(email, otp);

      openAlertBox('success', 'OTP verified successfully!');

      // Navigate sang reset password với email và resetToken
      const resetToken = response?.resetToken || response?.data?.resetToken;
      navigate('/reset-password', {
        state: {
          email,
          resetToken,
        },
      });

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'OTP verification failed'));
      throw err;
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await authContext.resetPassword(resetToken, newPassword);

      openAlertBox('success', 'Password reset successfully!');

      // Navigate về login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to reset password'));
      throw err;
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await authContext.resendOTP(email);

      openAlertBox('success', 'OTP has been resent to your email');

      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to resend OTP'));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authContext.logout();
      openAlertBox('success', 'Logged out successfully!');
    } catch (err) {
      // Vẫn redirect về login ngay cả khi có lỗi
      navigate('/login', { replace: true });
    } finally {
      // Redirect về login
      navigate('/login', { replace: true });
    }
  };

  return {
    // State
    isAuthenticated: authContext.isAuthenticated,
    authLoading: authContext.authLoading,
    loading: authContext.loading,

    // Auth methods
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    resendOTP,
    logout,
  };
};
