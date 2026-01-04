import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { usePayment } from '../../hooks/usePayment';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('processing');

  const { parseVNPayReturn, checkPaymentSuccess } = usePayment();

  useEffect(() => {
    const handleReturn = async () => {
      try {
        // Parse VNPay return parameters (client-side parsing, NO signature verification)
        const paymentResult = parseVNPayReturn(searchParams);

        // Check if payment was successful based on response code
        if (checkPaymentSuccess(paymentResult.responseCode)) {
          setVerificationStatus('success');

          // Redirect to success page
          // Backend will be queried by success page to get updated order
          setTimeout(() => {
            navigate(
              `/payment/success?orderId=${paymentResult.orderId}&transactionId=${paymentResult.transactionNo}`,
              { replace: true }
            );
          }, 1000);
        } else {
          setVerificationStatus('failed');

          // Redirect to failure page
          setTimeout(() => {
            const errorParams = new URLSearchParams();
            errorParams.set('orderId', paymentResult.orderId || '');
            errorParams.set(
              'vnp_ResponseCode',
              paymentResult.responseCode || ''
            );
            if (paymentResult.transactionNo) {
              errorParams.set('transactionNo', paymentResult.transactionNo);
            }

            navigate(`/payment/failure?${errorParams.toString()}`, {
              replace: true,
            });
          }, 1000);
        }
      } catch (error) {
        setVerificationStatus('failed');

        // Redirect to failure page with generic error
        setTimeout(() => {
          navigate(
            '/payment/failure?message=' +
              encodeURIComponent(
                'An error occurred while processing the payment result.'
              ),
            { replace: true }
          );
        }, 2000);
      }
    };

    handleReturn();
  }, [searchParams, navigate, parseVNPayReturn, checkPaymentSuccess]);

  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        {verificationStatus === 'processing' && (
          <>
            <CircularProgress size={60} className="text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Processing payment result...
            </h2>
            <p className="text-gray-500">Please do not close this window</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Payment successful!
            </h2>
            <p className="text-gray-500">Redirecting...</p>
          </>
        )}

        {verificationStatus === 'failed' && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Payment failed
            </h2>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </>
        )}
      </div>
    </section>
  );
};

export default VNPayReturn;
