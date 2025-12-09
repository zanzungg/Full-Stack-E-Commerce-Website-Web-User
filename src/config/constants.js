export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    VERIFY_EMAIL: '/users/verify-email',
    FORGOT_PASSWORD: '/users/forgot-password',
    VERIFY_RESET_CODE: '/users/verify-reset-code',
    RESET_PASSWORD: '/users/reset-password',

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
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id) => `/products/${id}`,
    PRODUCT_CATEGORIES: '/products/categories',
    
    // Cart
    CART: '/cart',
    ADD_TO_CART: '/cart/add',
    UPDATE_CART_ITEM: (id) => `/cart/item/${id}`,
    REMOVE_CART_ITEM: (id) => `/cart/item/${id}`,
    
    // Wishlist
    WISHLIST: '/wishlist',
    ADD_TO_WISHLIST: '/wishlist/add',
    REMOVE_FROM_WISHLIST: (id) => `/wishlist/${id}`,
    
    // Orders
    ORDERS: '/orders',
    ORDER_DETAIL: (id) => `/orders/${id}`,
    CREATE_ORDER: '/orders/create',
    CANCEL_ORDER: (id) => `/orders/${id}/cancel`,
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_INFO: 'userInfo',
    CART_ITEMS: 'cartItems',
    RESET_TOKEN: 'resetToken',
};