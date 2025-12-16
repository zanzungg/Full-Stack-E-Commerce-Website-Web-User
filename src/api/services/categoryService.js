// categoryService.js - Complete version
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const categoryService = {
  // Get all categories
  getCategories: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_CATEGORIES, {
      params,
    });
    return response;
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_CATEGORY_TREE);
    return response;
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_CATEGORY_BY_ID(categoryId)
    );
    return response;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_CATEGORY_BY_SLUG(slug)
    );
    return response;
  },
};
