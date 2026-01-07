import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { categoryService } from '../api/services/categoryService';

/**
 * Custom hook for managing category data
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch categories automatically on mount
 * @param {boolean} options.fetchTree - Whether to fetch hierarchical tree structure
 * @param {boolean} options.enableCache - Enable caching of category data
 * @param {number} options.cacheTime - Cache duration in milliseconds
 * @returns {Object} Hook state and methods
 */
export const useCategory = (options = {}) => {
  const {
    autoFetch = true,
    fetchTree = true,
    enableCache = true,
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Refs
  const fetchAttempted = useRef(false);
  const cacheRef = useRef(null);
  const abortControllerRef = useRef(null);

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current || !lastFetchTime) return false;
    const now = Date.now();
    return now - lastFetchTime < cacheTime;
  }, [enableCache, cacheTime, lastFetchTime]);

  /**
   * Fetch categories from API
   */
  const fetchCategories = useCallback(
    async (params = {}, forceRefresh = false) => {
      // Return cached data if valid
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setCategories(cacheRef.current);
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

        // Fetch tree or flat categories
        const response = fetchTree
          ? await categoryService.getCategoryTree()
          : await categoryService.getCategories(params);

        const categoriesData = response.data?.data || response.data || [];
        const processedCategories = Array.isArray(categoriesData)
          ? categoriesData
          : [];

        setCategories(processedCategories);

        // Update cache
        if (enableCache) {
          cacheRef.current = processedCategories;
          setLastFetchTime(Date.now());
        }

        return processedCategories;
      } catch (err) {
        if (err.name === 'AbortError') {
          return [];
        }

        const errorMessage = err.message || 'Failed to load categories';
        setError(errorMessage);
        console.error('Category fetch error:', err);
        return [];
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [fetchTree, enableCache, isCacheValid]
  );

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    if (!autoFetch || fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchCategories();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchCategories]);

  /**
   * Refresh categories (force refresh)
   */
  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchCategories({}, true);
  }, [fetchCategories]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  /**
   * Get category by ID
   */
  const getCategoryById = useCallback(
    (id) => {
      const findCategory = (cats) => {
        for (const cat of cats) {
          if (cat._id === id || cat.id === id) return cat;
          if (cat.subcategories?.length > 0) {
            const found = findCategory(cat.subcategories);
            if (found) return found;
          }
          if (cat.children?.length > 0) {
            const found = findCategory(cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findCategory(categories);
    },
    [categories]
  );

  /**
   * Get category by slug
   */
  const getCategoryBySlug = useCallback(
    (slug) => {
      const findCategory = (cats) => {
        for (const cat of cats) {
          if (cat.slug === slug) return cat;
          if (cat.subcategories?.length > 0) {
            const found = findCategory(cat.subcategories);
            if (found) return found;
          }
          if (cat.children?.length > 0) {
            const found = findCategory(cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      return findCategory(categories);
    },
    [categories]
  );

  /**
   * Get top-level categories only
   */
  const getTopLevelCategories = useCallback(() => {
    return categories;
  }, [categories]);

  /**
   * Get all subcategories for a category
   */
  const getSubcategories = useCallback(
    (categoryId) => {
      const category = getCategoryById(categoryId);
      return category?.subcategories || category?.children || [];
    },
    [getCategoryById]
  );

  /**
   * Flatten category tree (get all categories in flat array)
   */
  const getFlatCategories = useCallback(() => {
    const flatten = (cats) => {
      let result = [];
      cats.forEach((cat) => {
        result.push(cat);
        if (cat.subcategories?.length > 0) {
          result = result.concat(flatten(cat.subcategories));
        }
        if (cat.children?.length > 0) {
          result = result.concat(flatten(cat.children));
        }
      });
      return result;
    };
    return flatten(categories);
  }, [categories]);

  /**
   * Search categories by name
   */
  const searchCategories = useCallback(
    (query) => {
      if (!query) return categories;
      const lowercaseQuery = query.toLowerCase();
      const flatCategories = getFlatCategories();
      return flatCategories.filter((cat) =>
        cat.name?.toLowerCase().includes(lowercaseQuery)
      );
    },
    [categories, getFlatCategories]
  );

  /**
   * Get category path (breadcrumb)
   */
  const getCategoryPath = useCallback(
    (categoryId) => {
      const findPath = (cats, targetId, path = []) => {
        for (const cat of cats) {
          const newPath = [...path, cat];
          if (cat._id === targetId || cat.id === targetId) {
            return newPath;
          }
          if (cat.subcategories?.length > 0) {
            const found = findPath(cat.subcategories, targetId, newPath);
            if (found) return found;
          }
          if (cat.children?.length > 0) {
            const found = findPath(cat.children, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };
      return findPath(categories, categoryId) || [];
    },
    [categories]
  );

  /**
   * Check if category has subcategories
   */
  const hasSubcategories = useCallback(
    (categoryId) => {
      const category = getCategoryById(categoryId);
      return (
        category?.subcategories?.length > 0 || category?.children?.length > 0
      );
    },
    [getCategoryById]
  );

  // Computed values
  const hasData = categories.length > 0;
  const isEmpty = !loading && categories.length === 0;
  const isCached = isCacheValid();
  const totalCount = useMemo(
    () => getFlatCategories().length,
    [getFlatCategories]
  );

  return {
    // State
    categories,
    loading,
    error,
    lastFetchTime,
    isCached,

    // Methods
    fetchCategories,
    refresh,
    clearCache,
    getCategoryById,
    getCategoryBySlug,
    getTopLevelCategories,
    getSubcategories,
    getFlatCategories,
    searchCategories,
    getCategoryPath,
    hasSubcategories,

    // Computed
    hasData,
    isEmpty,
    totalCount,
  };
};

/**
 * Custom hook for fetching a single category by ID
 */
export const useCategoryById = (categoryId, options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 10 * 60 * 1000,
  } = options;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current[categoryId]) return false;
    const cachedData = cacheRef.current[categoryId];
    return Date.now() - cachedData.timestamp < cacheTime;
  }, [categoryId, enableCache, cacheTime]);

  const fetchCategory = useCallback(
    async (forceRefresh = false) => {
      if (!categoryId) {
        setLoading(false);
        return null;
      }

      // Return cached data
      if (!forceRefresh && isCacheValid()) {
        const cachedData = cacheRef.current[categoryId];
        setCategory(cachedData.category);
        setLoading(false);
        return cachedData.category;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await categoryService.getCategoryById(categoryId);
        const categoryData = response.data?.data || response.data;

        setCategory(categoryData);

        // Update cache
        if (enableCache && categoryData) {
          cacheRef.current[categoryId] = {
            category: categoryData,
            timestamp: Date.now(),
          };
        }

        return categoryData;
      } catch (err) {
        if (err.name === 'AbortError') return null;

        const errorMessage = err.message || 'Failed to load category';
        setError(errorMessage);
        console.error('Category fetch error:', err);
        return null;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [categoryId, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch || !categoryId) return;
    fetchCategory();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, categoryId, fetchCategory]);

  const refresh = useCallback(() => fetchCategory(true), [fetchCategory]);

  const clearCache = useCallback(() => {
    if (cacheRef.current[categoryId]) {
      delete cacheRef.current[categoryId];
    }
  }, [categoryId]);

  return {
    category,
    loading,
    error,
    isCached: isCacheValid(),
    fetchCategory,
    refresh,
    clearCache,
  };
};

/**
 * Custom hook for fetching a single category by slug
 */
export const useCategoryBySlug = (slug, options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 10 * 60 * 1000,
  } = options;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current[slug]) return false;
    const cachedData = cacheRef.current[slug];
    return Date.now() - cachedData.timestamp < cacheTime;
  }, [slug, enableCache, cacheTime]);

  const fetchCategory = useCallback(
    async (forceRefresh = false) => {
      if (!slug) {
        setLoading(false);
        return null;
      }

      // Return cached data
      if (!forceRefresh && isCacheValid()) {
        const cachedData = cacheRef.current[slug];
        setCategory(cachedData.category);
        setLoading(false);
        return cachedData.category;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await categoryService.getCategoryBySlug(slug);
        const categoryData = response.data?.data || response.data;

        setCategory(categoryData);

        // Update cache
        if (enableCache && categoryData) {
          cacheRef.current[slug] = {
            category: categoryData,
            timestamp: Date.now(),
          };
        }

        return categoryData;
      } catch (err) {
        if (err.name === 'AbortError') return null;

        const errorMessage = err.message || 'Failed to load category';
        setError(errorMessage);
        console.error('Category fetch error:', err);
        return null;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [slug, enableCache, isCacheValid]
  );

  useEffect(() => {
    if (!autoFetch || !slug) return;
    fetchCategory();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, slug, fetchCategory]);

  const refresh = useCallback(() => fetchCategory(true), [fetchCategory]);

  const clearCache = useCallback(() => {
    if (cacheRef.current[slug]) {
      delete cacheRef.current[slug];
    }
  }, [slug]);

  return {
    category,
    loading,
    error,
    isCached: isCacheValid(),
    fetchCategory,
    refresh,
    clearCache,
  };
};
