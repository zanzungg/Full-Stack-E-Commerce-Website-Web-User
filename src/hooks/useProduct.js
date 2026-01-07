import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../api/services/productService';

/**
 * Custom hook for fetching products by category
 * @param {string} categoryId - Category ID to fetch products for
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useProductsByCategory = (categoryId, options = {}) => {
  const {
    autoFetch = true,
    params = { page: 1, limit: 12 },
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsString = JSON.stringify(params);

  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const isCacheValid = useCallback(
    (catId) => {
      if (!enableCache || !cacheRef.current[catId]) return false;
      const cachedData = cacheRef.current[catId];
      return Date.now() - cachedData.timestamp < cacheTime;
    },
    [enableCache, cacheTime]
  );

  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      if (!categoryId) {
        setProducts([]);
        setProductsLoading(false);
        return [];
      }

      setProducts([]);
      setProductsLoading(true);
      setError(null);

      // Return cached data
      if (!forceRefresh && isCacheValid(categoryId)) {
        const cachedData = cacheRef.current[categoryId];
        setProducts(cachedData.products);
        setProductsLoading(false);
        return cachedData.products;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setProductsLoading(true);
        setError(null);

        const response = await productService.getProductsByCategoryId(
          categoryId,
          params
        );

        const productsData = response.data?.data || [];
        setProducts(productsData);

        // Update cache
        if (enableCache) {
          cacheRef.current[categoryId] = {
            products: productsData,
            timestamp: Date.now(),
          };
        }

        return productsData;
      } catch (err) {
        if (err.name === 'AbortError') return [];

        setProducts([]);

        setError(err.message || 'Failed to load products');
        console.error('Products fetch error:', err);
        return [];
      } finally {
        setProductsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [categoryId, paramsString, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchProducts]);

  const refresh = useCallback(() => fetchProducts(true), [fetchProducts]);

  const clearCache = useCallback(() => {
    if (categoryId && cacheRef.current[categoryId]) {
      delete cacheRef.current[categoryId];
    }
  }, [categoryId]);

  return {
    products,
    productsLoading,
    error,
    fetchProducts,
    refresh,
    clearCache,
    hasData: products.length > 0,
    isEmpty: !productsLoading && products.length === 0,
  };
};

/**
 * Custom hook for fetching latest products
 */
export const useLatestProducts = (options = {}) => {
  const {
    autoFetch = true,
    params = { page: 1, limit: 6 },
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [latestProducts, setLatestProducts] = useState([]);
  const [latestProductsLoading, setLatestProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const cacheRef = useRef(null);
  const abortControllerRef = useRef(null);
  const fetchAttempted = useRef(false);

  const paramsString = JSON.stringify(params);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current || !lastFetchTime) return false;
    return Date.now() - lastFetchTime < cacheTime;
  }, [enableCache, cacheTime, lastFetchTime]);

  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      // Return cached data
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setLatestProducts(cacheRef.current);
        setLatestProductsLoading(false);
        return cacheRef.current;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLatestProductsLoading(true);
        setError(null);

        const response = await productService.getLatestProducts(params);
        const productsData = response.data?.data || [];

        setLatestProducts(productsData);

        // Update cache
        if (enableCache) {
          cacheRef.current = productsData;
          setLastFetchTime(Date.now());
        }

        return productsData;
      } catch (err) {
        if (err.name === 'AbortError') return [];

        const errorMessage = err.message || 'Failed to load latest products';
        setError(errorMessage);
        console.error('Latest products fetch error:', err);
        return [];
      } finally {
        setLatestProductsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [paramsString, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchProducts(true);
  }, [fetchProducts]);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  return {
    latestProducts,
    latestProductsLoading,
    error,
    fetchProducts,
    refresh,
    clearCache,
    hasData: latestProducts.length > 0,
    isEmpty: !latestProductsLoading && latestProducts.length === 0,
    isCached: isCacheValid(),
  };
};

/**
 * Custom hook for fetching featured products
 */
export const useFeaturedProducts = (options = {}) => {
  const {
    autoFetch = true,
    params = { limit: 6 },
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredProductsLoading, setFeaturedProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const cacheRef = useRef(null);
  const abortControllerRef = useRef(null);
  const fetchAttempted = useRef(false);

  const paramsString = JSON.stringify(params);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current || !lastFetchTime) return false;
    return Date.now() - lastFetchTime < cacheTime;
  }, [enableCache, cacheTime, lastFetchTime]);

  const fetchProducts = useCallback(
    async (forceRefresh = false) => {
      // Return cached data
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setFeaturedProducts(cacheRef.current);
        setFeaturedProductsLoading(false);
        return cacheRef.current;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setFeaturedProductsLoading(true);
        setError(null);

        const response = await productService.getFeaturedProducts(params);
        const productsData = response.data?.data || [];

        setFeaturedProducts(productsData);

        // Update cache
        if (enableCache) {
          cacheRef.current = productsData;
          setLastFetchTime(Date.now());
        }

        return productsData;
      } catch (err) {
        if (err.name === 'AbortError') return [];

        const errorMessage = err.message || 'Failed to load featured products';
        setError(errorMessage);
        console.error('Featured products fetch error:', err);
        return [];
      } finally {
        setFeaturedProductsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [paramsString, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchProducts(true);
  }, [fetchProducts]);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  return {
    featuredProducts,
    featuredProductsLoading,
    error,
    fetchProducts,
    refresh,
    clearCache,
    hasData: featuredProducts.length > 0,
    isEmpty: !featuredProductsLoading && featuredProducts.length === 0,
    isCached: isCacheValid(),
  };
};

