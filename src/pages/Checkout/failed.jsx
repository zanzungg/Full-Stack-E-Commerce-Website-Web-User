import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import {
  MdError,
  MdRefresh,
  MdHome,
  MdOutlineShoppingBag,
  MdWarning,
} from 'react-icons/md';
import { usePayment } from '../../hooks/usePayment';
import { useOrder } from '../../hooks/useOrder';
import { toast } from 'react-hot-toast';
import { usdToVnPayAmount } from '../../utils/currency.js';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [failureInfo, setFailureInfo] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const { parseVNPayReturn, getPaymentMessage, createVNPayPaymentAsync } =
    usePayment();

  const { getOrderByIdAsync } = useOrder();

  useEffect(() => {
    const parseFailure = async () => {
      try {
        // Get failure info from URL params
        const message = searchParams.get('message');
        const orderId = searchParams.get('orderId');
        const responseCode = searchParams.get('vnp_ResponseCode');

        let errorMessage = message || 'Payment failed';
        let parsedInfo = null;

        // If VNPay params exist, parse them
        if (searchParams.has('vnp_ResponseCode')) {
          const paymentResult = parseVNPayReturn(searchParams);
          errorMessage = getPaymentMessage(paymentResult.responseCode);

          parsedInfo = {
            orderId: paymentResult.orderId || orderId,
            message: errorMessage,
            responseCode: paymentResult.responseCode,
            transactionNo: paymentResult.transactionNo,
            bankCode: paymentResult.bankCode,
            amount: paymentResult.amount, // This is in VND (already divided by 100)
          };
        } else {
          parsedInfo = {
            orderId: orderId,
            message: errorMessage,
          };
        }

        setFailureInfo(parsedInfo);

        // Fetch order details if orderId exists
        if (parsedInfo?.orderId) {
          try {
            const order = await getOrderByIdAsync(parsedInfo.orderId);
            setOrderDetails(order);
          } catch (error) {
            console.error('Failed to fetch order details:', error);
            // Continue without order details - backend will validate anyway
          }
        }
      } catch (error) {
        console.error('Parse failure error:', error);
        setFailureInfo({
          message:
            searchParams.get('message') ||
            'An error occurred during payment processing.',
        });
      } finally {
        setIsVerifying(false);
      }
    };

    parseFailure();
  }, [searchParams, parseVNPayReturn, getPaymentMessage, getOrderByIdAsync]);

  /**
   * Handle Retry Payment
   * ✅ Simplified logic - let backend handle validation
   */
  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      let order = orderDetails;

      // If no order details, try to fetch
      if (!order && failureInfo?.orderId) {
        try {
          order = await getOrderByIdAsync(failureInfo.orderId);
        } catch (error) {
          console.error('Failed to fetch order:', error);
          toast.error('Failed to load order details. Please try again.', {
            duration: 4000,
            position: 'top-right',
          });
          setIsRetrying(false);
          return;
        }
      }

      // If still no order, redirect to checkout
      if (!order) {
        toast.info('Please create a new order', {
          duration: 3000,
          position: 'top-right',
        });
        navigate('/checkout');
        setIsRetrying(false);
        return;
      }

      const vnpAmount = usdToVnPayAmount(order.totalAmount);

      // ✅ Try to create payment URL
      // Backend will validate if order is paid/cancelled
      try {
        await createVNPayPaymentAsync({
          orderId: order._id,
          amount: vnpAmount,
          orderInfo: `Thanh toan don hang ${order._id.slice(-8)}`,
          locale: 'vn',
        });
        // Will automatically redirect to VNPay if successful
      } catch (error) {
        // Handle specific error cases from backend
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to retry payment';

        if (errorMessage.includes('already paid')) {
          toast.success('This order is already paid!', {
            duration: 3000,
            position: 'top-right',
          });
          setTimeout(() => navigate('/my-orders'), 1500);
        } else if (errorMessage.includes('cancelled')) {
          toast.error(
            'This order has been cancelled. Please create a new order.',
            {
              duration: 4000,
              position: 'top-right',
            }
          );
          setTimeout(() => navigate('/checkout'), 2000);
        } else {
          toast.error(errorMessage, {
            duration: 4000,
            position: 'top-right',
          });
        }
      }
    } catch (error) {
      console.error('Retry payment error:', error);
      toast.error('An unexpected error occurred. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsRetrying(false);
    }
  };

  if (isVerifying) {
    return (
      <section className="py-10 md:py-20 bg-gray-50 min-h-screen flex items-center justify-center px-3">
        <div className="text-center">
          <CircularProgress size={50} className="text-red-600 mb-4" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Verifying transaction...
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Please wait a moment
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-result-page py-5 md:py-10 bg-gray-50 min-h-screen">
      <div className="container max-w-3xl px-3 md:px-4">
        {/* Failure Card */}
        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 lg:p-12">
          {/* Error Icon */}
          <div className="text-center mb-6 md:mb-8">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <MdError className="text-red-600 text-4xl md:text-5xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Unfortunately, your transaction could not be completed.
            </p>
          </div>

          {/* Failure Details */}
          {failureInfo && (
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {/* Error Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <MdWarning className="text-red-600 text-xl md:text-2xl mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base text-red-800 mb-1">
                      Failure Reason
                    </h3>
                    <p className="text-xs md:text-sm text-red-700 wrap-break-word">
                      {failureInfo.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-2 md:space-y-3">
                {failureInfo.orderId && (
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Order ID
                    </span>
                    <span className="font-semibold text-xs md:text-base text-gray-800 break-all text-right">
                      #{failureInfo.orderId?.slice(-8)?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                )}

                {failureInfo.transactionNo && (
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200 gap-2">
                    <span className="text-xs md:text-sm text-gray-500 shrink-0">
                      Transaction ID
                    </span>
                    <span className="font-semibold text-xs md:text-base text-gray-800 break-all text-right">
                      {failureInfo.transactionNo}
                    </span>
                  </div>
                )}

                {failureInfo.responseCode && (
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Error Code
                    </span>
                    <span className="font-semibold text-xs md:text-base text-gray-800">
                      {failureInfo.responseCode}
                    </span>
                  </div>
                )}

                {failureInfo.bankCode && (
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Bank
                    </span>
                    <span className="font-semibold text-xs md:text-base text-gray-800">
                      {failureInfo.bankCode}
                    </span>
                  </div>
                )}

                {/* Amount - prefer orderDetails over failureInfo */}
                {(orderDetails?.totalAmount !== undefined ||
                  failureInfo.amount > 0) && (
                  <div className="flex justify-between items-center pt-2 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Amount
                    </span>
                    <span className="text-lg md:text-xl font-bold text-gray-800">
                      $
                      {orderDetails?.totalAmount?.toFixed(2) ||
                        (failureInfo.amount / USD_TO_VND)?.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Order Status */}
                {orderDetails && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Order Status
                    </span>
                    <span
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
                        orderDetails.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : orderDetails.orderStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {orderDetails.orderStatus === 'pending'
                        ? 'Pending Payment'
                        : orderDetails.orderStatus === 'cancelled'
                          ? 'Cancelled'
                          : orderDetails.orderStatus.charAt(0).toUpperCase() +
                            orderDetails.orderStatus.slice(1)}
                    </span>
                  </div>
                )}

                {/* Payment Status */}
                {orderDetails && (
                  <div className="flex justify-between items-center pt-2 gap-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      Payment Status
                    </span>
                    <span
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
                        orderDetails.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : orderDetails.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {orderDetails.paymentStatus === 'paid'
                        ? 'Paid'
                        : orderDetails.paymentStatus === 'failed'
                          ? 'Failed'
                          : 'Unpaid'}
                    </span>
                  </div>
                )}
              </div>

              {/* Warning if order is cancelled */}
              {orderDetails?.orderStatus === 'cancelled' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
                  <p className="text-orange-800 text-xs md:text-sm">
                    <strong>⚠️ Note:</strong> This order has been cancelled.
                    Please create a new order to continue shopping.
                  </p>
                </div>
              )}

              {/* Info if order is already paid */}
              {orderDetails?.paymentStatus === 'paid' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                  <p className="text-green-800 text-xs md:text-sm">
                    <strong>✅ Note:</strong> This order has already been paid.
                    You can view it in your orders list.
                  </p>
                </div>
              )}

              {/* Help Info - only show if order can be retried */}
              {(!orderDetails ||
                (orderDetails.orderStatus !== 'cancelled' &&
                  orderDetails.paymentStatus !== 'paid')) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                  <h4 className="font-semibold text-sm md:text-base text-blue-800 mb-2">
                    💡 Helpful tips:
                  </h4>
                  <ul className="text-xs md:text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Check your account balance</li>
                    <li>
                      Ensure your card/account is enabled for online payments
                    </li>
                    <li>Try again with a different payment method</li>
                    <li>Contact your bank if the issue persists</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
            {/* Only show Retry if order can be retried */}
            {(!orderDetails ||
              (orderDetails.orderStatus !== 'cancelled' &&
                orderDetails.paymentStatus !== 'paid')) && (
              <Button
                className="btn-org flex-1 flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-3"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span className="text-xs md:text-sm">Processing...</span>
                  </>
                ) : (
                  <>
                    <MdRefresh className="text-lg md:text-xl" />
                    <span>
                      {failureInfo?.orderId ? 'Retry Payment' : 'Try Again'}
                    </span>
                  </>
                )}
              </Button>
            )}

            <Link
              to="/my-orders"
              className={
                !orderDetails ||
                (orderDetails.orderStatus !== 'cancelled' &&
                  orderDetails.paymentStatus !== 'paid')
                  ? 'flex-1'
                  : 'w-full'
              }
            >
              <Button
                variant="outlined"
                className="w-full flex items-center justify-center gap-2 border-gray-300! text-gray-700! hover:bg-gray-50! text-sm md:text-base py-2 md:py-3"
              >
                <MdOutlineShoppingBag className="text-lg md:text-xl" />
                View My Orders
              </Button>
            </Link>
          </div>

          <div className="mt-3 md:mt-4">
            <Link to="/" className="block">
              <Button
                variant="text"
                className="w-full flex items-center justify-center gap-2 text-gray-600! hover:bg-gray-50! text-sm md:text-base py-2"
              >
                <MdHome className="text-lg md:text-xl" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center">
            <p className="text-xs md:text-sm text-gray-600 mb-2">
              Need help? Contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center text-xs md:text-sm">
              <a
                href="tel:1900xxxx"
                className="text-blue-600 hover:text-blue-700 font-medium break-all"
              >
                📞 Hotline: 1900 xxxx
              </a>
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-700 font-medium break-all"
              >
                📧 support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentFailed;
