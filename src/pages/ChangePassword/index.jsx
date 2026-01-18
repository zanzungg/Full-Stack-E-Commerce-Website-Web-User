import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import AccountSidebar from '../../components/AccountSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

const ChangePassword = () => {
  const { user, changePassword } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuth();

  const [formFields, setFormFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Nếu KHÔNG phải Google user, cần current password
    if (!user?.signUpWithGoogle && !formFields.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!formFields.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formFields.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (formFields.newPassword.length > 20) {
      newErrors.newPassword = 'Password must not exceed 20 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formFields.newPassword)) {
      newErrors.newPassword =
        'Password must contain uppercase, lowercase and number';
    }

    // Check if new password same as current (chỉ cho regular user)
    if (
      !user?.signUpWithGoogle &&
      formFields.newPassword === formFields.currentPassword
    ) {
      newErrors.newPassword =
        'New password must be different from current password';
    }

    // Validate confirm password
    if (!formFields.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formFields.newPassword !== formFields.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = user?.signUpWithGoogle
        ? { newPassword: formFields.newPassword }
        : {
            currentPassword: formFields.currentPassword,
            newPassword: formFields.newPassword,
          };

      await changePassword(payload);

      setTimeout(() => {
        logout();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormFields({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setShow({ current: false, new: false, confirm: false });
  };

  return (
    <section className="py-5 sm:py-8 lg:py-10 w-full">
      <div className="container px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[75%]">
            <div className="card bg-white shadow-md rounded-md p-4 sm:p-5 lg:p-6">
              <div className="mb-4 sm:mb-5 lg:mb-6">
                <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold">
                  {user?.signUpWithGoogle ? 'Set Password' : 'Change Password'}
                </h2>
                <p className="text-[12px] sm:text-[13px] lg:text-sm text-gray-600 mt-1.5 sm:mt-2">
                  {user?.signUpWithGoogle
                    ? 'Set a password to enable email/password login for your account'
                    : 'Update your password to keep your account secure'}
                </p>
              </div>

              {/* Info Alert for Google Users */}
              {user?.signUpWithGoogle && (
                <div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-md mb-4 sm:mb-5">
                  <p className="text-[12px] sm:text-sm text-blue-900">
                    <strong>Note:</strong> You signed up with Google. Setting a
                    password will allow you to login using both Google and
                    email/password methods.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="max-w-full sm:max-w-[500px]">
                  {/* Current Password - Only show for regular users */}
                  {!user?.signUpWithGoogle && (
                    <div className="form-group mb-3 sm:mb-4 relative">
                      <TextField
                        type={show.current ? 'text' : 'password'}
                        id="currentPassword"
                        label="Current Password"
                        variant="outlined"
                        className="w-full"
                        name="currentPassword"
                        value={formFields.currentPassword}
                        onChange={onChangeField}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
                        disabled={isSubmitting}
                        autoComplete="off"
                        required
                        size="small"
                        sx={{
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '13px', sm: '14px' },
                          },
                        }}
                      />
                      <Button
                        type="button"
                        className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-2.5 z-50 w-8! h-8! sm:w-[35px]! sm:h-[35px]! 
                                        min-w-8! sm:min-w-[35px]! rounded-full! text-black!"
                        onClick={() =>
                          setShow({ ...show, current: !show.current })
                        }
                        disabled={isSubmitting}
                      >
                        {show.current ? (
                          <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                        ) : (
                          <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                        )}
                      </Button>
                    </div>
                  )}

                  {/* New Password */}
                  <div className="form-group mb-3 sm:mb-4 relative">
                    <TextField
                      type={show.new ? 'text' : 'password'}
                      id="newPassword"
                      label={
                        user?.signUpWithGoogle ? 'Password' : 'New Password'
                      }
                      variant="outlined"
                      className="w-full"
                      name="newPassword"
                      value={formFields.newPassword}
                      onChange={onChangeField}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      disabled={isSubmitting}
                      autoComplete="off"
                      required
                      size="small"
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '13px', sm: '14px' },
                        },
                      }}
                    />
                    <Button
                      type="button"
                      className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-2.5 z-50 w-8! h-8! sm:w-[35px]! sm:h-[35px]! 
                                        min-w-8! sm:min-w-[35px]! rounded-full! text-black!"
                      onClick={() => setShow({ ...show, new: !show.new })}
                      disabled={isSubmitting}
                    >
                      {show.new ? (
                        <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                      ) : (
                        <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                      )}
                    </Button>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group mb-3 sm:mb-4 relative">
                    <TextField
                      type={show.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      label={
                        user?.signUpWithGoogle
                          ? 'Confirm Password'
                          : 'Confirm New Password'
                      }
                      variant="outlined"
                      className="w-full"
                      name="confirmPassword"
                      value={formFields.confirmPassword}
                      onChange={onChangeField}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      disabled={isSubmitting}
                      autoComplete="off"
                      required
                      size="small"
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: { xs: '13px', sm: '14px' },
                        },
                      }}
                    />
                    <Button
                      type="button"
                      className="absolute! top-1/2 -translate-y-1/2 right-2 sm:right-2.5 z-50 w-8! h-8! sm:w-[35px]! sm:h-[35px]! 
                                        min-w-8! sm:min-w-[35px]! rounded-full! text-black!"
                      onClick={() =>
                        setShow({ ...show, confirm: !show.confirm })
                      }
                      disabled={isSubmitting}
                    >
                      {show.confirm ? (
                        <IoMdEyeOff className="text-[18px] sm:text-[20px] opacity-75" />
                      ) : (
                        <IoMdEye className="text-[18px] sm:text-[20px] opacity-75" />
                      )}
                    </Button>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-5">
                    <p className="text-[12px] sm:text-sm font-semibold text-blue-900 mb-1.5 sm:mb-2">
                      Password Requirements:
                    </p>
                    <ul className="text-[11px] sm:text-xs text-blue-800 space-y-0.5 sm:space-y-1 list-disc list-inside">
                      <li>At least 6 characters long</li>
                      <li>Must contain at least one uppercase letter</li>
                      <li>Must contain at least one lowercase letter</li>
                      <li>Must contain at least one number</li>
                      <li>Maximum 20 characters</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      type="submit"
                      className="btn-org w-full sm:w-auto text-[13px]! sm:text-[14px]! px-4! sm:px-6! py-2! sm:py-2.5!"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <CircularProgress
                            size={14}
                            className="mr-1.5 sm:mr-2"
                            color="inherit"
                          />
                          {user?.signUpWithGoogle
                            ? 'Setting...'
                            : 'Changing...'}
                        </>
                      ) : user?.signUpWithGoogle ? (
                        'Set Password'
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="btn-outline w-full sm:w-auto text-[13px]! sm:text-[14px]! px-4! sm:px-6! py-2! sm:py-2.5!"
                      onClick={handleReset}
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Security Tips */}
            <div className="card bg-white shadow-md rounded-md p-4 sm:p-5 lg:p-6 mt-4 sm:mt-5">
              <h3 className="text-[16px] sm:text-[17px] lg:text-[18px] font-bold mb-3 sm:mb-4">
                Security Tips
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1 sm:mt-1.5 shrink-0"></div>
                  <p className="text-[12px] sm:text-sm text-gray-600">
                    Use a unique password that you don't use for other websites
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1 sm:mt-1.5 shrink-0"></div>
                  <p className="text-[12px] sm:text-sm text-gray-600">
                    Change your password regularly (every 3-6 months)
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1 sm:mt-1.5 shrink-0"></div>
                  <p className="text-[12px] sm:text-sm text-gray-600">
                    Never share your password with anyone
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1 sm:mt-1.5 shrink-0"></div>
                  <p className="text-[12px] sm:text-sm text-gray-600">
                    Use a password manager to securely store your passwords
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