/**
 * Custom hook for fetching product detail
 * @param {string} productId - Product ID
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
/**
 * Custom hook for fetching product detail
 * @param {string} productId - Product ID
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useProductDetail = (productId, options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const isCacheValid = useCallback(
    (id) => {
      if (!enableCache || !cacheRef.current[id]) return false;
      const cached = cacheRef.current[id];
      return Date.now() - cached.timestamp < cacheTime;
    },
    [enableCache, cacheTime]
  );

  const fetchProduct = useCallback(
    async (forceRefresh = false) => {
      if (!productId) {
        setProduct(null);
        setProductLoading(false);
        return null;
      }

      setProductLoading(true);
      setError(null);

      /* ---------- Cache ---------- */
      if (!forceRefresh && isCacheValid(productId)) {
        const cached = cacheRef.current[productId];
        setProduct(cached.data);
        setProductLoading(false);
        return cached.data;
      }

      /* ---------- Abort previous ---------- */
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const response = await productService.getProductDetails(productId);
        const productData = response.data?.data || [];

        setProduct(productData);

        if (enableCache) {
          cacheRef.current[productId] = {
            data: productData,
            timestamp: Date.now(),
          };
        }

        return productData;
      } catch (err) {
        if (err.name === 'AbortError') return null;

        setProduct(null);
        setError(err.message || 'Failed to load product');
        console.error('Product detail fetch error:', err);
        return null;
      } finally {
        setProductLoading(false);
        abortControllerRef.current = null;
      }
    },
    [productId, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchProduct();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchProduct]);

  const refresh = useCallback(() => fetchProduct(true), [fetchProduct]);

  const clearCache = useCallback(() => {
    if (productId && cacheRef.current[productId]) {
      delete cacheRef.current[productId];
    }
  }, [productId]);

  return {
    product,
    productLoading,
    error,
    fetchProduct,
    refresh,
    clearCache,
    hasData: !!product,
    isEmpty: !productLoading && !product,
  };
};

/**
 * Custom hook for fetching products listing
 * @param {Object} queryParams - Query parameters for fetching products
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useProductListing = (queryParams, options = {}) => {
  const { autoFetch = true } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsString = JSON.stringify(queryParams);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalProducts: 0,
  });

  const [availableFilters, setAvailableFilters] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProducts(queryParams);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Failed to fetch products');
      }

      const { data, pagination, availableFilters, appliedFilters } =
        response.data;

      setProducts(data || []);
      setPagination(pagination || { totalPages: 1, totalProducts: 0 });
      setAvailableFilters(availableFilters || null);
      setAppliedFilters(appliedFilters || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [paramsString]);

  useEffect(() => {
    if (!autoFetch) return;
    fetchProducts();
  }, [fetchProducts, autoFetch]);

  return {
    products,
    loading,
    error,
    pagination,
    availableFilters,
    appliedFilters,
    refresh: fetchProducts,
  };
};

/**
 * Custom hook for fetching active banners
 */
export const useActiveBanners = (options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const cacheRef = useRef(null);
  const abortControllerRef = useRef(null);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current || !lastFetchTime) return false;
    return Date.now() - lastFetchTime < cacheTime;
  }, [enableCache, cacheTime, lastFetchTime]);

  const fetchBanners = useCallback(
    async (forceRefresh = false) => {
      // Return cached data
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setBanners(cacheRef.current);
        setLoading(false);
        return cacheRef.current;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await productService.getActiveBanners();
        const bannersData = response.data?.data || [];

        setBanners(bannersData);

        // Update cache
        if (enableCache) {
          cacheRef.current = bannersData;
          setLastFetchTime(Date.now());
        }

        return bannersData;
      } catch (err) {
        if (err.name === 'AbortError') return [];

        const errorMessage = err.message || 'Failed to load active banners';
        setError(errorMessage);
        console.error('Active banners fetch error:', err);
        return [];
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchBanners();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBanners, autoFetch]);

  const refresh = useCallback(() => fetchBanners(true), [fetchBanners]);

  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  return {
    banners,
    loading,
    error,
    fetchBanners,
    refresh,
    clearCache,
    hasData: banners.length > 0,
    isEmpty: !loading && banners.length === 0,
    isCached: isCacheValid(),
  };
};
