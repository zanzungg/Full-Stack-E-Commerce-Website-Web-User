import { useContext, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useAuth } from '../../hooks/useAuth';
import { STORAGE_KEYS } from '../../config/constants';

const ResetPassword = () => {
  const { openAlertBox } = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [formFields, setFormFields] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Lấy email và resetToken từ location state hoặc localStorage
    const stateEmail = location.state?.email;
    const stateResetToken =
      location.state?.resetToken ||
      localStorage.getItem(STORAGE_KEYS.RESET_TOKEN);

    if (!stateEmail || !stateResetToken) {
      openAlertBox('error', 'Invalid reset password link. Please try again.');
      navigate('/forgot-password', { replace: true });
      return;
    }

    setEmail(stateEmail);
    setResetToken(stateResetToken);
  }, [location, navigate, openAlertBox]);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formFields.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formFields.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formFields.password.length > 20) {
      newErrors.password = 'Password must not exceed 20 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formFields.password)) {
      newErrors.password =
        'Password must contain uppercase, lowercase and number';
    }

    if (!formFields.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formFields.password !== formFields.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await resetPassword(resetToken, formFields.password);
  };

  return (
    <section className="section py-5 sm:py-8 lg:py-10">
      <div className="container px-3 sm:px-4">
        <div className="card shadow-md w-full max-w-[400px] m-auto rounded-md bg-white p-4 sm:p-5 px-6 sm:px-10">
          <div className="text-center flex items-center justify-center mb-3 sm:mb-4">
            <img
              src="/reset-password.png"
              width="60"
              className="sm:w-[70px]"
              alt="Reset Password"
            />
          </div>

          <h3 className="text-center text-[16px] sm:text-[18px] text-black font-semibold mb-1.5 sm:mb-2">
            Reset Password
          </h3>

          <p className="text-center text-[12px] sm:text-sm text-gray-600 mb-4 sm:mb-5 px-2">
            Enter your new password for{' '}
            <span className="font-bold text-primary">{email}</span>
          </p>

          <form onSubmit={handleResetPassword} className="w-full">
            <div className="form-group w-full mb-3 sm:mb-4 relative">
              <TextField
                type={showPassword ? 'text' : 'password'}
                id="password"
                label="New Password"
                variant="outlined"
                className="w-full"
                name="password"
                value={formFields.password}
                onChange={onChangeField}
                error={!!errors.password}
                helperText={errors.password}
                disabled={authLoading}
                autoComplete="off"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '13px', sm: '14px' },
                  },
                }}
              />
              <Button
                type="button"
                className="absolute! top-1/2 right-2 sm:right-2.5 -translate-y-1/2 z-50 w-8! h-8! sm:w-[35px]! sm:h-[35px]! 
                                min-w-8! sm:min-w-[35px]! rounded-full! text-black!"
                onClick={() => setShowPassword(!showPassword)}
                disabled={authLoading}
              >
                {showPassword ? (
                  <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-3 sm:mb-4 relative">
              <TextField
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={onChangeField}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={authLoading}
                autoComplete="off"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '13px', sm: '14px' },
                  },
                }}
              />
              <Button
                type="button"
                className="absolute! top-1/2 right-2 sm:right-2.5 -translate-y-1/2 z-50 w-8! h-8! sm:w-[35px]! sm:h-[35px]! 
                                min-w-8! sm:min-w-[35px]! rounded-full! text-black!"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={authLoading}
              >
                {showConfirmPassword ? (
                  <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mb-3 sm:mb-4">
              <Button
                type="submit"
                className="btn-org btn-lg w-full text-[13px]! sm:text-[14px]! py-2! sm:py-2.5!"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <CircularProgress
                      size={18}
                      className="mr-1.5 sm:mr-2"
                      color="inherit"
                    />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
