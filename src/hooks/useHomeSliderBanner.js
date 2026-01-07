import { useState, useEffect, useCallback, useRef } from 'react';
import homeSliderBannerService from '../api/services/homeSliderBannerService';

/**
 * Custom hook for managing home slider banner data and state
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch banners automatically on mount
 * @param {Object} options.params - Additional query parameters for the API call
 * @returns {Object} Hook state and methods
 */
export const useHomeSliderBanner = (options = {}) => {
  const { autoFetch = true, params = {} } = options;

  // State management
  const [banners, setBanners] = useState([]);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Refs
  const swiperRef = useRef(null);
  const fetchAttempted = useRef(false);

  /**
   * Fetch banners from API
   */
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await homeSliderBannerService.getBanners(params);

      // Handle different response structures
      const bannersData = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      if (bannersData && Array.isArray(bannersData)) {
        // Extract all image URLs
        const allImages = bannersData
          .flatMap((banner) => banner.images.map((img) => img.url))
          .filter((url) => url && url.trim());

        setBanners(allImages);

        // Preload first image for better UX
        if (allImages.length > 0) {
          const img = new Image();
          img.src = allImages[0];
        }
      } else {
        setBanners([]);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load banners';
      setError(errorMessage);
      console.error('Banner fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Auto-fetch banners on mount if enabled
   */
  useEffect(() => {
    if (!autoFetch || fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchBanners();
  }, [autoFetch, fetchBanners]);

  /**
   * Handle image load event
   */
  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  /**
   * Toggle autoplay state
   */
  const handleAutoplayToggle = useCallback(() => {
    if (!swiperRef.current) return;

    if (isAutoplayPaused) {
      swiperRef.current.autoplay.start();
    } else {
      swiperRef.current.autoplay.stop();
    }
    setIsAutoplayPaused(!isAutoplayPaused);
  }, [isAutoplayPaused]);

  /**
   * Manually refresh banners
   */
  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchBanners();
  }, [fetchBanners]);

  /**
   * Reset loaded images state
   */
  const resetLoadedImages = useCallback(() => {
    setLoadedImages(new Set());
  }, []);

  /**
   * Set swiper instance
   */
  const setSwiperInstance = useCallback((swiper) => {
    swiperRef.current = swiper;
  }, []);

  return {
    // State
    banners,
    loadedImages,
    loading,
    error,
    isAutoplayPaused,
    swiperRef,

    // Methods
    handleImageLoad,
    handleAutoplayToggle,
    setSwiperInstance,
    refresh,
    resetLoadedImages,
    fetchBanners,
  };
};
