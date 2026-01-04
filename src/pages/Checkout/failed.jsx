import React, { useEffect, useState } from 'react';
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

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [failureInfo, setFailureInfo] = useState(null);

  const { handlePaymentCallback, getPaymentMessage, createVNPayPaymentAsync } =
    usePayment();

  useEffect(() => {
    const parseFailure = async () => {
      try {
        // Get failure info from URL params
        const message = searchParams.get('message');
        const orderId = searchParams.get('orderId');
        const responseCode = searchParams.get('vnp_ResponseCode');

        let errorMessage = message || 'Payment failed';

        // If VNPay params exist, parse them
        if (searchParams.has('vnp_ResponseCode')) {
          const paymentResult = await handlePaymentCallback(searchParams);
          errorMessage = getPaymentMessage(paymentResult.responseCode);

          setFailureInfo({
            orderId: paymentResult.orderId || orderId,
            message: errorMessage,
            responseCode: paymentResult.responseCode,
            transactionNo: paymentResult.transactionNo,
            bankCode: paymentResult.bankCode,
            amount: paymentResult.amount,
          });
        } else {
          setFailureInfo({
            orderId: orderId,
            message: errorMessage,
          });
        }
      } catch (error) {
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
  }, [searchParams, handlePaymentCallback, getPaymentMessage]);

  const handleRetry = async () => {
    if (failureInfo?.orderId) {
      // Retry VNPay payment for the existing order
      try {
        const vnpAmount = failureInfo.amount
          ? Math.round(failureInfo.amount * 23000 * 100)
          : 0;

        if (vnpAmount > 0) {
          await createVNPayPaymentAsync({
            orderId: failureInfo.orderId,
            amount: vnpAmount,
            orderInfo: `Thanh toan don hang ${failureInfo.orderId.slice(-8)}`,
            locale: 'vn',
          });
          // Will automatically redirect to VNPay
        } else {
          // No amount available, redirect to checkout
          navigate('/checkout');
        }
      } catch (error) {
        navigate('/checkout');
      }
    } else {
      // No orderId, create a new order
      navigate('/checkout');
    }
  };

  if (isVerifying) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Verifying transaction...
          </h2>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="container max-w-3xl">
        {/* Failure Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Error Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <MdError className="text-red-600 text-5xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600">
              Unfortunately, your transaction could not be completed.
            </p>
          </div>

          {/* Failure Details */}
          {failureInfo && (
            <div className="space-y-4 mb-8">
              {/* Error Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <MdWarning className="text-red-600 text-2xl mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">
                      Failure Reason
                    </h3>
                    <p className="text-red-700">{failureInfo.message}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                {failureInfo.orderId && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <span className="font-semibold text-gray-800">
                      #{failureInfo.orderId?.slice(-8)?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                )}

                {failureInfo.transactionNo && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">
                      Transaction ID
                    </span>
                    <span className="font-semibold text-gray-800">
                      {failureInfo.transactionNo}
                    </span>
                  </div>
                )}

                {failureInfo.responseCode && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Error Code</span>
                    <span className="font-semibold text-gray-800">
                      {failureInfo.responseCode}
                    </span>
                  </div>
                )}

                {failureInfo.bankCode && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm text-gray-500">Bank</span>
                    <span className="font-semibold text-gray-800">
                      {failureInfo.bankCode}
                    </span>
                  </div>
                )}

                {failureInfo.amount > 0 && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="text-xl font-bold text-gray-800">
                      ${failureInfo.amount?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Help Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  💡 Helpful tips:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Check your account balance</li>
                  <li>
                    Ensure your card/account is enabled for online payments
                  </li>
                  <li>Try again with a different payment method</li>
                  <li>Contact your bank if the issue persists</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              className="btn-org flex-1 flex items-center justify-center gap-2"
              onClick={handleRetry}
            >
              <MdRefresh className="text-xl" />
              Retry Payment
            </Button>
            <Link to="/my-orders" className="flex-1">
              <Button
                variant="outlined"
                className="w-full flex items-center justify-center gap-2 border-gray-300! text-gray-700! hover:bg-gray-50!"
              >
                <MdOutlineShoppingBag className="text-xl" />
                View My Orders
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <Link to="/" className="block">
              <Button
                variant="text"
                className="w-full flex items-center justify-center gap-2 text-gray-600! hover:bg-gray-50!"
              >
                <MdHome className="text-xl" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help? Contact us:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="tel:1900xxxx"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                📞 Hotline: 1900 xxxx
              </a>
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
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
