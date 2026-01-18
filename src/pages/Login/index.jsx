import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const { login, loginWithGoogle, authLoading, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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

    if (!formFields.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formFields.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formFields.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formFields);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <section className="section py-5 sm:py-8 lg:py-10">
      <div className="container px-3 sm:px-4">
        <div className="card shadow-md w-full max-w-[400px] m-auto rounded-md bg-white p-4 sm:p-5 px-6 sm:px-10">
          <h3 className="text-center text-[16px] sm:text-[18px] text-black font-semibold">
            Login to your account
          </h3>
          <form onSubmit={handleLogin} className="w-full mt-4 sm:mt-5">
            <div className="form-group w-full mb-4 sm:mb-5">
              <TextField
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                className="w-full"
                name="email"
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
                label="Password"
                variant="outlined"
                className="w-full"
                name="password"
                value={formFields.password}
                onChange={onChangeField}
                error={!!errors.password}
                helperText={errors.password}
                disabled={authLoading || false}
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

            <Link
              to="/forgot-password"
              className="link cursor-pointer text-[12px] sm:text-[13px] font-semibold"
            >
              Forgot Password?
            </Link>

            <div className="flex items-center w-full mt-2.5 sm:mt-3 mb-2.5 sm:mb-3">
              <Button
                type="submit"
                className="btn-org btn-lg w-full text-[13px]! sm:text-[14px]! py-2! sm:py-2.5!"
                disabled={authLoading}
              >
                {authLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            <p className="text-center text-[13px] sm:text-[14px]">
              Not Registered?
              <Link
                className="link text-[12px] sm:text-[13px] font-semibold text-primary"
                to="/register"
              >
                {' '}
                Register
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
              {authLoading ? 'Signing in...' : 'Login with Google'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
