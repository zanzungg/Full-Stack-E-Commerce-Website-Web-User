import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../api/services/paymentService';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing payments
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 */
export const usePayment = (options = {}) => {
  const { onSuccess = null, onError = null } = options;

  // State management
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Initialize payment methods
   */
  useEffect(() => {
    const methods = paymentService.getPaymentMethods();
    setPaymentMethods(methods);
  }, []);

  /**
   * Create VNPay payment mutation
   */
  const createVNPayMutation = useMutation({
    mutationFn: (paymentData) => paymentService.createVNPayPayment(paymentData),
    onSuccess: (response) => {
      if (response.success && response.data?.paymentUrl) {
        const paymentUrl = response.data.paymentUrl;

        if (onSuccess) {
          onSuccess(
            response.message || 'Payment URL created successfully',
            response.data
          );
        }

        toast.success('Redirecting to payment gateway...', {
          duration: 2000,
          position: 'top-right',
          icon: '🔄',
        });

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1500);
      } else {
        const message = response.message || 'Failed to create payment URL';
        toast.error(message, {
          duration: 4000,
          position: 'top-right',
          icon: '❌',
        });
      }
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create VNPay payment';

      if (onError) {
        onError(message, error);
      }

      toast.error(message, {
        duration: 4000,
        position: 'top-right',
        icon: '❌',
      });
    },
  });

  /**
   * Query VNPay transaction mutation
   */
  const queryTransactionMutation = useMutation({
    mutationFn: (orderId) => paymentService.queryVNPayTransaction(orderId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setPaymentResult(response.data);
        return response.data;
      } else {
        const message =
          response.message || 'Failed to query transaction status';
        toast.error(message, {
          duration: 4000,
          position: 'top-right',
        });
        return null;
      }
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to query VNPay transaction';

      if (onError) {
        onError(message, error);
      }

      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });

      return null;
    },
  });

  /**
   * Verify payment mutation (legacy - for compatibility)
   */
  const verifyPaymentMutation = useMutation({
    mutationFn: (order) => paymentService.verifyPayment(order),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Payment verification successful', {
          duration: 3000,
          position: 'top-right',
          icon: '✅',
        });
      }
      return response;
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to verify payment';

      if (onError) {
        onError(message, error);
      }

      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
    },
  });

  /**
   * Process payment based on selected method
   */
  const processPayment = useCallback(
    async (
      orderId,
      amount,
      paymentMethod = selectedPaymentMethod,
      options = {}
    ) => {
      setIsProcessing(true);

      try {
        if (paymentMethod === 'COD') {
          // COD doesn't require additional processing
          setIsProcessing(false);

          if (onSuccess) {
            onSuccess('Order placed successfully with Cash on Delivery', {
              orderId,
              paymentMethod: 'COD',
            });
          }

          toast.success('Order placed successfully with Cash on Delivery', {
            duration: 4000,
            position: 'top-right',
            icon: '💵',
          });

          return { success: true, paymentMethod: 'COD' };
        } else if (paymentMethod === 'VNPAY') {
          // Create VNPay payment
          const response = await createVNPayMutation.mutateAsync({
            orderId,
            amount,
            orderInfo: options.orderInfo || `Thanh toan don hang ${orderId}`,
            bankCode: options.bankCode,
            locale: options.locale || 'vn',
          });

          setIsProcessing(false);
          return response;
        } else if (paymentMethod === 'MOMO' || paymentMethod === 'STRIPE') {
          // Not implemented yet
          setIsProcessing(false);

          toast.info(`Payment method ${paymentMethod} is not yet implemented`, {
            duration: 3000,
            position: 'top-right',
            icon: 'ℹ️',
          });

          return {
            success: false,
            message: 'Payment method not yet implemented',
          };
        } else {
          setIsProcessing(false);
          throw new Error('Invalid payment method selected');
        }
      } catch (error) {
        setIsProcessing(false);
        throw error;
      }
    },
    [selectedPaymentMethod, createVNPayMutation, onSuccess]
  );

  /**
   * Redirect to VNPay (alternative method)
   */
  const redirectToVNPay = useCallback(
    async (orderId, amount, options = {}) => {
      try {
        setIsProcessing(true);
        await paymentService.redirectToVNPay(orderId, amount, options);
      } catch (error) {
        setIsProcessing(false);

        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to redirect to VNPay';

        if (onError) {
          onError(message, error);
        }

        toast.error(message, {
          duration: 4000,
          position: 'top-right',
        });
      }
    },
    [onError]
  );

  /**
   * Parse VNPay return URL (client-side only, for display)
   * WARNING: Does NOT verify signature
   */
  const parseVNPayReturn = useCallback((searchParams) => {
    const result = paymentService.parseVNPayReturn(searchParams);
    setPaymentResult(result);
    return result;
  }, []);

  /**
   * Check if payment is successful
   */
  const checkPaymentSuccess = useCallback((responseCode) => {
    return paymentService.isPaymentSuccessful(responseCode);
  }, []);

  /**
   * Get VNPay message
   */
  const getPaymentMessage = useCallback((responseCode) => {
    return paymentService.getVNPayMessage(responseCode);
  }, []);

  /**
   * Handle payment callback (DEPRECATED - use verifyVNPayReturnAsync instead)
   * This method only parses and shows toast, doesn't verify with backend
   */
  const handlePaymentCallback = useCallback(
    async (searchParams) => {
      const result = parseVNPayReturn(searchParams);

      if (checkPaymentSuccess(result.responseCode)) {
        const successMessage = 'Payment successful!';

        toast.success(successMessage, {
          duration: 4000,
          position: 'top-right',
          icon: '✅',
        });

        if (onSuccess) {
          onSuccess(successMessage, result);
        }
      } else {
        const errorMessage = getPaymentMessage(result.responseCode);

        toast.error(`Payment failed: ${errorMessage}`, {
          duration: 5000,
          position: 'top-right',
          icon: '❌',
        });

        if (onError) {
          onError(errorMessage, result);
        }
      }

      return result;
    },
    [
      parseVNPayReturn,
      checkPaymentSuccess,
      getPaymentMessage,
      onSuccess,
      onError,
    ]
  );

  /**
   * Select payment method
   */
  const selectPaymentMethod = useCallback((method) => {
    if (paymentService.isPaymentMethodAvailable(method)) {
      setSelectedPaymentMethod(method);
      return true;
    }

    toast.error('Payment method not available', {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
    });

    return false;
  }, []);

  /**
   * Get payment method details
   */
  const getPaymentMethodDetails = useCallback(
    (methodCode) => {
      return paymentMethods.find((method) => method.code === methodCode);
    },
    [paymentMethods]
  );

  /**
   * Check if payment method is available
   */
  const isPaymentMethodAvailable = useCallback((method) => {
    return paymentService.isPaymentMethodAvailable(method);
  }, []);

  /**
   * Get payment status color (for UI)
   */
  const getPaymentStatusColor = useCallback((status) => {
    const colors = {
      paid: 'text-green-600 bg-green-50 border-green-200',
      unpaid: 'text-orange-600 bg-orange-50 border-orange-200',
      failed: 'text-red-600 bg-red-50 border-red-200',
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      refunded: 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  }, []);

  /**
   * Get payment status label
   */
  const getPaymentStatusLabel = useCallback((status) => {
    const labels = {
      paid: 'Paid',
      unpaid: 'Unpaid',
      failed: 'Failed',
      pending: 'Pending',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  }, []);

  /**
   * Format payment amount (VND)
   */
  const formatAmount = useCallback((amount) => {
    return paymentService.formatVNDAmount(amount);
  }, []);

  /**
   * Format USD amount
   */
  const formatUSDAmount = useCallback((amount) => {
    return paymentService.formatUSDAmount(amount);
  }, []);

  return {
    // Data
    paymentMethods,
    selectedPaymentMethod,
    paymentResult,

    // States
    isProcessing,
    isCreatingPayment: createVNPayMutation.isPending,
    isQuerying: queryTransactionMutation.isPending,
    isVerifying: verifyPaymentMutation.isPending,

    // Actions
    processPayment,
    createVNPayPayment: createVNPayMutation.mutate,
    createVNPayPaymentAsync: createVNPayMutation.mutateAsync,
    queryTransaction: queryTransactionMutation.mutate,
    queryTransactionAsync: queryTransactionMutation.mutateAsync,
    verifyPayment: verifyPaymentMutation.mutate,
    verifyPaymentAsync: verifyPaymentMutation.mutateAsync,
    redirectToVNPay,
    handlePaymentCallback, // DEPRECATED
    selectPaymentMethod,

    // Utilities
    parseVNPayReturn,
    checkPaymentSuccess,
    getPaymentMessage,
    getPaymentMethodDetails,
    isPaymentMethodAvailable,
    getPaymentStatusColor,
    getPaymentStatusLabel,
    formatAmount,
    formatUSDAmount,
    setPaymentResult,
    clearPaymentResult: () => setPaymentResult(null),
  };
};
export default usePayment;
