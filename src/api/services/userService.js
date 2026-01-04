import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
    return response;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_PROFILE,
      profileData
    );
    return response;
  },

  // Update avatar (multipart/form-data)
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.CHANGE_PASSWORD,
      passwordData
    );
    return response;
  },
};
