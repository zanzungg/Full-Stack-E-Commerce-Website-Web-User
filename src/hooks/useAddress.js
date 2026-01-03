import { useState, useEffect, useCallback } from 'react';
import { addressService } from '../api/services/addressService';

/**
 * Custom hook for managing addresses
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {boolean} options.autoFetch - Auto fetch on mount (default: true)
 */
export const useAddress = (options = {}) => {
  const { onSuccess = null, onError = null, autoFetch = true } = options;

  // State management
  const [addresses, setAddresses] = useState([]);
  const [activeAddresses, setActiveAddresses] = useState([]);
  const [deletedAddresses, setDeletedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    deleted: 0,
    byType: {
      Home: 0,
      Office: 0,
      Other: 0,
    },
  });

  /**
   * Calculate statistics from addresses
   */
  const calculateStatistics = useCallback((allAddresses) => {
    const active = allAddresses.filter((addr) => addr.status === true);
    const deleted = allAddresses.filter((addr) => addr.status === false);
    const selected = allAddresses.find((addr) => addr.selected === true);

    const byType = {
      Home: allAddresses.filter((addr) => addr.addressType === 'Home').length,
      Office: allAddresses.filter((addr) => addr.addressType === 'Office')
        .length,
      Other: allAddresses.filter((addr) => addr.addressType === 'Other').length,
    };

    setStatistics({
      total: allAddresses.length,
      active: active.length,
      deleted: deleted.length,
      byType,
    });

    setActiveAddresses(active);
    setDeletedAddresses(deleted);
    setSelectedAddress(selected || null);
  }, []);

  /**
   * Fetch all addresses
   */
  const fetchAddresses = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.getAddresses(params);
        const fetchedAddresses = response.data || [];

        setAddresses(fetchedAddresses);
        calculateStatistics(fetchedAddresses);

        // if (onSuccess) {
        //   onSuccess('Addresses loaded successfully', fetchedAddresses);
        // }

        return fetchedAddresses;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to load addresses';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, calculateStatistics]
  );

  /**
   * Get address by ID
   */
  const getAddressById = useCallback(
    async (addressId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.getAddressById(addressId);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to get address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  /**
   * Get selected address
   */
  const getSelectedAddress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await addressService.getSelectedAddress();
      const selected = response.data;
      setSelectedAddress(selected);
      return selected;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to get selected address';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage, err);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  /**
   * Create new address
   */
  const createAddress = useCallback(
    async (addressData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.createAddress(addressData);
        const newAddress = response.data;

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(
            response.message || 'Address created successfully',
            newAddress
          );
        }

        return newAddress;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to create address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Update address
   */
  const updateAddress = useCallback(
    async (addressId, addressData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.updateAddress(
          addressId,
          addressData
        );
        const updatedAddress = response.data;

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(
            response.message || 'Address updated successfully',
            updatedAddress
          );
        }

        return updatedAddress;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to update address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Select address as default
   */
  const selectAddress = useCallback(
    async (addressId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.selectAddress(addressId);
        const selected = response.data;

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(response.message || 'Default address updated', selected);
        }

        return selected;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to select address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Deactivate address (soft delete)
   */
  const deactivateAddress = useCallback(
    async (addressId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.deactivateAddress(addressId);

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(
            response.message || 'Address deleted successfully',
            response.data
          );
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to delete address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Restore address
   */
  const restoreAddress = useCallback(
    async (addressId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.restoreAddress(addressId);

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(
            response.message || 'Address restored successfully',
            response.data
          );
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to restore address';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Hard delete address (permanent)
   */
  const deleteAddressPermanent = useCallback(
    async (addressId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await addressService.deleteAddress(addressId);

        // Update local state
        await fetchAddresses();

        if (onSuccess) {
          onSuccess(
            response.message || 'Address permanently deleted',
            response.data
          );
        }

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to delete address permanently';
        setError(errorMessage);

        if (onError) {
          onError(errorMessage, err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAddresses, onSuccess, onError]
  );

  /**
   * Filter addresses by type
   */
  const filterByType = useCallback(
    (type) => {
      if (type === 'All') return addresses;
      return addresses.filter((addr) => addr.addressType === type);
    },
    [addresses]
  );

  /**
   * Filter addresses by status
   */
  const filterByStatus = useCallback(
    (status) => {
      return addresses.filter((addr) => addr.status === status);
    },
    [addresses]
  );

  /**
   * Auto fetch on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchAddresses();
    }
  }, [autoFetch]); // Only run once on mount

  return {
    // State
    addresses,
    activeAddresses,
    deletedAddresses,
    selectedAddress,
    loading,
    error,
    statistics,

    // Methods
    fetchAddresses,
    getAddressById,
    getSelectedAddress,
    createAddress,
    updateAddress,
    selectAddress,
    deactivateAddress,
    restoreAddress,
    deleteAddressPermanent,
    filterByType,
    filterByStatus,

    // Utilities
    refresh: fetchAddresses,
    clearError: () => setError(null),
  };
};
