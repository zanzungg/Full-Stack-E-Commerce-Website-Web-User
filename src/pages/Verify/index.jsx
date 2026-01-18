import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpBox from '../../components/OtpBox';
import { useAuth } from '../../hooks/useAuth';

const OTP_EXPIRE_SECONDS = 600;
const RESEND_COOLDOWN = 60;

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    verifyEmail,
    verifyResetCode,
    resendOTP,
    forgotPassword,
    authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [type, setType] = useState('register');

  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(OTP_EXPIRE_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/login', { replace: true });
      return;
    }

    setEmail(location.state.email);
    setType(location.state.type || 'register');
  }, [location, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((v) => v - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Format thời gian countdown (mm:ss)
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleOtpComplete = async (otp) => {
    if (otp.length !== 6 || otpCountdown === 0) return;

    if (otpCountdown === 0) {
      context.openAlertBox('error', 'OTP has expired. Please resend a new one');
      return;
    }

    if (type === 'register') {
      await verifyEmail(email, otp);
    } else {
      await verifyResetCode(email, otp);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || resendLoading || authLoading) return;

    setResendLoading(true);

    try {
      if (type === 'register') {
        await resendOTP(email);
      } else {
        // reset-password → gửi lại OTP reset
        await forgotPassword(email);
      }

      setResendCooldown(RESEND_COOLDOWN);
      setOtpCountdown(OTP_EXPIRE_SECONDS);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="section py-5 sm:py-8 lg:py-10">
      <div className="container px-3 sm:px-4">
        <div className="card shadow-md w-full max-w-[400px] m-auto rounded-md bg-white p-4 sm:p-5 px-6 sm:px-10">
          <div className="text-center flex items-center justify-center">
            <img
              src="/verify.png"
              width="60"
              className="sm:w-[70px]"
              alt="Verify"
            />
          </div>
          <h3 className="text-center text-[16px] sm:text-[18px] text-black font-semibold mt-3 sm:mt-4 mb-1">
            Verify OTP
          </h3>

          <p className="text-center mt-0 text-[12px] sm:text-sm text-gray-600">
            {type === 'register'
              ? 'Please verify your email to complete registration'
              : 'Please verify OTP to reset your password'}
            <br />
            OTP sent to <span className="text-primary font-bold">{email}</span>
          </p>

          {otpCountdown > 0 ? (
            <div className="text-center mb-2 sm:mb-3">
              <p className="text-[10px] sm:text-xs text-gray-500">
                OTP expires in:{' '}
                <span className="font-semibold text-orange-600">
                  {formatTime(otpCountdown)}
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center mb-2 sm:mb-3">
              <p className="text-[10px] sm:text-xs text-red-600 font-semibold">
                OTP has expired. Please resend a new one.
              </p>
            </div>
          )}

          <OtpBox
            onComplete={handleOtpComplete}
            disabled={authLoading || otpCountdown === 0}
            loading={authLoading}
          />

          <div className="text-center mt-3 sm:mt-4">
            <p className="text-[12px] sm:text-sm text-gray-600">
              Didn't receive code?{' '}
              <button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || resendLoading || authLoading}
                className={`font-semibold transition-colors ${
                  resendCooldown > 0 || resendLoading || authLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-700 hover:underline'
                }`}
                aria-label="Resend OTP"
              >
                {resendLoading
                  ? 'Sending...'
                  : resendCooldown > 0
                    ? `Resend (${resendCooldown}s)`
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
