import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const wishlistService = {
  // Get all wishlist items for authenticated user
  getWishlist: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_WISHLIST);
    return response;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADD_TO_WISHLIST, {
      productId,
    });
    return response;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.REMOVE_FROM_WISHLIST(productId)
    );
    return response;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CLEAR_WISHLIST);
    return response;
  },

  // Check if a product is in wishlist
  checkWishlist: async (productId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.CHECK_WISHLIST(productId)
    );
    return response;
  },

  // Get wishlist count
  getWishlistCount: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.COUNT_WISHLIST);
    return response;
  },

  // Get wishlist stats
  getWishlistStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WISHLIST_STATS);
    return response;
  },

  // Sync wishlist (for syncing wishlist products with latest product data)
  syncWishlist: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.SYNC_WISHLIST);
    return response;
  },
};

export default wishlistService;
