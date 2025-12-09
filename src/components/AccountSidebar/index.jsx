import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { MdOutlineCloudUpload } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate, useLocation } from 'react-router-dom';
import { MyContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';
import { userService } from '../../api/services/userService';

const AccountSidebar = ({ onAvatarUpdate }) => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const { user, updateUser, refreshUserProfile } = useAuthContext();
    const { logout, loading } = useAuth();
    
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/my-account')) return 'profile';
        if (path.includes('/my-address')) return 'address';
        if (path.includes('/my-wishlist')) return 'wishlist';
        if (path.includes('/my-orders')) return 'orders';
        if (path.includes('/change-password')) return 'password';
        return 'profile';
    };

    const activeTab = getActiveTab();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            context.openAlertBox("error", "Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            context.openAlertBox("error", "Image size must be less than 5MB");
            return;
        }

        try {
            setUploadingAvatar(true);
            
            const response = await userService.updateAvatar(file);
            
            const updatedUser = {
                ...user,
                avatar: response.data.avatar
            };
            updateUser(updatedUser);
            
            if (onAvatarUpdate) {
                onAvatarUpdate(response.data.avatar);
            }
            
            context.openAlertBox("success", response.message || "Avatar updated successfully!");
            
        } catch (error) {
            console.error('Upload avatar error:', error);
            
            let errorMessage = 'Failed to upload avatar';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please check your internet connection.';
            }
            
            context.openAlertBox("error", errorMessage);
        } finally {
            setUploadingAvatar(false);
            e.target.value = '';
        }
    };

    const handleOpenLogoutDialog = () => {
        setOpenLogoutDialog(true);
    };

    const handleCloseLogoutDialog = () => {
        setOpenLogoutDialog(false);
    };

    const handleLogout = async () => {
        handleCloseLogoutDialog();
        await logout();
    };

    return (
        <>
            <div className='card bg-white shadow-md rounded-md overflow-hidden'>
                <div className='w-full p-5 flex items-center justify-center flex-col'>
                    <div className='w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group'>
                        <img 
                            src={user?.avatar || '/avatar_default.png'}
                            alt="User Avatar"
                            className='w-full h-full object-cover' 
                        />

                        <div className='overlay w-full h-full absolute top-0 left-0
                        z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 
                        transition-all group-hover:opacity-100'>
                            {uploadingAvatar ? (
                                <CircularProgress size={25} className='text-white'/>
                            ) : (
                                <>
                                    <MdOutlineCloudUpload className='text-white text-[25px]'/>
                                    <input 
                                        type='file' 
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        disabled={uploadingAvatar}
                                        className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <h3 className='font-bold'>{user?.name || 'User Name'}</h3>
                    <h6 className='text-[13px] font-medium text-gray-600'>{user?.email || 'User Email'}</h6>
                    {user?.mobile && (
                        <p className='text-[12px] text-gray-500 mt-1'>{user.mobile}</p>
                    )}
                </div>

                <ul className='list-none pb-5 bg-[#f1f1f1]'>
                    <li className='w-full'>
                        <Button 
                            className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                activeTab === 'profile' 
                                ? 'bg-primary! text-white!' 
                                : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                            }`}
                            onClick={() => navigate('/my-account')}
                        >
                            <FaRegUser className='text-[17px]'/>
                            <span className='font-semibold'>My Profile</span>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <Button 
                            className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                activeTab === 'address' 
                                ? 'bg-primary! text-white!' 
                                : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                            }`}
                            onClick={() => navigate('/my-address')}
                        >
                            <LuMapPin className='text-[20px]'/>
                            <span className='font-semibold'>My Address</span>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <Button 
                            className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                activeTab === 'wishlist' 
                                ? 'bg-primary! text-white!' 
                                : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                            }`}
                            onClick={() => navigate('/my-wishlist')}
                        >
                            <FaRegHeart className='text-[19px]'/>
                            <span className='font-semibold'>My Wishlist</span>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <Button 
                            className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                activeTab === 'orders' 
                                ? 'bg-primary! text-white!' 
                                : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                            }`}
                            onClick={() => navigate('/my-orders')}
                        >
                            <IoBagCheckOutline className='text-[20px]'/>
                            <span className='font-semibold'>My Orders</span>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <Button 
                            className={`w-full text-left! justify-start! py-2! px-5! capitalize! rounded-none! flex items-center gap-2 ${
                                activeTab === 'password' 
                                ? 'bg-primary! text-white!' 
                                : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]!'
                            }`}
                            onClick={() => navigate('/change-password')}
                        >
                            <RiLockPasswordLine className='text-[20px]'/>
                            <span className='font-semibold'>Change Password</span>
                        </Button>
                    </li>

                    <li className='w-full'>
                        <Button 
                            className="w-full text-left! justify-start! py-2! px-5! capitalize! text-[rgba(0,0,0,0.7)]! rounded-none! flex items-center gap-2 hover:bg-[rgba(0,0,0,0.05)]!"
                            onClick={handleOpenLogoutDialog}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={17} className='text-[rgba(0,0,0,0.7)]!'/>
                                    <span className='font-semibold'>Logging out...</span>
                                </>
                            ) : (
                                <>
                                    <IoLogOutOutline className='text-[20px]'/>
                                    <span className='font-semibold'>Logout</span>
                                </>
                            )}
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openLogoutDialog}
                onClose={handleCloseLogoutDialog}
                aria-labelledby="logout-dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        minWidth: '400px'
                    }
                }}
            >
                <DialogTitle id="logout-dialog-title" className='font-bold'>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <p className='text-[14px] text-gray-600'>
                        Are you sure you want to logout from your account?
                    </p>
                </DialogContent>
                <DialogActions className='px-6 pb-4'>
                    <Button 
                        onClick={handleCloseLogoutDialog}
                        className='capitalize! text-gray-600!'
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogout}
                        variant="contained"
                        className='capitalize! bg-red-500! hover:bg-red-600!'
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AccountSidebar;