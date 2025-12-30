import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const blogService = {
  // Get all blogs with filters & pagination
  getBlogs: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_BLOGS, {
      params,
    });
    return response;
  },

  // Get blog by ID
  getBlogById: async (blogId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_BLOG_BY_ID(blogId)
    );
    return response;
  },
};

export default blogService;
