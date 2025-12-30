import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const productService = {
  // Get all products with filters & pagination
  getProducts: async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_PRODUCTS, {
      params,
    });
    return response;
  },

  // Get products by category ID
  getProductsByCategoryId: async (categoryId, params) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_PRODUCT_BY_CAT_ID(categoryId),
      { params }
    );
    return response;
  },

  // Get products by sub-category ID
  getProductsBySubCategoryId: async (subCategoryId, params) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_PRODUCT_BY_SUBCAT_ID(subCategoryId),
      { params }
    );
    return response;
  },

  // Get products by third sub-category ID
  getProductsByThirdSubCategoryId: async (thirdSubCategoryId, params) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_PRODUCT_BY_THIRDSUBCAT_ID(thirdSubCategoryId),
      { params }
    );
    return response;
  },

  // Get latest products
  getLatestProducts: async (params) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_LASTEST_PRODUCTS,
      { params }
    );
    return response;
  },

  // Get featured products
  getFeaturedProducts: async (params) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_FEATURED_PRODUCTS,
      { params }
    );
    return response;
  },

  // Get product details by ID
  getProductDetails: async (productId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_PRODUCT_DETAILS(productId)
    );
    return response;
  },

  // Get active banners
  getActiveBanners: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ACTIVE_BANNERS);
    return response;
  },
};

export default productService;
