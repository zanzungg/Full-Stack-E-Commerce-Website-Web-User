import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword, authLoading } = useAuth();

  const [formFields, setFormFields] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};

    if (!formFields.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formFields.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await forgotPassword(formFields.email.trim().toLowerCase());
  };

  return (
    <section className="section py-5 sm:py-8 lg:py-10">
      <div className="container px-3 sm:px-4">
        <div className="card shadow-md w-full max-w-[400px] m-auto rounded-md bg-white p-4 sm:p-5 px-6 sm:px-10">
          <div className="text-center flex items-center justify-center mb-3 sm:mb-4">
            <img
              src="/forgot-password.png"
              width="60"
              className="sm:w-[70px]"
              alt="Forgot Password"
            />
          </div>

          <h3 className="text-center text-[16px] sm:text-[18px] text-black font-semibold mb-1.5 sm:mb-2">
            Forgot Password?
          </h3>

          <p className="text-center text-[12px] sm:text-sm text-gray-600 mb-4 sm:mb-5 px-2">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>

          <form onSubmit={handleForgotPassword} className="w-full">
            <div className="form-group w-full mb-3 sm:mb-4">
              <TextField
                type="email"
                id="email"
                label="Email Address"
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
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:underline text-[12px] sm:text-sm"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
