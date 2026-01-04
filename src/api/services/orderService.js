import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order details
   * @param {Array} orderData.products - Array of {productId, quantity}
   * @param {string} orderData.shippingAddressId - Address ID
   * @param {string} orderData.paymentMethod - Payment method (COD, VNPAY, MOMO, STRIPE)
   * @returns {Promise} Order creation response
   */
  createOrder: async (orderData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CREATE_ORDER,
      orderData
    );
    return response;
  },

  /**
   * Get all orders for authenticated user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.status - Filter by order status (optional)
   * @returns {Promise} Orders list with pagination
   */
  getUserOrders: async (params = {}) => {
    const { page = 1, limit = 10, status } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
    }

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.GET_ORDERS}?${queryParams.toString()}`
    );
    return response;
  },

  /**
   * Get order details by ID
   * @param {string} orderId - Order ID
   * @returns {Promise} Order details
   */
  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_ORDER_BY_ID(orderId)
    );
    return response;
  },

  /**
   * Cancel an order
   * @param {string} orderId - Order ID to cancel
   * @returns {Promise} Cancellation response
   */
  cancelOrder: async (orderId) => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.CANCEL_ORDER(orderId)
    );
    return response;
  },

  /**
   * Get orders filtered by status
   * @param {string} status - Order status (pending, confirmed, processing, shipped, delivered, cancelled)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Filtered orders
   */
  getOrdersByStatus: async (status, page = 1, limit = 10) => {
    return orderService.getUserOrders({ page, limit, status });
  },

  /**
   * Get order statistics for user
   * @returns {Promise} Order statistics
   */
  getOrderStats: async () => {
    // This assumes you might want to calculate stats on frontend
    // or create a dedicated backend endpoint
    const response = await orderService.getUserOrders({ limit: 1000 });

    if (response.data.success && response.data.data) {
      const orders = response.data.data;

      const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.orderStatus === 'pending').length,
        confirmed: orders.filter((o) => o.orderStatus === 'confirmed').length,
        processing: orders.filter((o) => o.orderStatus === 'processing').length,
        shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
        delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
        cancelled: orders.filter((o) => o.orderStatus === 'cancelled').length,
        totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      };

      return { data: { success: true, data: stats } };
    }

    return response;
  },
};

export default orderService;
