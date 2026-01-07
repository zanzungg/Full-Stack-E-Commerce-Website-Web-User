import { useContext } from 'react';
import { MyContext } from '../App';
import { useAuthContext } from '../contexts/AuthContext';
import { mapHttpError } from '../utils/mapHttpError';

export const useUser = () => {
  const { openAlertBox } = useContext(MyContext);
  const authContext = useAuthContext();

  const refreshUserProfile = async () => {
    try {
      return await authContext.refreshUserProfile();
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to refresh profile'));
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authContext.updateProfile(profileData);
      openAlertBox('success', 'Profile updated successfully!');
      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to update profile'));
      throw err;
    }
  };

  const updateAvatar = async (file) => {
    try {
      const response = await authContext.updateAvatar(file);
      openAlertBox('success', 'Avatar updated successfully!');
      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to update avatar'));
      throw err;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authContext.changePassword(passwordData);
      openAlertBox('success', 'Password changed successfully!');
      return response;
    } catch (err) {
      openAlertBox('error', mapHttpError(err, 'Failed to change password'));
      throw err;
    }
  };

  return {
    user: authContext.user,
    refreshUserProfile,
    updateProfile,
    updateAvatar,
    changePassword,
  };
};
