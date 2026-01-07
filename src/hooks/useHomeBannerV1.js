import { useState, useEffect, useCallback, useRef } from 'react';
import homeBannerV1Service from '../api/services/homeBannerV1Service';

/**
 * Custom hook for managing home banner V1 data and state
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch banners automatically on mount
 * @param {boolean} options.enableCache - Enable caching of banner data
 * @param {number} options.cacheTime - Cache duration in milliseconds (default: 5 minutes)
 * @returns {Object} Hook state and methods
 */
export const useHomeBannerV1 = (options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  // State management
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Refs
  const fetchAttempted = useRef(false);
  const cacheRef = useRef(null);

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current || !lastFetchTime) return false;
    const now = Date.now();
    return now - lastFetchTime < cacheTime;
  }, [enableCache, cacheTime, lastFetchTime]);

  /**
   * Fetch banners from API
   */
  const fetchBanners = useCallback(
    async (forceRefresh = false) => {
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setBanners(cacheRef.current);
        setLoading(false);
        return cacheRef.current;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await homeBannerV1Service.getHomeBannersV1();

        const bannersData = response.data?.data?.banners || [];

        // Validate and process banner data
        const processedBanners = Array.isArray(bannersData)
          ? bannersData.filter((banner) => {
              // Basic validation
              return banner && (banner.id || banner._id);
            })
          : [];

        setBanners(processedBanners);

        // Update cache
        if (enableCache) {
          cacheRef.current = processedBanners;
          setLastFetchTime(Date.now());
        }

        return processedBanners;
      } catch (err) {
        const errorMessage = err.message || 'Failed to load home banners';
        setError(errorMessage);
        console.error('Home Banner V1 fetch error:', err);

        // Return empty array on error
        return [];
      } finally {
        setLoading(false);
      }
    },
    [enableCache, isCacheValid]
  );

  /**
   * Auto-fetch banners on mount if enabled
   */
  useEffect(() => {
    if (!autoFetch || fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchBanners();
  }, [autoFetch, fetchBanners]);

  /**
   * Refresh banners (force refresh, bypass cache)
   */
  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchBanners(true);
  }, [fetchBanners]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  /**
   * Get banner by ID
   */
  const getBannerById = useCallback(
    (id) => {
      return banners.find((banner) => banner.id === id || banner._id === id);
    },
    [banners]
  );

  /**
   * Get banners by type/category
   */
  const getBannersByType = useCallback(
    (type) => {
      return banners.filter(
        (banner) => banner.type === type || banner.category === type
      );
    },
    [banners]
  );

  /**
   * Get active/published banners only
   */
  const getActiveBanners = useCallback(() => {
    return banners.filter(
      (banner) =>
        banner.isActive !== false &&
        banner.status !== 'inactive' &&
        banner.published !== false
    );
  }, [banners]);

  return {
    // State
    banners,
    loading,
    error,
    lastFetchTime,
    isCached: isCacheValid(),

    // Methods
    fetchBanners,
    refresh,
    clearCache,
    getBannerById,
    getBannersByType,
    getActiveBanners,

    // Computed
    hasData: banners.length > 0,
    isEmpty: !loading && banners.length === 0,
  };
};
