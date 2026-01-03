export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  LOGOUT: '/users/logout',
  REFRESH_TOKEN: '/users/refresh-token',
  VERIFY_EMAIL: '/users/verify-email',
  RESEND_OTP: '/users/resend-verification-email',
  FORGOT_PASSWORD: '/users/forgot-password',
  VERIFY_RESET_CODE: '/users/verify-reset-code',
  RESET_PASSWORD: '/users/reset-password',
  GOOGLE_LOGIN: '/users/auth/google-login',

  // Address Management
  GET_ADDRESSES: '/addresses/',
  GET_SELECTED_ADDRESS: '/addresses/selected',
  GET_ADDRESS_BY_ID: (addressId) => `/addresses/${addressId}`,
  CREATE_ADDRESS: '/addresses/',
  SELECT_ADDRESS: (addressId) => `/addresses/${addressId}/select`,
  UPDATE_ADDRESS: (addressId) => `/addresses/${addressId}`,
  // Soft Delete
  DEACTIVATE_ADDRESS: (addressId) => `/addresses/${addressId}/deactivate`,
  RESTORE_ADDRESS: (addressId) => `/addresses/${addressId}/restore`,
  HARD_DELETE_ADDRESS: (addressId) => `/addresses/${addressId}`,

  // User Profile
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  UPDATE_AVATAR: '/users/avatar',
  CHANGE_PASSWORD: '/users/change-password',

  // Home Slider Banner
  GET_BANNERS: '/home-slider-banner',

  // Categories
  GET_CATEGORIES: '/categories/',
  GET_CATEGORY_TREE: '/categories/tree',
  GET_CATEGORY_BY_ID: (categoryId) => `/categories/${categoryId}`,
  GET_CATEGORY_BY_SLUG: (slug) => `/categories/slug/${slug}`,

  // Products
  GET_PRODUCTS: '/products/',
  GET_PRODUCT_BY_CAT_ID: (catId) => `/products/catId/${catId}`,
  GET_PRODUCT_BY_SUBCAT_ID: (subCatId) => `/products/subCatId/${subCatId}`,
  GET_PRODUCT_BY_THIRDSUBCAT_ID: (thirdSubCatId) =>
    `/products/thirdSubCatId/${thirdSubCatId}`,
  GET_LASTEST_PRODUCTS: '/products/latest',
  GET_FEATURED_PRODUCTS: '/products/featured',
  GET_PRODUCT_DETAILS: (productId) => `/products/${productId}`,
  GET_ACTIVE_BANNERS: '/products/banners/active',

  // Home Banner V1
  GET_HOME_BANNERS_V1: '/home-banner-v1/',

  // Blogs
  GET_BLOGS: '/blogs/',
  GET_BLOG_BY_ID: (blogId) => `/blogs/${blogId}`,

  // Cart
  GET_CART: '/cart/',
  ADD_TO_CART: '/cart/create',
  UPDATE_CART_ITEM: (itemId) => `/cart/update-quantity/${itemId}`,
  REMOVE_CART_ITEM: (itemId) => `/cart/${itemId}`,
  INCREMENT_CART_ITEM: (itemId) => `/cart/${itemId}/increment`,
  DECREMENT_CART_ITEM: (itemId) => `/cart/${itemId}/decrement`,
  CLEAR_CART: '/cart/clear',
  DELETE_CART_BATCH: '/cart/batch',

  // My Wishlist
  GET_WISHLIST: '/mylist',
  ADD_TO_WISHLIST: '/mylist',
  REMOVE_FROM_WISHLIST: (productId) => `/mylist/${productId}`,
  CLEAR_WISHLIST: '/mylist',
  CHECK_WISHLIST: (productId) => `/mylist/check/${productId}`,
  COUNT_WISHLIST: '/mylist/count',
  WISHLIST_STATS: '/mylist/stats',
  SYNC_WISHLIST: '/mylist/sync',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  RESET_TOKEN: 'resetToken',
};
