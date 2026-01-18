import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, Skeleton } from '@mui/material';
import { IoEyeOutline } from 'react-icons/io5';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { MdShoppingBag } from 'react-icons/md';
import AccountSidebar from '../../components/AccountSidebar';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { MyContext } from '../../App';
import useOrder from '../../hooks/useOrder';

const OrderItemDetails = ({
  order,
  formatAddress,
  formatDate,
  getPaymentMethodLabel,
  getPaymentMethodIcon,
}) => (
  <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 border-b border-gray-200 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
      {/* Shipping Address */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 border-b pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] lg:text-[15px]">
          <span className="text-[16px] sm:text-[18px]">📦</span>
          <span>Shipping Address</span>
        </h4>
        {order.shippingAddress ? (
          <>
            {order.shippingAddress.addressType && (
              <div className="mb-1.5 sm:mb-2">
                <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium rounded">
                  {order.shippingAddress.addressType}
                </span>
              </div>
            )}
            <p className="text-[12px] sm:text-sm text-gray-600 leading-relaxed mb-1.5 sm:mb-2">
              {formatAddress(order.shippingAddress)}
            </p>
            {order.shippingAddress.mobile && (
              <p className="text-[12px] sm:text-sm text-gray-700 font-medium flex items-center gap-1">
                <span>📞</span>
                <span>{order.shippingAddress.mobile}</span>
              </p>
            )}
          </>
        ) : (
          <div className="text-[12px] sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded border border-amber-200">
            <p className="font-medium text-[12px] sm:text-[13px]">
              ⚠️ No shipping address
            </p>
            <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1">
              Digital product or pickup order
            </p>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 border-b pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] lg:text-[15px]">
          <span className="text-[16px] sm:text-[18px]">💳</span>
          <span>Payment Info</span>
        </h4>
        <div className="space-y-1.5 sm:space-y-2 text-[12px] sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {getPaymentMethodIcon(order.paymentMethod)}
            </span>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-semibold text-gray-800">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
            </div>
          </div>
          <div className="pt-1.5 sm:pt-2 border-t">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
              Payment Status
            </p>
            <span
              className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold uppercase ${
                order.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      {order.paymentResult?.transactionId ? (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 border-b pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] lg:text-[15px]">
            <span className="text-[16px] sm:text-[18px]">🧾</span>
            <span>Transaction</span>
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-[12px] sm:text-sm text-gray-600">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Transaction ID
              </p>
              <p className="font-mono font-semibold text-gray-800 text-[11px] sm:text-[13px] break-all">
                {order.paymentResult.transactionId}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Gateway</p>
              <p className="font-medium text-gray-800 text-[12px] sm:text-[13px]">
                {order.paymentResult.gateway}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Paid At</p>
              <p className="font-medium text-gray-800 text-[12px] sm:text-[13px]">
                {formatDate(order.paymentResult.paidAt)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100">
          <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 border-b pb-1.5 sm:pb-2 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] lg:text-[15px]">
            <span className="text-[16px] sm:text-[18px]">📋</span>
            <span>Order Info</span>
          </h4>
          <div className="space-y-1.5 sm:space-y-2 text-[12px] sm:text-sm">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Order Status
              </p>
              <p className="font-semibold text-gray-800 capitalize text-[12px] sm:text-[13px]">
                {order.orderStatus}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Created At</p>
              <p className="font-medium text-gray-800 text-[12px] sm:text-[13px]">
                {formatDate(order.createdAt)}
              </p>
            </div>
            {order.paymentMethod === 'COD' && (
              <div className="mt-1.5 sm:mt-2 p-1.5 sm:p-2 bg-blue-50 rounded text-[10px] sm:text-xs text-blue-700">
                💡 Payment will be collected upon delivery
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    <h4 className="font-bold mb-2 sm:mb-3 text-gray-800 text-[13px] sm:text-[14px] lg:text-[15px]">
      🛒 Products List
    </h4>
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-[11px] sm:text-sm min-w-[600px]">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-[13px]">
              Product
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-[13px]">
              Qty
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[11px] sm:text-[13px]">
              Price
            </th>
            <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[11px] sm:text-[13px]">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, idx) => (
            <tr
              key={idx}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
                <img
                  src={item.image.url || '/placeholder.png'}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded border"
                  alt={item.name}
                />
                <span className="font-medium text-[11px] sm:text-[13px] line-clamp-2">
                  {item.name}
                </span>
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-[13px]">
                x{item.quantity}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[11px] sm:text-[13px]">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-primary text-[11px] sm:text-[13px]">
                ${item.subTotal.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-100">
          <tr>
            <td
              colSpan="3"
              className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[12px] sm:text-[14px]"
            >
              Grand Total:
            </td>
            <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-[14px] sm:text-lg text-primary">
              ${order.totalAmount.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

const MyOrders = () => {
  const context = useContext(MyContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const {
    orders,
    isLoading,
    pagination,
    refetch,
    cancelOrder,
    isCancelling,
    getOrderStatusColor,
    getOrderStatusLabel,
    getPaymentStatusColor,
    getPaymentStatusLabel,
  } = useOrder({
    autoFetch: true,
    queryParams: {
      page: currentPage,
      limit: 10,
      status: statusFilter || undefined,
    },
  });

  // Refetch when page or status changes
  useEffect(() => {
    refetch();
  }, [currentPage, statusFilter]);

  const formatDate = useCallback((date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const formatAddress = useCallback((address) => {
    if (!address) return 'No shipping address provided';
    const parts = [
      address.address_line,
      address.landmark && `(${address.landmark})`,
      address.city,
      address.state,
      address.pincode,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  }, []);

  const getPaymentMethodLabel = useCallback((method) => {
    const labels = {
      COD: 'Cash on Delivery',
      VNPAY: 'VNPay',
      CREDIT_CARD: 'Credit Card',
      DEBIT_CARD: 'Debit Card',
      PAYPAL: 'PayPal',
    };
    return labels[method] || method;
  }, []);

  const getPaymentMethodIcon = useCallback((method) => {
    const icons = {
      COD: '💵',
      VNPAY: '🏦',
      CREDIT_CARD: '💳',
      DEBIT_CARD: '💳',
      PAYPAL: '💰',
    };
    return icons[method] || '💳';
  }, []);

  const toggleExpandRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const confirmCancelOrder = async () => {
    try {
      await cancelOrder(orderToCancel._id);
      setShowCancelDialog(false);
      context.openAlertBox('success', 'Order cancelled successfully!');
      refetch();
    } catch (error) {
      context.openAlertBox('error', 'Failed to cancel order');
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen py-5 sm:py-8 lg:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <aside className="w-full lg:w-1/4">
            <AccountSidebar />
          </aside>

          <main className="w-full lg:w-3/4">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-[18px] sm:text-xl lg:text-2xl font-extrabold text-gray-800">
                    My Orders
                  </h2>
                  <p className="text-[12px] sm:text-sm text-gray-500">
                    {pagination?.total || 0} orders found in your account
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[12px] sm:text-sm font-medium text-gray-600">
                    Filter:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] sm:text-sm rounded-lg focus:ring-primary focus:border-primary p-1.5 sm:p-2.5 outline-none"
                  >
                    <option value="">All Status</option>
                    {[
                      'pending',
                      'confirmed',
                      'shipping',
                      'completed',
                      'cancelled',
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-600 text-[10px] sm:text-sm uppercase">
                      <th className="px-2 sm:px-4 py-2 sm:py-4 w-8 sm:w-12"></th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Order ID
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Total
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Method
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Payment
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Status
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-left font-bold">
                        Date
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-4 text-center font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="8" className="p-4">
                            <Skeleton variant="rectangular" height={40} />
                          </td>
                        </tr>
                      ))
                    ) : orders?.length > 0 ? (
                      orders.map((order) => (
                        <React.Fragment key={order._id}>
                          <tr
                            className={`hover:bg-blue-50/30 transition-colors ${
                              expandedRows.includes(order._id)
                                ? 'bg-blue-50/20'
                                : ''
                            }`}
                          >
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-center">
                              <button
                                onClick={() => toggleExpandRow(order._id)}
                                className="text-gray-400 hover:text-primary transition-colors"
                              >
                                {expandedRows.includes(order._id) ? (
                                  <FaAngleUp
                                    size={16}
                                    className="sm:w-5 sm:h-5"
                                  />
                                ) : (
                                  <FaAngleDown
                                    size={16}
                                    className="sm:w-5 sm:h-5"
                                  />
                                )}
                              </button>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 font-mono text-[11px] sm:text-sm text-primary font-bold">
                              #{order._id.slice(-8).toUpperCase()}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 font-bold text-gray-800 text-[12px] sm:text-[14px]">
                              ${order.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4">
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <span className="text-base sm:text-lg">
                                  {getPaymentMethodIcon(order.paymentMethod)}
                                </span>
                                <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                                  {order.paymentMethod}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4">
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase ${getPaymentStatusColor(
                                  order.paymentStatus
                                )}`}
                              >
                                {getPaymentStatusLabel(order.paymentStatus)}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4">
                              <span
                                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${getOrderStatusColor(
                                  order.orderStatus
                                )}`}
                              >
                                {getOrderStatusLabel(order.orderStatus)}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4 text-[11px] sm:text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-4">
                              <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowModal(true);
                                  }}
                                  startIcon={
                                    <IoEyeOutline className="text-[12px] sm:text-[14px]" />
                                  }
                                  sx={{
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '4px 8px', sm: '6px 12px' },
                                  }}
                                >
                                  View
                                </Button>
                                {['pending', 'confirmed'].includes(
                                  order.orderStatus
                                ) && (
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      setOrderToCancel(order);
                                      setShowCancelDialog(true);
                                    }}
                                    disabled={isCancelling}
                                    sx={{
                                      fontSize: { xs: '10px', sm: '12px' },
                                      padding: {
                                        xs: '4px 8px',
                                        sm: '6px 12px',
                                      },
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedRows.includes(order._id) && (
                            <tr>
                              <td colSpan="8">
                                <OrderItemDetails
                                  order={order}
                                  formatAddress={formatAddress}
                                  formatDate={formatDate}
                                  getPaymentMethodLabel={getPaymentMethodLabel}
                                  getPaymentMethodIcon={getPaymentMethodIcon}
                                />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="py-20 text-center">
                          <div className="flex flex-col items-center opacity-40">
                            <MdShoppingBag size={80} />
                            <p className="text-xl font-bold mt-4">
                              No orders found
                            </p>
                            <Button
                              className="mt-4"
                              onClick={() => (window.location.href = '/')}
                            >
                              Go Shopping
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination?.totalPages > 1 && (
                <div className="p-4 sm:p-5 lg:p-6 bg-gray-50 border-t flex justify-center gap-2 sm:gap-4">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    sx={{
                      fontSize: { xs: '11px', sm: '13px' },
                      padding: { xs: '6px 12px', sm: '8px 16px' },
                    }}
                  >
                    Prev
                  </Button>
                  <span className="flex items-center text-[11px] sm:text-sm font-medium">
                    Page {currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    sx={{
                      fontSize: { xs: '11px', sm: '13px' },
                      padding: { xs: '6px 12px', sm: '8px 16px' },
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1000 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 lg:p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-[15px] sm:text-lg lg:text-xl font-bold">
                Order Details #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xl sm:text-2xl hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <OrderItemDetails
                order={selectedOrder}
                formatAddress={formatAddress}
                formatDate={formatDate}
                getPaymentMethodLabel={getPaymentMethodLabel}
                getPaymentMethodIcon={getPaymentMethodIcon}
              />
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel this order${
          orderToCancel ? ` #${orderToCancel._id.slice(-8).toUpperCase()}` : ''
        }?`}
        subMessage="This action will cancel your order. If payment was made, refund will be processed according to our policy."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        confirmColor="red"
      />
    </section>
  );
};

export default MyOrders;
