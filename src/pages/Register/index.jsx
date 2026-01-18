import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const { register, loginWithGoogle, isAuthenticated, authLoading } = useAuth();

  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onChangeField = (e) => {
    const { name, value } = e.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });

    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formFields.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formFields.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formFields.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    // Validate email
    if (!formFields.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate password
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

    // Validate confirm password
    if (!formFields.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formFields.password !== formFields.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await register({
      name: formFields.name.trim(),
      email: formFields.email.trim().toLowerCase(),
      password: formFields.password,
    });
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <section className="section py-5 sm:py-8 lg:py-10">
      <div className="container px-3 sm:px-4">
        <div className="card shadow-md w-full max-w-[400px] m-auto rounded-md bg-white p-4 sm:p-5 px-6 sm:px-10">
          <h3 className="text-center text-[16px] sm:text-[18px] text-black font-semibold">
            Register with a new account
          </h3>
          <form onSubmit={handleRegister} className="w-full mt-4 sm:mt-5">
            <div className="form-group w-full mb-4 sm:mb-5">
              <TextField
                type="text"
                id="name"
                name="name"
                label="Full Name"
                variant="outlined"
                className="w-full"
                value={formFields.name}
                onChange={onChangeField}
                error={!!errors.name}
                helperText={errors.name}
                disabled={authLoading}
                autoComplete="off"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '13px', sm: '14px' },
                  },
                }}
              />
            </div>

            <div className="form-group w-full mb-4 sm:mb-5">
              <TextField
                type="email"
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                className="w-full"
                value={formFields.email}
                onChange={onChangeField}
                error={!!errors.email}
                helperText={errors.email}
                disabled={authLoading}
                autoComplete="off"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '13px', sm: '14px' },
                  },
                }}
              />
            </div>

            <div className="form-group w-full mb-4 sm:mb-5 relative">
              <TextField
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                className="w-full"
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsShowPassword(!isShowPassword);
                }}
                disabled={authLoading}
              >
                {isShowPassword ? (
                  <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-4 sm:mb-5 relative">
              <TextField
                type={isShowConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
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
                onClick={(e) => {
                  e.preventDefault();
                  setIsShowConfirmPassword(!isShowConfirmPassword);
                }}
                disabled={authLoading}
              >
                {isShowConfirmPassword ? (
                  <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-2.5 sm:mt-3 mb-2.5 sm:mb-3">
              <Button
                type="submit"
                className="btn-org btn-lg w-full text-[13px]! sm:text-[14px]! py-2! sm:py-2.5!"
                disabled={authLoading}
              >
                {authLoading ? 'Registering...' : 'Register'}
              </Button>
            </div>

            <p className="text-center text-[13px] sm:text-[14px]">
              Already have an account?
              <Link
                className="link text-[12px] sm:text-[13px] font-semibold text-primary"
                to="/login"
              >
                {' '}
                Login{' '}
              </Link>
            </p>

            <p className="text-center font-medium text-[13px] sm:text-[14px]">
              Or continue with social account
            </p>

            <Button
              type="button"
              className="flex gap-2 sm:gap-3 w-full bg-[#f1f1f1]! btn-lg text-black! font-medium! text-[13px]! sm:text-[14px]! py-2! sm:py-2.5!"
              onClick={handleGoogleLogin}
              disabled={authLoading}
            >
              <FcGoogle className="text-[18px] sm:text-[20px]" />
              {authLoading ? 'Signing in...' : 'Register with Google'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
