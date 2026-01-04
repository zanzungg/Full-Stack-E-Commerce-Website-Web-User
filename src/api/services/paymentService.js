// src/api/services/paymentService.js
import axiosInstance from '../axiosConfig';
import { API_ENDPOINTS } from '../../config/constants';

export const paymentService = {
  /**
   * Create VNPay payment URL
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.orderId - Order ID
   * @param {number} paymentData.amount - Payment amount in VND (already converted)
   * @param {string} paymentData.orderInfo - Order information/description
   * @param {string} paymentData.bankCode - Bank code (optional)
   * @param {string} paymentData.locale - Language locale (vn/en, default: vn)
   * @returns {Promise} Payment URL response
   */
  createVNPayPayment: async (paymentData) => {
    try {
      const payload = {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        orderInfo:
          paymentData.orderInfo || `Thanh toan don hang ${paymentData.orderId}`,
        locale: paymentData.locale || 'vn',
      };

      // Add optional fields if provided
      if (paymentData.bankCode) {
        payload.bankCode = paymentData.bankCode;
      }

      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_PAYMENT_URL,
        payload
      );

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Query VNPay transaction status
   * @param {string} orderId - Order ID to query
   * @returns {Promise} Transaction status
   */
  queryVNPayTransaction: async (orderId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.QUERY_VNPAY_TRANSACTION(orderId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Redirect to VNPay payment gateway
   * @param {string} orderId - Order ID
   * @param {number} amount - Payment amount
   * @param {Object} options - Additional options
   * @param {string} options.orderInfo - Order description
   * @param {string} options.bankCode - Bank code
   * @param {string} options.locale - Language (vn/en)
   * @returns {Promise} Redirects to payment URL
   */
  redirectToVNPay: async (orderId, amount, options = {}) => {
    try {
      const response = await paymentService.createVNPayPayment({
        orderId,
        amount,
        orderInfo: options.orderInfo,
        bankCode: options.bankCode,
        locale: options.locale || 'vn',
      });

      if (response.success && response.data?.paymentUrl) {
        // Redirect to VNPay payment page
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.message || 'Failed to create payment URL');
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Parse VNPay return URL parameters (Client-side only, for display)
   * WARNING: This does NOT verify signature. Use verifyVNPayReturn() for verification.
   * @param {URLSearchParams} params - URL search parameters
   * @returns {Object} Parsed payment result
   */
  parseVNPayReturn: (params) => {
    const vnpParams = {};

    for (const [key, value] of params.entries()) {
      vnpParams[key] = value;
    }

    return {
      responseCode: vnpParams.vnp_ResponseCode,
      transactionNo: vnpParams.vnp_TransactionNo,
      amount: vnpParams.vnp_Amount ? parseInt(vnpParams.vnp_Amount) / 100 : 0, // Convert back from VNPay format
      orderId: vnpParams.vnp_TxnRef,
      bankCode: vnpParams.vnp_BankCode,
      bankTranNo: vnpParams.vnp_BankTranNo,
      cardType: vnpParams.vnp_CardType,
      orderInfo: vnpParams.vnp_OrderInfo,
      payDate: vnpParams.vnp_PayDate,
      transactionStatus: vnpParams.vnp_TransactionStatus,
      secureHash: vnpParams.vnp_SecureHash,
    };
  },

  /**
   * Check if VNPay payment was successful
   * @param {string} responseCode - VNPay response code
   * @returns {boolean} True if successful
   */
  isPaymentSuccessful: (responseCode) => {
    return responseCode === '00';
  },

  /**
   * Get VNPay response code message (Vietnamese)
   * @param {string} responseCode - VNPay response code
   * @returns {string} Human-readable message
   */
  getVNPayMessage: (responseCode) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ gian lận',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
      10: 'Thẻ/Tài khoản xác thực thông tin sai quá 3 lần',
      11: 'Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại',
      12: 'Thẻ/Tài khoản bị khóa',
      13: 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
      24: 'Giao dịch bị hủy',
      51: 'Tài khoản không đủ số dư',
      65: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
      75: 'Ngân hàng thanh toán đang bảo trì',
      79: 'Giao dịch vượt quá hạn mức',
      99: 'Lỗi không xác định',
    };

    return (
      messages[responseCode] || `Mã phản hồi không xác định (${responseCode})`
    );
  },

  /**
   * Handle payment callback and verify transaction
   * @param {Object} order - Order object
   * @returns {Promise} Transaction verification result
   */
  verifyPayment: async (order) => {
    try {
      const response = await paymentService.queryVNPayTransaction(order._id);

      if (response.success) {
        return {
          success: true,
          paymentStatus: response.data.paymentStatus,
          transactionInfo: response.data.paymentResult,
        };
      }

      return { success: false, message: 'Failed to verify payment' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Get supported payment methods
   * @returns {Array} List of payment methods
   */
  getPaymentMethods: () => {
    return [
      {
        code: 'COD',
        name: 'Cash on Delivery',
        description: 'Pay with cash upon delivery',
        icon: '💵',
        available: true,
      },
      {
        code: 'VNPAY',
        name: 'VNPay',
        description: 'Pay via the VNPay payment gateway',
        icon: '🏦',
        available: true,
      },
      {
        code: 'MOMO',
        name: 'MoMo Wallet',
        description: 'Pay via MoMo e-wallet',
        icon: '📱',
        available: false, // Coming soon
      },
      {
        code: 'STRIPE',
        name: 'Credit/Debit Card',
        description: 'Pay with international credit/debit card',
        icon: '💳',
        available: false, // Coming soon
      },
    ];
  },

  /**
   * Check if payment method is available
   * @param {string} method - Payment method code
   * @returns {boolean} True if available
   */
  isPaymentMethodAvailable: (method) => {
    const availableMethods = ['COD', 'VNPAY'];
    return availableMethods.includes(method);
  },

  /**
   * Format amount to VND currency
   * @param {number} amount - Amount in VND
   * @returns {string} Formatted currency string
   */
  formatVNDAmount: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  },

  /**
   * Format amount to USD currency
   * @param {number} amount - Amount in USD
   * @returns {string} Formatted currency string
   */
  formatUSDAmount: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },
};

export default paymentService;
