import React, { useState, useEffect, useContext } from 'react';
import OtpBox from '../../components/OtpBox';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/services/authService';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(600); // 10 phút = 600 giây
  const [verificationType, setVerificationType] = useState('register');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setVerificationType(location.state.type || 'register');
    } else {
      context.openAlertBox(
        'error',
        'Please register or request password reset first'
      );
      navigate('/register', { replace: true });
    }
  }, [location, navigate, context]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Format thời gian countdown (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpComplete = async (otpValue) => {
    if (otpValue.length !== 6) {
      context.openAlertBox('error', 'Please enter a valid 6-digit OTP');
      return;
    }

    if (otpCountdown === 0) {
      context.openAlertBox('error', 'OTP has expired. Please resend a new one');
      return;
    }

    try {
      if (verificationType === 'register') {
        await auth.verifyEmail(email, otpValue);
      } else if (verificationType === 'reset-password') {
        await auth.verifyResetCode(email, otpValue);
      }
    } catch (error) {
      console.error('Verify error:', error);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || resendLoading || auth.loading) {
      return;
    }

    try {
      setResendLoading(true);

      if (verificationType === 'register') {
        // Resend OTP cho email verification
        await auth.resendOTP(email);
        setCountdown(60);
        setOtpCountdown(600); // Reset countdown 10 phút
      } else if (verificationType === 'reset-password') {
        // Resend OTP cho reset password - gọi trực tiếp service để tránh navigate
        const response = await authService.forgotPassword(email);
        context.openAlertBox(
          'success',
          response.message || `OTP has been resent to ${email}`
        );
        setCountdown(60);
        setOtpCountdown(600); // Reset countdown 10 phút
      }
    } catch (error) {
      console.error('Resend OTP error:', error);

      // Xử lý error cho reset-password type
      if (verificationType === 'reset-password') {
        let errorMessage = 'Failed to resend OTP';

        if (error.response) {
          const data = error.response.data;

          if (data?.message) {
            errorMessage = data.message;
          } else if (error.response.status === 404) {
            errorMessage = 'Email not found';
          } else if (error.response.status === 429) {
            errorMessage = 'Too many requests. Please try again later';
          } else if (error.response.status === 400) {
            errorMessage = 'Invalid email address';
          }
        } else if (error.request) {
          errorMessage =
            'Cannot connect to server. Please check your internet connection.';
        } else {
          errorMessage = error.message || 'An unexpected error occurred';
        }

        context.openAlertBox('error', errorMessage);
      }
      // Error cho register type đã được xử lý trong useAuth hook
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center">
            <img src="/verify.png" width="70" alt="Verify" />
          </div>
          <h3 className="text-center text-[18px] text-black font-semibold mt-4 mb-1">
            Verify OTP
          </h3>

          <p className="text-center mt-0 text-sm text-gray-600">
            {verificationType === 'register'
              ? 'Please verify your email to complete registration'
              : 'Please verify OTP to reset your password'}
            <br />
            OTP sent to <span className="text-primary font-bold">{email}</span>
          </p>

          {otpCountdown > 0 ? (
            <div className="text-center mb-3">
              <p className="text-xs text-gray-500">
                OTP expires in:{' '}
                <span className="font-semibold text-orange-600">
                  {formatTime(otpCountdown)}
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center mb-3">
              <p className="text-xs text-red-600 font-semibold">
                OTP has expired. Please resend a new one.
              </p>
            </div>
          )}

          <OtpBox
            onComplete={handleOtpComplete}
            disabled={auth.loading || otpCountdown === 0}
            loading={auth.loading}
          />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Didn't receive code?{' '}
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || resendLoading || auth.loading}
                className={`font-semibold transition-colors ${
                  countdown > 0 || resendLoading || auth.loading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-700 hover:underline'
                }`}
                aria-label="Resend OTP"
              >
                {resendLoading
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend (${countdown}s)`
                  : 'Resend'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verify;
