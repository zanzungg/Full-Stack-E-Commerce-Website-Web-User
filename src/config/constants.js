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
  CREATE_ADDRESS: '/addresses/create',
  SELECT_ADDRESS: (addressId) => `/addresses/select/${addressId}`,
  UPDATE_ADDRESS: (addressId) => `/addresses/update/${addressId}`,
  DEACTIVATE_ADDRESS: (addressId) => `/addresses/deactivate/${addressId}`,
  RESTORE_ADDRESS: (addressId) => `/addresses/restore/${addressId}`,

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
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  RESET_TOKEN: 'resetToken',
};
