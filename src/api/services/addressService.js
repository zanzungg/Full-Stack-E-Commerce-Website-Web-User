import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const addressService = {
  /**
   * Get all addresses
   * @param {Object} params - { status, addressType }
   */
  getAddresses: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_ADDRESSES, {
      params,
    });
    return response;
  },

  /**
   * Get selected (default) address
   */
  getSelectedAddress: async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_SELECTED_ADDRESS
    );
    return response;
  },

  /**
   * Get address by ID
   */
  getAddressById: async (addressId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_ADDRESS_BY_ID(addressId)
    );
    return response;
  },

  /**
   * Create new address
   */
  createAddress: async (addressData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CREATE_ADDRESS,
      addressData
    );
    return response;
  },

  /**
   * Update address (partial update)
   */
  updateAddress: async (addressId, addressData) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.UPDATE_ADDRESS(addressId),
      addressData
    );
    return response;
  },

  /**
   * Select address as default
   */
  selectAddress: async (addressId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.SELECT_ADDRESS(addressId)
    );
    return response;
  },

  /**
   * Deactivate address (soft delete)
   */
  deactivateAddress: async (addressId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.DEACTIVATE_ADDRESS(addressId)
    );
    return response;
  },

  /**
   * Restore deactivated address
   */
  restoreAddress: async (addressId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.RESTORE_ADDRESS(addressId)
    );
    return response;
  },

  /**
   * Hard delete address (permanent)
   */
  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.HARD_DELETE_ADDRESS(addressId)
    );
    return response;
  },
};
