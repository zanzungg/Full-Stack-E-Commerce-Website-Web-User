import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import {
  MdCheckCircle,
  MdOutlineShoppingBag,
  MdLocationOn,
  MdPayment,
  MdReceipt,
} from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { useOrder } from '../../hooks/useOrder';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);

  const { getOrderByIdAsync } = useOrder();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get order ID and transaction ID from URL params
        const orderId = searchParams.get('orderId');
        const transactionId = searchParams.get('transactionId');

        if (!orderId) {
          navigate('/my-orders');
          return;
        }

        // Fetch order details using order service (works for both COD and VNPAY)
        const orderData = await getOrderByIdAsync(orderId);

        if (!orderData) {
          setOrderInfo({
            orderId: orderId,
            transactionId: transactionId,
          });
          setIsVerifying(false);
          return;
        }

        setOrderInfo({
          orderId: orderId,
          transactionId:
            transactionId || orderData.paymentResult?.transactionId,
          totalAmount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus,
          orderStatus: orderData.orderStatus,
          createdAt: orderData.createdAt,
        });
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        // Even if verification fails, stay on success page with limited info
        setOrderInfo({
          orderId: searchParams.get('orderId'),
          transactionId: searchParams.get('transactionId'),
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, getOrderByIdAsync]);

  if (isVerifying) {
    return (
      <section className="py-10 md:py-20 bg-gray-50 min-h-screen flex items-center justify-center px-3">
        <div className="text-center">
          <CircularProgress size={50} className="text-green-600 mb-4" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Verifying payment...
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
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 lg:p-12">
          {/* Success Icon */}
          <div className="text-center mb-6 md:mb-8">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-3 md:mb-4 animate-bounce">
              <MdCheckCircle className="text-green-600 text-4xl md:text-5xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {orderInfo?.paymentMethod === 'COD'
                ? 'Order placed successfully!'
                : 'Payment successful!'}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {orderInfo?.paymentMethod === 'COD'
                ? 'Your order has been confirmed'
                : 'Your transaction has been processed successfully.'}
            </p>
          </div>

          {/* Order Details */}
          {orderInfo && (
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Order ID */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 md:pb-4 border-b border-gray-200 gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <MdReceipt className="text-blue-600 text-xl md:text-2xl shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        Order ID
                      </p>
                      <p className="font-semibold text-sm md:text-base text-gray-800 break-all">
                        #{orderInfo.orderId?.slice(-8)?.toUpperCase() || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right ml-7 sm:ml-0">
                    <p className="text-xs md:text-sm text-gray-500">Status</p>
                    <span className="inline-block px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded-full">
                      {orderInfo.orderStatus === 'confirmed'
                        ? 'Confirmed'
                        : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Transaction ID (for online payment) */}
                {orderInfo.transactionId && (
                  <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-gray-200 gap-2">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <MdPayment className="text-purple-600 text-xl md:text-2xl shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">
                          Transaction ID
                        </p>
                        <p className="font-semibold text-sm md:text-base text-gray-800 break-all">
                          {orderInfo.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 md:pb-4 border-b border-gray-200 gap-2">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Payment Method
                    </p>
                    <p className="font-semibold text-sm md:text-base text-gray-800">
                      {orderInfo.paymentMethod === 'COD'
                        ? 'Cash on Delivery'
                        : orderInfo.paymentMethod === 'VNPAY'
                          ? 'VNPay'
                          : orderInfo.paymentMethod}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs md:text-sm text-gray-500">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
                        orderInfo.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {orderInfo.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2">
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                      ${orderInfo.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  {orderInfo.createdAt && (
                    <div className="text-left sm:text-right">
                      <p className="text-xs md:text-sm text-gray-500">
                        Order Date
                      </p>
                      <p className="text-xs md:text-sm text-gray-700">
                        {new Date(orderInfo.createdAt).toLocaleDateString(
                          'en-VN',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <p className="text-blue-800 text-xs md:text-sm">
                  <strong>📧 Confirmation Email</strong> has been sent to your
                  email address with the order details.
                </p>
              </div>

              {orderInfo.paymentMethod === 'COD' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
                  <p className="text-orange-800 text-xs md:text-sm">
                    <strong>💵 Note:</strong> Please prepare the amount of{' '}
                    <strong>${orderInfo.totalAmount?.toFixed(2)}</strong> for
                    payment upon delivery.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
            <Link to={`/my-orders`} className="flex-1">
              <Button className="btn-org w-full flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-3">
                <MdOutlineShoppingBag className="text-lg md:text-xl" />
                View My Orders
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button
                variant="outlined"
                className="w-full flex items-center justify-center gap-2 border-gray-300! text-gray-700! hover:bg-gray-50! text-sm md:text-base py-2 md:py-3"
              >
                Continue Shopping
                <FaArrowRight className="text-sm" />
              </Button>
            </Link>
          </div>

          {/* Delivery Timeline */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <MdLocationOn className="text-blue-600 text-xl md:text-2xl" />
              Delivery Process
            </h3>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-3 md:gap-4 relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className="text-sm md:text-base font-semibold text-gray-800">
                      Order Confirmed
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      Your order is being processed
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className="text-sm md:text-base font-semibold text-gray-600">
                      Packaging
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      Your items are being prepared for shipment
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className="text-sm md:text-base font-semibold text-gray-600">
                      Out for Delivery
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      Your order is on its way to you
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm md:text-base font-semibold text-gray-600">
                      Delivered Successfully
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500">
                      Estimated 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
