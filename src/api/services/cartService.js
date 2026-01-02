import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const cartService = {
  // Get all cart items for authenticated user
  getCart: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_CART);
    return response;
  },

  // Add product to cart
  addToCart: async (productId, quantity = 1, selectedVariant = null) => {
    const payload = {
      productId,
      quantity,
    };

    // Only include selectedVariant if it has valid data
    // If selectedVariant is explicitly null, don't include it in payload
    if (selectedVariant && selectedVariant.type && selectedVariant.value) {
      payload.selectedVariant = selectedVariant;
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.ADD_TO_CART,
      payload
    );
    return response;
  },

  // Update cart item quantity (set exact value)
  updateCartItem: async (itemId, quantity) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_CART_ITEM(itemId),
      { quantity }
    );
    return response;
  },

  // Update cart item variant value only
  updateVariantValue: async (itemId, variantValue) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_CART_ITEM(itemId),
      { selectedVariant: variantValue }
    );
    return response;
  },

  // Increment cart item quantity by 1
  incrementCartItem: async (itemId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.INCREMENT_CART_ITEM(itemId)
    );
    return response;
  },

  // Decrement cart item quantity by 1
  decrementCartItem: async (itemId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.DECREMENT_CART_ITEM(itemId)
    );
    return response;
  },

  // Remove single item from cart
  removeCartItem: async (itemId) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.REMOVE_CART_ITEM(itemId)
    );
    return response;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CLEAR_CART);
    return response;
  },

  // Delete multiple cart items at once
  deleteCartBatch: async (cartItemIds) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.DELETE_CART_BATCH,
      {
        data: { cartItemIds },
      }
    );
    return response;
  },
};

export default cartService;
