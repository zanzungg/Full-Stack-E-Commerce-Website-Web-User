import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const homeSliderBannerService = {
  // Get all home slider banners with filters & pagination
  getBanners: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_BANNERS, {
      params,
    });
    return response;
  },
};

export default homeSliderBannerService;
