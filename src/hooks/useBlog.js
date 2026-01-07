import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import blogService from '../api/services/blogService';

/**
 * Custom hook for managing blog data and operations
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Whether to fetch blogs automatically on mount
 * @param {Object} options.params - Query parameters for fetching blogs
 * @param {boolean} options.enableCache - Enable caching of blog data
 * @param {number} options.cacheTime - Cache duration in milliseconds
 * @returns {Object} Hook state and methods
 */
export const useBlog = (options = {}) => {
  const {
    autoFetch = true,
    params = { page: 1, limit: 10 },
    enableCache = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
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
   * Fetch blogs from API
   */
  const fetchBlogs = useCallback(
    async (fetchParams = params, forceRefresh = false) => {
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && cacheRef.current) {
        setBlogs(cacheRef.current.blogs);
        setPagination(cacheRef.current.pagination);
        setLoading(false);
        return cacheRef.current.blogs;
      }

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getBlogs(fetchParams);

        // Handle different response structures
        const blogsData = response.data?.data || response.data || [];
        const paginationData = response.data?.pagination || {};

        const processedBlogs = Array.isArray(blogsData) ? blogsData : [];

        setBlogs(processedBlogs);

        // Update pagination info
        const paginationInfo = {
          currentPage: paginationData.currentPage || fetchParams.page || 1,
          totalPages: paginationData.totalPages || 1,
          totalBlogs: paginationData.total || processedBlogs.length,
          hasNextPage: paginationData.hasNextPage || false,
          hasPrevPage: paginationData.hasPrevPage || false,
        };
        setPagination(paginationInfo);

        // Update cache
        if (enableCache) {
          cacheRef.current = {
            blogs: processedBlogs,
            pagination: paginationInfo,
          };
          setLastFetchTime(Date.now());
        }

        return processedBlogs;
      } catch (err) {
        if (err.name === 'AbortError') {
          return [];
        }

        const errorMessage = err.message || 'Failed to load blogs';
        setError(errorMessage);
        console.error('Blog fetch error:', err);
        return [];
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [params, enableCache, isCacheValid]
  );

  /**
   * Auto-fetch blogs on mount if enabled
   */
  useEffect(() => {
    if (!autoFetch || fetchAttempted.current) return;
    fetchAttempted.current = true;
    fetchBlogs();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchBlogs]);

  /**
   * Refresh blogs (force refresh, bypass cache)
   */
  const refresh = useCallback(() => {
    fetchAttempted.current = false;
    return fetchBlogs(params, true);
  }, [fetchBlogs, params]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current = null;
    setLastFetchTime(null);
  }, []);

  /**
   * Load more blogs (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasNextPage || loading) return;

    const nextPage = pagination.currentPage + 1;
    const newBlogs = await fetchBlogs({ ...params, page: nextPage }, true);

    // Append new blogs to existing ones
    setBlogs((prev) => [...prev, ...newBlogs]);
  }, [pagination, loading, params, fetchBlogs]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > pagination.totalPages) return;
      return fetchBlogs({ ...params, page }, true);
    },
    [params, pagination.totalPages, fetchBlogs]
  );

  /**
   * Get blog by category
   */
  const getBlogsByCategory = useCallback(
    (categoryId) => {
      return blogs.filter(
        (blog) =>
          blog.category?._id === categoryId || blog.categoryId === categoryId
      );
    },
    [blogs]
  );

  /**
   * Get featured blogs
   */
  const getFeaturedBlogs = useCallback(() => {
    return blogs.filter((blog) => blog.isFeatured === true);
  }, [blogs]);

  /**
   * Get published blogs only
   */
  const getPublishedBlogs = useCallback(() => {
    return blogs.filter(
      (blog) => blog.status === 'published' || blog.isPublished === true
    );
  }, [blogs]);

  /**
   * Search blogs by title or description
   */
  const searchBlogs = useCallback(
    (query) => {
      if (!query) return blogs;
      const lowercaseQuery = query.toLowerCase();
      return blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(lowercaseQuery) ||
          blog.description?.toLowerCase().includes(lowercaseQuery)
      );
    },
    [blogs]
  );

  // Computed values
  const hasData = blogs.length > 0;
  const isEmpty = !loading && blogs.length === 0;
  const isCached = isCacheValid();

  return {
    // State
    blogs,
    loading,
    error,
    pagination,
    lastFetchTime,
    isCached,

    // Methods
    fetchBlogs,
    refresh,
    clearCache,
    loadMore,
    goToPage,
    getBlogsByCategory,
    getFeaturedBlogs,
    getPublishedBlogs,
    searchBlogs,

    // Computed
    hasData,
    isEmpty,
  };
};

/**
 * Custom hook for fetching a single blog by ID
 * @param {string} blogId - Blog ID to fetch
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useBlogById = (blogId, options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTime = 5 * 60 * 1000,
  } = options;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  /**
   * Check if cached data is valid for this blog ID
   */
  const isCacheValid = useCallback(() => {
    if (!enableCache || !cacheRef.current[blogId]) return false;
    const cachedData = cacheRef.current[blogId];
    return Date.now() - cachedData.timestamp < cacheTime;
  }, [blogId, enableCache, cacheTime]);

  /**
   * Fetch blog by ID
   */
  const fetchBlog = useCallback(
    async (forceRefresh = false) => {
      if (!blogId) {
        setLoading(false);
        return null;
      }

      // Return cached data if valid
      if (!forceRefresh && isCacheValid()) {
        const cachedData = cacheRef.current[blogId];
        setBlog(cachedData.blog);
        setLoading(false);
        return cachedData.blog;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getBlogById(blogId);
        const blogData = response.data?.data || response.data;

        setBlog(blogData);

        // Update cache
        if (enableCache && blogData) {
          cacheRef.current[blogId] = {
            blog: blogData,
            timestamp: Date.now(),
          };
          setLastFetchTime(Date.now());
        }

        return blogData;
      } catch (err) {
        if (err.name === 'AbortError') {
          return null;
        }

        const errorMessage = err.message || 'Failed to load blog';
        setError(errorMessage);
        console.error('Blog fetch error:', err);
        return null;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [blogId, enableCache, isCacheValid]
  );

  /**
   * Auto-fetch on mount or when blogId changes
   */
  useEffect(() => {
    if (!autoFetch || !blogId) return;
    fetchBlog();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, blogId, fetchBlog]);

  /**
   * Refresh blog
   */
  const refresh = useCallback(() => {
    return fetchBlog(true);
  }, [fetchBlog]);

  /**
   * Clear cache for this blog
   */
  const clearCache = useCallback(() => {
    if (cacheRef.current[blogId]) {
      delete cacheRef.current[blogId];
      setLastFetchTime(null);
    }
  }, [blogId]);

  return {
    blog,
    loading,
    error,
    lastFetchTime,
    isCached: isCacheValid(),
    fetchBlog,
    refresh,
    clearCache,
  };
};
