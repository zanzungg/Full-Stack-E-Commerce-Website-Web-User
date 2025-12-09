import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const addressService = {
    // Create new address
    createAddress: async (addressData) => {
        const response = await axiosInstance.post(API_ENDPOINTS.CREATE_ADDRESS, addressData);
        return response;
    },

    // Update address
    updateAddress: async (addressId, addressData) => {
        const endpoint = API_ENDPOINTS.UPDATE_ADDRESS(addressId);
        const response = await axiosInstance.put(endpoint, addressData);
        return response;
    },

    // Select default address
    selectAddress: async (addressId) => {
        const endpoint = API_ENDPOINTS.SELECT_ADDRESS(addressId);
        const response = await axiosInstance.post(endpoint);
        return response;
    },

    // Deactivate address (soft delete)
    deactivateAddress: async (addressId) => {
        const endpoint = API_ENDPOINTS.DEACTIVATE_ADDRESS(addressId);
        const response = await axiosInstance.patch(endpoint);
        return response;
    },

    // Restore deactivated address
    restoreAddress: async (addressId) => {
        const endpoint = API_ENDPOINTS.RESTORE_ADDRESS(addressId);
        const response = await axiosInstance.patch(endpoint);
        return response;
    },

};