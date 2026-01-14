import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../api/services/orderService';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing orders
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {boolean} options.autoFetch - Auto fetch on mount (default: false)
 * @param {Object} options.queryParams - Query parameters for fetching orders
 */
export const useOrder = (options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    autoFetch = false,
    queryParams = { page: 1, limit: 10 },
  } = options;

  const queryClient = useQueryClient();

  // State management
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalAmount: 0,
  });

  // Helper to extract data from API response
  const extractData = (response) => response?.data;
  const extractOrderData = (response) => response?.data?.data;

  // Fetch orders - React Query
  const {
    data: ordersResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: async () => {
      const response = await orderService.getUserOrders(queryParams);
      return extractData(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: autoFetch,
  });

  /**
   * Create order mutation
   */
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await orderService.createOrder(orderData);
      return extractOrderData(response);
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      const message = 'Order created successfully!';
      const orderId = order?._id || 'N/A';

      toast.success(`${message}\nOrder ID: ${orderId}`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#f0fdf4',
          color: '#166534',
          padding: '16px',
          whiteSpace: 'pre-line',
        },
        icon: '✅',
      });

      if (onSuccess) {
        onSuccess(message, order);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create order';

      if (onError) {
        onError(message, error);
      }
    },
  });

  /**
   * Get order by ID mutation
   */
  const getOrderByIdMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await orderService.getOrderById(orderId);
      return extractOrderData(response);
    },
    onSuccess: (order) => {
      setSelectedOrder(order);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to fetch order details';

      // toast.error(message);

      if (onError) {
        onError(message, error);
      }
    },
  });

  /**
   * Cancel order mutation
   */
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await orderService.cancelOrder(orderId);
      return extractOrderData(response);
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      if (onSuccess) {
        onSuccess('Order cancelled successfully', order);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);

      if (onError) {
        onError(message, error);
      }
    },
  });

  /**
   * Calculate statistics from orders
   */
  const calculateStatistics = useCallback((ordersList) => {
    if (!ordersList || ordersList.length === 0) {
      setStatistics({
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalAmount: 0,
      });
      return;
    }

    const stats = {
      total: ordersList.length,
      pending: ordersList.filter((o) => o.orderStatus === 'pending').length,
      confirmed: ordersList.filter((o) => o.orderStatus === 'confirmed').length,
      processing: ordersList.filter((o) => o.orderStatus === 'processing')
        .length,
      shipped: ordersList.filter((o) => o.orderStatus === 'shipped').length,
      delivered: ordersList.filter((o) => o.orderStatus === 'delivered').length,
      cancelled: ordersList.filter((o) => o.orderStatus === 'cancelled').length,
      totalAmount: ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    };

    setStatistics(stats);
  }, []);

  /**
   * Update orders when data changes
   */
  useEffect(() => {
    if (ordersResponse) {
      const ordersList = ordersResponse.data || [];
      const paginationData = ordersResponse.pagination || null;

      setOrders(ordersList);
      setPagination(paginationData);
      calculateStatistics(ordersList);
    }
  }, [ordersResponse, calculateStatistics]);

  /**
   * Get orders by status
   */
  const getOrdersByStatus = useCallback(
    async (status, page = 1, limit = 10) => {
      try {
        const response = await orderService.getOrdersByStatus(
          status,
          page,
          limit
        );
        const data = extractData(response);
        return data?.data || [];
      } catch (error) {
        if (onError) onError(error.response?.data?.message, error);
        return [];
      }
    },
    [onError]
  );

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(async () => {
    try {
      const response = await orderService.getOrderStats();
      const data = extractData(response);
      if (data) setStatistics(data);
      return data;
    } catch (error) {
      return null;
    }
  }, []);

  /**
   * Filter orders by status locally
   */
  const filterOrdersByStatus = useCallback(
    (status) => {
      if (!status || status === 'all') return orders;
      return orders.filter((order) => order.orderStatus === status);
    },
    [orders]
  );

  /**
   * Get order status color
   */
  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
      processing: 'text-purple-600 bg-purple-50 border-purple-200',
      shipped: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      delivered: 'text-green-600 bg-green-50 border-green-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  /**
   * Get order status label
   */
  const getOrderStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  /**
   * Get payment status color
   */
  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'text-green-600 bg-green-50 border-green-200',
      unpaid: 'text-orange-600 bg-orange-50 border-orange-200',
      failed: 'text-red-600 bg-red-50 border-red-200',
      refunded: 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  /**
   * Get payment status label
   */
  const getPaymentStatusLabel = (status) => {
    const labels = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      failed: 'Failed',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  };

  return {
    // Data
    orders,
    selectedOrder,
    statistics,
    pagination,

    // States
    isLoading,
    error: fetchError,

    // Actions
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    getOrderById: getOrderByIdMutation.mutate,
    getOrderByIdAsync: getOrderByIdMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutate,
    cancelOrderAsync: cancelOrderMutation.mutateAsync,
    getOrdersByStatus,
    getOrderStats,
    filterOrdersByStatus,
    refetch,

    // Loading states
    isCreating: createOrderMutation.isPending,
    isFetching: getOrderByIdMutation.isPending,
    isCancelling: cancelOrderMutation.isPending,

    // Utilities
    setSelectedOrder,
    getOrderStatusColor,
    getOrderStatusLabel,
    getPaymentStatusColor,
    getPaymentStatusLabel,
    clearError: () => queryClient.resetQueries({ queryKey: ['orders'] }),
  };
};

export default useOrder;
