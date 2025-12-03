import React, { useState, useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import TextField from "@mui/material/TextField";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MyContext } from '../../App';
import { useAuthContext } from '../../contexts/AuthContext';
import { userService } from '../../api/services/userService';
import AccountSidebar from '../../components/AccountSidebar';

const ChangePassword = () => {
    const context = useContext(MyContext);
    const { user } = useAuthContext();
    
    const [loading, setLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onChangeField = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
        // Clear error khi user nhập
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate current password
        if (!formFields.currentPassword.trim()) {
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
            newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
        }

        // Check if new password same as current
        if (formFields.newPassword === formFields.currentPassword) {
            newErrors.newPassword = 'New password must be different from current password';
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

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const passwordData = {
                currentPassword: formFields.currentPassword,
                newPassword: formFields.newPassword
            };

            const response = await userService.changePassword(passwordData);

            // Reset form
            setFormFields({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});

            context.openAlertBox("success", response.message || "Password changed successfully!");

        } catch (error) {
            console.error('Change password error:', error);

            let errorMessage = 'Failed to change password';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Current password is incorrect';
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please check your internet connection.';
            }

            context.openAlertBox("error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormFields({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <section className='py-10 w-full'>
            <div className='container flex gap-5'>
                {/* Sidebar */}
                <div className='col1 w-[25%]'>
                    <AccountSidebar />
                </div>

                {/* Main Content */}
                <div className='col2 w-[75%]'>
                    <div className='card bg-white shadow-md rounded-md p-6'>
                        <div className='mb-6'>
                            <h2 className='text-[22px] font-bold'>Change Password</h2>
                            <p className='text-sm text-gray-600 mt-2'>
                                Update your password to keep your account secure
                            </p>
                        </div>

                        <form onSubmit={handleChangePassword} className='space-y-5'>
                            <div className='max-w-[500px]'>
                                {/* Current Password */}
                                <div className='form-group mb-4 relative'>
                                    <TextField 
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        label="Current Password"
                                        variant="outlined"
                                        className="w-full"
                                        name="currentPassword"
                                        value={formFields.currentPassword}
                                        onChange={onChangeField}
                                        error={!!errors.currentPassword}
                                        helperText={errors.currentPassword}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <Button 
                                        type="button"
                                        className="absolute! top-2.5 right-2.5 z-50 w-[35px]! h-[35px]! 
                                        min-w-[35px]! rounded-full! text-black!"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        disabled={loading}
                                    >
                                        {showCurrentPassword ? 
                                        <IoMdEyeOff className="text-[20px] opacity-75"/> : 
                                        <IoMdEye className="text-[20px] opacity-75"/>}
                                    </Button>
                                </div>

                                {/* New Password */}
                                <div className='form-group mb-4 relative'>
                                    <TextField 
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        label="New Password"
                                        variant="outlined"
                                        className="w-full"
                                        name="newPassword"
                                        value={formFields.newPassword}
                                        onChange={onChangeField}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        disabled={loading}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <Button 
                                        type="button"
                                        className="absolute! top-2.5 right-2.5 z-50 w-[35px]! h-[35px]! 
                                        min-w-[35px]! rounded-full! text-black!"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={loading}
                                    >
                                        {showNewPassword ? 
                                        <IoMdEyeOff className="text-[20px] opacity-75"/> : 
                                        <IoMdEye className="text-[20px] opacity-75"/>}
                                    </Button>
                                </div>

                                {/* Confirm Password */}
                                <div className='form-group mb-4 relative'>
                                    <TextField 
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        label="Confirm New Password"
                                        variant="outlined"
                                        className="w-full"
                                        name="confirmPassword"
                                        value={formFields.confirmPassword}
                                        onChange={onChangeField}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        disabled={loading}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <Button 
                                        type="button"
                                        className="absolute! top-2.5 right-2.5 z-50 w-[35px]! h-[35px]! 
                                        min-w-[35px]! rounded-full! text-black!"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? 
                                        <IoMdEyeOff className="text-[20px] opacity-75"/> : 
                                        <IoMdEye className="text-[20px] opacity-75"/>}
                                    </Button>
                                </div>

                                {/* Password Requirements */}
                                <div className='bg-blue-50 p-4 rounded-md mb-5'>
                                    <p className='text-sm font-semibold text-blue-900 mb-2'>
                                        Password Requirements:
                                    </p>
                                    <ul className='text-xs text-blue-800 space-y-1 list-disc list-inside'>
                                        <li>At least 6 characters long</li>
                                        <li>Must contain at least one uppercase letter</li>
                                        <li>Must contain at least one lowercase letter</li>
                                        <li>Must contain at least one number</li>
                                        <li>Maximum 20 characters</li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-3'>
                                    <Button 
                                        type="submit"
                                        className='btn-org'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <CircularProgress size={16} className='mr-2' color="inherit" />
                                                Changing...
                                            </>
                                        ) : 'Change Password'}
                                    </Button>
                                    <Button 
                                        type="button"
                                        className='btn-outline'
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Security Tips */}
                    <div className='card bg-white shadow-md rounded-md p-6 mt-5'>
                        <h3 className='text-[18px] font-bold mb-4'>Security Tips</h3>
                        <div className='space-y-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 rounded-full bg-green-500 mt-1.5'></div>
                                <p className='text-sm text-gray-600'>
                                    Use a unique password that you don't use for other websites
                                </p>
                            </div>
                            <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 rounded-full bg-green-500 mt-1.5'></div>
                                <p className='text-sm text-gray-600'>
                                    Change your password regularly (every 3-6 months)
                                </p>
                            </div>
                            <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 rounded-full bg-green-500 mt-1.5'></div>
                                <p className='text-sm text-gray-600'>
                                    Never share your password with anyone
                                </p>
                            </div>
                            <div className='flex items-start gap-3'>
                                <div className='w-2 h-2 rounded-full bg-green-500 mt-1.5'></div>
                                <p className='text-sm text-gray-600'>
                                    Use a password manager to securely store your passwords
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChangePassword;