import React, { useState, useContext, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { IoEyeOutline } from 'react-icons/io5';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import AccountSidebar from '../../components/AccountSidebar';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { MyContext } from '../../App';
import useOrder from '../../hooks/useOrder';

const MyOrders = () => {
  const context = useContext(MyContext);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // Use order hook
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

  // Refetch when page or filter changes
  useEffect(() => {
    refetch();
  }, [currentPage, statusFilter, refetch]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      await cancelOrder(orderToCancel._id);
      setShowCancelDialog(false);
      setOrderToCancel(null);
      context.openAlertBox('success', 'Order cancelled successfully!');
      refetch();
    } catch (error) {
      context.openAlertBox('error', 'Failed to cancel order');
    }
  };

  const getTotalItems = (products) => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  const toggleExpandRow = (orderId) => {
    setExpandedRows((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const isRowExpanded = (orderId) => {
    return expandedRows.includes(orderId);
  };

  const canCancelOrder = (orderStatus) => {
    return ['pending', 'confirmed'].includes(orderStatus);
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.address_line,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[75%]">
            <div className="card bg-white shadow-md rounded-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[22px] font-bold">My Orders</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {pagination
                      ? `Total ${pagination.total} orders found`
                      : 'Loading...'}
                  </p>
                </div>

                {/* Filter by status */}
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipping">Shipping</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold w-10"></th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Order ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Products
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Total Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Payment
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders && orders.length > 0 ? (
                          orders.map((order) => (
                            <React.Fragment key={order._id}>
                              {/* Main Row */}
                              <tr className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4">
                                  <button
                                    onClick={() => toggleExpandRow(order._id)}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                  >
                                    {isRowExpanded(order._id) ? (
                                      <FaAngleUp className="text-[18px]" />
                                    ) : (
                                      <FaAngleDown className="text-[18px]" />
                                    )}
                                  </button>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium text-primary">
                                  #{order._id.slice(-8).toUpperCase()}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">
                                  {getTotalItems(order.products)} items
                                </td>
                                <td className="px-4 py-4 text-sm font-semibold">
                                  ${order.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-gray-700">
                                      {order.paymentMethod}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                                        order.paymentStatus
                                      )}`}
                                    >
                                      {getPaymentStatusLabel(
                                        order.paymentStatus
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                                      order.orderStatus
                                    )}`}
                                  >
                                    {getOrderStatusLabel(order.orderStatus)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex gap-2">
                                    <Button
                                      className="btn-sm btn-outline flex items-center gap-1"
                                      onClick={() => handleViewOrder(order)}
                                      size="small"
                                    >
                                      <IoEyeOutline className="text-[16px]" />
                                      View
                                    </Button>
                                    {canCancelOrder(order.orderStatus) && (
                                      <Button
                                        className="btn-sm flex items-center gap-1"
                                        onClick={() => handleCancelOrder(order)}
                                        size="small"
                                        color="error"
                                        disabled={isCancelling}
                                      >
                                        <MdCancel className="text-[16px]" />
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {/* Expanded Row - Product Details */}
                              {isRowExpanded(order._id) && (
                                <tr>
                                  <td colSpan="8" className="p-0 bg-gray-50">
                                    <div className="p-4">
                                      <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded shadow-sm">
                                          <h4 className="font-semibold mb-2 text-[15px]">
                                            Shipping Address:
                                          </h4>
                                          <p className="text-sm text-gray-700">
                                            {formatAddress(
                                              order.shippingAddress
                                            )}
                                          </p>
                                          {order.shippingAddress?.mobile && (
                                            <p className="text-sm text-gray-600 mt-1">
                                              Phone:{' '}
                                              {order.shippingAddress.mobile}
                                            </p>
                                          )}
                                        </div>

                                        {order.paymentResult?.transactionId && (
                                          <div className="bg-white p-4 rounded shadow-sm">
                                            <h4 className="font-semibold mb-2 text-[15px]">
                                              Payment Details:
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                              Transaction ID:{' '}
                                              {
                                                order.paymentResult
                                                  .transactionId
                                              }
                                            </p>
                                            {order.paymentResult.gateway && (
                                              <p className="text-sm text-gray-600 mt-1">
                                                Gateway:{' '}
                                                {order.paymentResult.gateway}
                                              </p>
                                            )}
                                            {order.paymentResult.paidAt && (
                                              <p className="text-sm text-gray-600 mt-1">
                                                Paid at:{' '}
                                                {formatDate(
                                                  order.paymentResult.paidAt
                                                )}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      <h4 className="font-semibold mb-3 text-[15px]">
                                        Product Details:
                                      </h4>
                                      <table className="w-full bg-white rounded shadow-sm">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">
                                              Image
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">
                                              Product Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">
                                              Quantity
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">
                                              Price
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold">
                                              SubTotal
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order.products.map(
                                            (product, index) => (
                                              <tr
                                                key={index}
                                                className="border-b last:border-b-0 hover:bg-gray-50"
                                              >
                                                <td className="px-4 py-3">
                                                  <img
                                                    src={
                                                      product.image.url ||
                                                      '/placeholder.png'
                                                    }
                                                    alt={product.name}
                                                    className="w-[50px] h-[50px] object-cover rounded"
                                                    onError={(e) => {
                                                      e.target.src =
                                                        '/placeholder.png';
                                                    }}
                                                  />
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium">
                                                  {product.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center">
                                                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                    {product.quantity}
                                                  </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold">
                                                  ${product.price.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-primary">
                                                  ${product.subTotal.toFixed(2)}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                          <tr>
                                            <td
                                              colSpan="4"
                                              className="px-4 py-3 text-right font-semibold"
                                            >
                                              Total:
                                            </td>
                                            <td className="px-4 py-3 text-sm font-bold text-primary text-[16px]">
                                              ${order.totalAmount.toFixed(2)}
                                            </td>
                                          </tr>
                                        </tfoot>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="py-0">
                              <div className="text-center py-16">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                  No orders found
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                  {statusFilter
                                    ? `No ${statusFilter} orders available`
                                    : "You haven't placed any orders yet"}
                                </p>
                                {!statusFilter && (
                                  <Button
                                    className="btn-org"
                                    onClick={() => (window.location.href = '/')}
                                  >
                                    Start Shopping
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        size="small"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {pagination.totalPages}
                      </span>
                      <Button
                        disabled={currentPage === pagination.totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        size="small"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Order Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-primary">
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {getOrderStatusLabel(selectedOrder.orderStatus)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700">
                    {formatAddress(selectedOrder.shippingAddress)}
                  </p>
                  {selectedOrder.shippingAddress?.mobile && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Phone:</span>{' '}
                      {selectedOrder.shippingAddress.mobile}
                    </p>
                  )}
                </div>
              </div>

              {selectedOrder.paymentResult?.transactionId && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Transaction ID:</span>{' '}
                      {selectedOrder.paymentResult.transactionId}
                    </p>
                    {selectedOrder.paymentResult.gateway && (
                      <p className="text-sm">
                        <span className="font-medium">Gateway:</span>{' '}
                        {selectedOrder.paymentResult.gateway}
                      </p>
                    )}
                    {selectedOrder.paymentResult.paidAt && (
                      <p className="text-sm">
                        <span className="font-medium">Paid at:</span>{' '}
                        {formatDate(selectedOrder.paymentResult.paidAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Products</h4>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image.url || '/placeholder.png'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">
                            ${product.price.toFixed(2)} × {product.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        ${product.subTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg">Total Amount</h4>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                className="btn-outline"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              {canCancelOrder(selectedOrder.orderStatus) && (
                <Button
                  className="btn-error"
                  onClick={() => {
                    setShowModal(false);
                    handleCancelOrder(selectedOrder);
                  }}
                  disabled={isCancelling}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setOrderToCancel(null);
        }}
        onConfirm={confirmCancelOrder}
        title="Cancel Order"
        message={`Are you sure you want to cancel this order? This action cannot be undone.`}
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
      />
    </section>
  );
};

export default MyOrders;
