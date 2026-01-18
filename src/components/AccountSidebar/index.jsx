import { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { LuMapPin } from 'react-icons/lu';
import { FaRegHeart } from 'react-icons/fa6';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoLogOutOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate, useLocation } from 'react-router-dom';
import { MyContext } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

const AccountSidebar = ({ onAvatarUpdate }) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, updateAvatar } = useUser();
  const { logout, authLoading } = useAuth();

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
      context.openAlertBox('error', 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      context.openAlertBox('error', 'Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);

      const response = await updateAvatar(file);

      if (onAvatarUpdate && response?.data?.avatar) {
        onAvatarUpdate(response.data.avatar);
      }
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
      <div className="card bg-white shadow-md rounded-md overflow-hidden lg:sticky lg:top-5">
        <div className="w-full p-4 sm:p-5 flex items-center justify-center flex-col">
          <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden mb-3 sm:mb-4 relative group shadow-lg">
            <img
              src={user?.avatar || '/avatar_default.png'}
              alt="User Avatar"
              className={`w-full h-full object-cover transition-all duration-300 ${
                uploadingAvatar
                  ? 'blur-sm scale-110 brightness-75'
                  : 'group-hover:scale-110'
              }`}
            />

            {/* Loading Overlay - Always visible when uploading */}
            {uploadingAvatar && (
              <div
                className="absolute top-0 left-0 w-full h-full z-50 
                         bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center"
              >
                <CircularProgress
                  size={35}
                  thickness={4}
                  className="text-white mb-2"
                />
                <span className="text-white text-xs font-medium">
                  Uploading...
                </span>
              </div>
            )}

            {/* Hover Overlay - Only show when NOT uploading */}
            {!uploadingAvatar && (
              <div
                className="overlay w-full h-full absolute top-0 left-0
                          z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 
                          transition-all duration-300 group-hover:opacity-100"
              >
                <MdOutlineCloudUpload className="text-white text-[25px]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          <h3 className="font-bold text-base sm:text-lg text-center">
            {user?.name}
          </h3>
          <h6 className="text-[12px] sm:text-[13px] font-medium text-gray-600 text-center break-all px-2">
            {user?.email}
          </h6>
          {user?.mobile && (
            <p className="text-[11px] sm:text-[12px] text-gray-500 mt-1">
              {user.mobile}
            </p>
          )}

          {/* Upload Status */}
          {uploadingAvatar && (
            <div className="mt-2 px-3 py-1 bg-blue-50 rounded-full">
              <p className="text-[11px] text-blue-600 font-medium">
                Please wait, uploading avatar...
              </p>
            </div>
          )}
        </div>

        <ul className="list-none pb-3 sm:pb-5 bg-[#f1f1f1]">
          <li className="w-full">
            <Button
              className={`w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! rounded-none! flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-primary! text-white! shadow-md!'
                  : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]! hover:translate-x-1!'
              }`}
              onClick={() => navigate('/my-account')}
            >
              <FaRegUser className="text-[15px] sm:text-[17px]" />
              <span className="font-semibold text-[13px] sm:text-[14px]">
                My Profile
              </span>
            </Button>
          </li>

          <li className="w-full">
            <Button
              className={`w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! rounded-none! flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                activeTab === 'address'
                  ? 'bg-primary! text-white! shadow-md!'
                  : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]! hover:translate-x-1!'
              }`}
              onClick={() => navigate('/my-address')}
            >
              <LuMapPin className="text-[17px] sm:text-[20px]" />
              <span className="font-semibold text-[13px] sm:text-[14px]">
                My Address
              </span>
            </Button>
          </li>

          <li className="w-full">
            <Button
              className={`w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! rounded-none! flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                activeTab === 'wishlist'
                  ? 'bg-primary! text-white! shadow-md!'
                  : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]! hover:translate-x-1!'
              }`}
              onClick={() => navigate('/my-wishlist')}
            >
              <FaRegHeart className="text-[16px] sm:text-[19px]" />
              <span className="font-semibold text-[13px] sm:text-[14px]">
                My Wishlist
              </span>
            </Button>
          </li>

          <li className="w-full">
            <Button
              className={`w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! rounded-none! flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-primary! text-white! shadow-md!'
                  : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]! hover:translate-x-1!'
              }`}
              onClick={() => navigate('/my-orders')}
            >
              <IoBagCheckOutline className="text-[17px] sm:text-[20px]" />
              <span className="font-semibold text-[13px] sm:text-[14px]">
                My Orders
              </span>
            </Button>
          </li>

          <li className="w-full">
            <Button
              className={`w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! rounded-none! flex items-center gap-2 sm:gap-3 transition-all duration-200 ${
                activeTab === 'password'
                  ? 'bg-primary! text-white! shadow-md!'
                  : 'text-[rgba(0,0,0,0.7)]! hover:bg-[rgba(0,0,0,0.05)]! hover:translate-x-1!'
              }`}
              onClick={() => navigate('/change-password')}
            >
              <RiLockPasswordLine className="text-[17px] sm:text-[20px]" />
              <span className="font-semibold text-[13px] sm:text-[14px]">
                Change Password
              </span>
            </Button>
          </li>

          <li className="w-full mt-2 border-t border-gray-200 pt-2">
            <Button
              className="w-full text-left! justify-start! py-2! sm:py-3! px-4! sm:px-5! capitalize! text-red-600! rounded-none! flex items-center gap-2 sm:gap-3 hover:bg-red-50! transition-all duration-200 hover:translate-x-1!"
              onClick={handleOpenLogoutDialog}
              disabled={authLoading || uploadingAvatar}
            >
              {authLoading ? (
                <>
                  <CircularProgress size={17} className="text-red-600!" />
                  <span className="font-semibold text-[13px] sm:text-[14px]">
                    Logging out...
                  </span>
                </>
              ) : (
                <>
                  <IoLogOutOutline className="text-[17px] sm:text-[20px]" />
                  <span className="font-semibold text-[13px] sm:text-[14px]">
                    Logout
                  </span>
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
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            margin: '16px',
          },
        }}
      >
        <DialogTitle id="logout-dialog-title" className="font-bold">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-gray-600">
            Are you sure you want to logout from your account?
          </p>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            onClick={handleCloseLogoutDialog}
            className="capitalize! text-gray-600!"
            disabled={authLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            className="capitalize! bg-red-500! hover:bg-red-600!"
            disabled={authLoading}
            startIcon={
              authLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {authLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountSidebar;
