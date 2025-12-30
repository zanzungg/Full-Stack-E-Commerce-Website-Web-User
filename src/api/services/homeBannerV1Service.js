import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const homeBannerV1Service = {
  // Get all home banners V1
  getHomeBannersV1: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_HOME_BANNERS_V1);
    return response;
  },
};

export default homeBannerV1Service;
