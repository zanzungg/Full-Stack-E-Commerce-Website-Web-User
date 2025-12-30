import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const { isAuthenticated, loginWithGoogle, authLoading } = useAuthContext();
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
    if (!formFields.password) {
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
    e.stopPropagation();

    console.log('handleRegister called');

    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    try {
      console.log('Attempting registration...');

      const userData = {
        name: formFields.name.trim(),
        email: formFields.email.trim().toLowerCase(),
        password: formFields.password,
      };

      await register(userData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Login with Google successful!');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google login failed:', error);
      if (error.message !== 'Login cancelled') {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            'Google login failed'
        );
      }
    }
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black font-semibold">
            Register with a new account
          </h3>
          <form onSubmit={handleRegister} className="w-full mt-5">
            <div className="form-group w-full mb-5">
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
                disabled={loading}
                autoComplete="name"
              />
            </div>

            <div className="form-group w-full mb-5">
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
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group w-full mb-5 relative">
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
                disabled={loading}
                autoComplete="new-password"
              />

              <Button
                type="button"
                className="absolute! top-2.5 right-2.5 z-50 w-[35px]! h-[35px]! 
                                min-w-[35px]! rounded-full! text-black!"
                onClick={(e) => {
                  e.preventDefault();
                  setIsShowPassword(!isShowPassword);
                }}
                disabled={loading}
              >
                {isShowPassword ? (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-5 relative">
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
                disabled={loading}
                autoComplete="new-password"
              />

              <Button
                type="button"
                className="absolute! top-2.5 right-2.5 z-50 w-[35px]! h-[35px]! 
                                min-w-[35px]! rounded-full! text-black!"
                onClick={(e) => {
                  e.preventDefault();
                  setIsShowConfirmPassword(!isShowConfirmPassword);
                }}
                disabled={loading}
              >
                {isShowConfirmPassword ? (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEye className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                className="btn-org btn-lg w-full"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>

            <p className="text-center">
              Already have an account?
              <Link
                className="link text-[13px] font-semibold text-primary"
                to="/login"
              >
                {' '}
                Login{' '}
              </Link>
            </p>

            <p className="text-center font-medium">
              Or continue with social account
            </p>

            <Button
              type="button"
              className="flex gap-3 w-full bg-[#f1f1f1]! btn-lg text-black! font-medium!"
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
            >
              <FcGoogle className="text-[20px]" />
              {authLoading ? 'Signing in...' : 'Register with Google'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
