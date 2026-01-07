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
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center mb-4">
            <img src="/forgot-password.png" width="70" alt="Forgot Password" />
          </div>

          <h3 className="text-center text-[18px] text-black font-semibold mb-2">
            Forgot Password?
          </h3>

          <p className="text-center text-sm text-gray-600 mb-5">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>

          <form onSubmit={handleForgotPassword} className="w-full">
            <div className="form-group w-full mb-4">
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
              />
            </div>

            <div className="flex items-center w-full mb-4">
              <Button
                type="submit"
                className="btn-org btn-lg w-full"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      className="mr-2"
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
                className="text-blue-600 hover:underline text-sm"
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
