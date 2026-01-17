import {
  Button,
  Radio,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Alert,
  Chip,
} from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { BsFillBagCheckFill } from 'react-icons/bs';
import {
  MdAdd,
  MdEdit,
  MdLocationOn,
  MdOutlineShoppingCart,
  MdCheckCircle,
  MdWarning,
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import AddressFormDialog from '../../components/AddressFormDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useAddress } from '../../hooks/useAddress';
import { useCart } from '../../hooks/useCart';
import { useOrder } from '../../hooks/useOrder';
import { usePayment } from '../../hooks/usePayment';
import { MyContext } from '../../App';
import { usdToVnPayAmount } from '../../utils/currency.js';

const Checkout = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Address management
  const {
    activeAddresses,
    selectedAddress,
    loading: addressLoading,
    createAddress,
    updateAddress,
    selectAddress,
    refetch: refetchAddresses,
  } = useAddress({
    onSuccess: (message) => context.openAlertBox('success', message),
    onError: (message) => context.openAlertBox('error', message),
    autoFetch: true,
  });

  // Cart management
  const { cartItems, cartSummary, isLoading: cartLoading } = useCart();

  // Order management
  const { createOrderAsync, isCreating } = useOrder({
    onSuccess: () => {
      // Toast is already handled in the hook
    },
    onError: (message) => {
      // Show alert for critical errors
      context.openAlertBox('error', message);
    },
  });

  // Payment management
  const {
    paymentMethods,
    selectedPaymentMethod,
    selectPaymentMethod,
    processPayment,
    isProcessing,
  } = usePayment({
    onSuccess: () => {
      // Toast is already handled in the hook
    },
    onError: (message) => {
      // Show alert for payment errors
      context.openAlertBox('error', message);
    },
  });

  // UI State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  /**
   * Validate checkout requirements
   */
  const validateCheckout = () => {
    const errors = [];

    if (!cartItems || cartItems.length === 0) {
      errors.push('Your cart is empty');
    }

    if (activeAddresses.length === 0) {
      errors.push('Please add a delivery address');
    }

    if (!selectedAddress) {
      errors.push('Please select a delivery address');
    }

    if (!selectedPaymentMethod) {
      errors.push('Please select a payment method');
    }

    // Check stock availability
    cartItems?.forEach((item) => {
      const product = item.productId;
      if (product && product.stock < item.quantity) {
        errors.push(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`
        );
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  /**
   * Re-validate when dependencies change
   */
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      validateCheckout();
    }
  }, [selectedAddress, selectedPaymentMethod, cartItems]);

  /**
   * Address dialog handlers
   */
  const handleOpenAddDialog = () => {
    setEditingAddress(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (address) => {
    setEditingAddress(address);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, addressData);
      } else {
        const newAddress = await createAddress(addressData);
        // Auto-select newly created address if it's the first one
        if (activeAddresses.length === 0 && newAddress) {
          await selectAddress(newAddress._id);
        }
      }
      handleCloseDialog();
      await refetchAddresses();
    } catch (error) {
      // Errors are handled in hook callbacks
    }
  };

  const handleSelectAddress = async (addressId) => {
    try {
      await selectAddress(addressId);
    } catch (error) {
      // Errors are handled in hook callbacks
    }
  };

  /**
   * Main checkout handler
   */
  const handleCheckout = async () => {
    // Validate before proceeding
    if (!validateCheckout()) {
      context.openAlertBox(
        'error',
        validationErrors[0] || 'Please complete all required fields'
      );
      return;
    }

    setIsCheckingOut(true);

    try {
      // Prepare products data from cart
      const products = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        ...(item.selectedVariant && { selectedVariant: item.selectedVariant }),
      }));

      // Create order
      const orderData = {
        products,
        shippingAddressId: selectedAddress._id,
        paymentMethod: selectedPaymentMethod,
      };

      const createdOrder = await createOrderAsync(orderData);

      if (!createdOrder || !createdOrder._id) {
        throw new Error('Failed to create order - Invalid response');
      }

      // Handle payment by method
      if (selectedPaymentMethod === 'COD') {
        // COD: Backend already handles stock deduction and cart clearing
        queryClient.invalidateQueries({ queryKey: ['cart'] });

        // Redirect to success page
        setTimeout(
          () =>
            navigate(`/payment/success?orderId=${createdOrder._id}`, {
              replace: true,
            }),
          1000
        );

        setIsCheckingOut(false);
        return;
      } else if (selectedPaymentMethod === 'VNPAY') {
        try {
          const vnpAmount = usdToVnPayAmount(createdOrder.totalAmount);

          await processPayment(createdOrder._id, vnpAmount, 'VNPAY', {
            orderInfo: `Thanh toan don hang ${createdOrder._id.slice(-8)}`,
            locale: 'vn',
          });

          // Note: User will be redirected to VNPay gateway
          // After payment, VNPay will call IPN to update order and clear cart
        } catch (paymentError) {
          setIsCheckingOut(false);

          context.openAlertBox(
            'error',
            'Unable to generate payment link. The order has been created and can be paid later in "My Orders".'
          );

          // Redirect to My Orders with highlight on this order
          setTimeout(() => {
            navigate(`/my-orders?highlight=${createdOrder._id}`);
          }, 2000);
        }
      } else if (selectedPaymentMethod === 'MOMO') {
        context.openAlertBox(
          'info',
          'MoMo payment will be available soon. Please use another method.'
        );
        setIsCheckingOut(false);
      } else if (selectedPaymentMethod === 'STRIPE') {
        context.openAlertBox(
          'info',
          'Credit card payment will be available soon. Please use another method.'
        );
        setIsCheckingOut(false);
      }
    } catch (error) {
      setIsCheckingOut(false);
    }
  };

  /**
   * Calculate delivery date (example: 3-5 days from now)
   */
  const estimatedDelivery = () => {
    const minDays = 3;
    const maxDays = 5;
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(minDate.getDate() + minDays);
    maxDate.setDate(maxDate.getDate() + maxDays);

    return `${minDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${maxDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  const isLoading = addressLoading || cartLoading;
  const canCheckout =
    !isLoading &&
    !isCheckingOut &&
    !isCreating &&
    !isProcessing &&
    cartItems?.length > 0 &&
    selectedAddress &&
    validationErrors.length === 0;

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="container">
        {/* Validation Errors Alert */}
        {validationErrors.length > 0 && (
          <Alert
            severity="warning"
            icon={<MdWarning />}
            className="mb-5"
            onClose={() => setValidationErrors([])}
          >
            <div className="font-medium mb-1">
              Please complete the following:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Column - Address & Payment */}
          <div className="leftCol w-full lg:w-[70%] space-y-5">
            {/* Delivery Address Section */}
            <div className="card bg-white shadow-md p-5 rounded-md w-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h1 className="text-[16px] font-semibold uppercase">
                    Select Delivery Address
                  </h1>
                  {selectedAddress && (
                    <Chip
                      icon={<MdCheckCircle />}
                      label="Selected"
                      size="small"
                      color="success"
                      className="ml-2"
                    />
                  )}
                </div>
                <Button
                  className="btn-org flex items-center gap-2"
                  onClick={handleOpenAddDialog}
                  size="small"
                >
                  <MdAdd className="text-[18px]" />
                  Add New
                </Button>
              </div>

              {addressLoading && activeAddresses.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <CircularProgress size={40} />
                </div>
              ) : activeAddresses.length === 0 ? (
                <div className="text-center py-10">
                  <MdLocationOn className="text-[60px] text-gray-300 mx-auto mb-3" />
                  <h3 className="text-[16px] font-semibold text-gray-600 mb-2">
                    No Delivery Address Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Please add a delivery address to continue
                  </p>
                  <Button className="btn-org" onClick={handleOpenAddDialog}>
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {activeAddresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress?._id === address._id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleSelectAddress(address._id)}
                    >
                      <div className="flex items-start gap-3">
                        <Radio
                          checked={selectedAddress?._id === address._id}
                          onChange={() => handleSelectAddress(address._id)}
                          className="mt-1"
                          color="primary"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {address.addressType && (
                                <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-2 font-medium">
                                  {address.addressType.toUpperCase()}
                                </span>
                              )}
                              <p className="font-semibold text-gray-800 mb-1">
                                {address.address_line}
                              </p>
                              {address.landmark && (
                                <p className="text-sm text-gray-500 italic mb-1">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.country} - {address.pincode}
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Phone:</span>{' '}
                                {address.mobile}
                              </p>
                            </div>

                            <Button
                              size="small"
                              className="text-xs! text-blue-600! hover:bg-blue-100!"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditDialog(address);
                              }}
                            >
                              <MdEdit className="mr-1" /> Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="card bg-white shadow-md p-5 rounded-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h2 className="text-[16px] font-semibold uppercase">
                  Payment Method
                </h2>
                {selectedPaymentMethod && (
                  <Chip
                    icon={<MdCheckCircle />}
                    label="Selected"
                    size="small"
                    color="success"
                    className="ml-2"
                  />
                )}
              </div>

              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(e) => selectPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.code}
                    className={`border-2 rounded-lg p-4 mb-3 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.code
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <FormControlLabel
                      value={method.code}
                      control={<Radio color="primary" />}
                      label={
                        <div className="flex items-center gap-3 ml-2">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h4 className="text-[15px] font-semibold">
                              {method.name}
                            </h4>
                            <p className="text-[13px] text-gray-600">
                              {method.description}
                            </p>
                            {method.code === 'VNPAY' && (
                              <p className="text-[11px] text-blue-600 mt-1">
                                Secure payment via VNPay gateway
                              </p>
                            )}
                            {(method.code === 'MOMO' ||
                              method.code === 'STRIPE') && (
                              <p className="text-[11px] text-orange-600 mt-1">
                                Coming soon
                              </p>
                            )}
                          </div>
                        </div>
                      }
                      className="w-full m-0"
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="rightCol w-full lg:w-[30%]">
            <div className="card bg-white shadow-md p-5 rounded-md sticky top-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h2 className="text-[16px] font-semibold uppercase">
                  Order Summary
                </h2>
              </div>

              {cartLoading ? (
                <div className="flex items-center justify-center py-10">
                  <CircularProgress size={30} />
                </div>
              ) : !cartItems || cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <MdOutlineShoppingCart className="text-[60px] text-gray-300 mx-auto mb-3" />
                  <h3 className="text-[16px] font-semibold text-gray-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Add some products to checkout
                  </p>
                  <Link to="/">
                    <Button className="btn-org">Continue Shopping</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                    <span className="text-[14px] font-semibold">Product</span>
                    <span className="text-[14px] font-semibold">Subtotal</span>
                  </div>

                  <div className="scroll max-h-[250px] overflow-y-auto overflow-x-hidden my-4 pr-2">
                    {cartItems.map((item) => {
                      const product = item.productId;
                      if (!product) return null;

                      const mainImage = product.images?.[0]?.url;
                      const currentPrice = product.price;
                      const itemTotal = currentPrice * item.quantity;

                      return (
                        <div
                          key={item._id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="part1 flex items-center gap-3 flex-1 min-w-0">
                            <Link
                              to={`/product-details/${product._id}`}
                              className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group shrink-0"
                            >
                              <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all group-hover:scale-105"
                              />
                            </Link>
                            <div className="info flex-1 min-w-0">
                              <Link
                                to={`/product-details/${product._id}`}
                                className="text-[14px] font-medium link line-clamp-2"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[13px] text-gray-600">
                                  Qty: {item.quantity}
                                </span>
                                {item.selectedVariant?.value && (
                                  <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                                    {item.selectedVariant.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[14px] font-medium text-primary shrink-0 ml-2">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[rgba(0,0,0,0.1)] pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium">Subtotal</span>
                      <span className="text-[15px] font-semibold">
                        ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium">Shipping</span>
                      <span className="text-[15px] font-semibold text-green-600">
                        Free
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium">
                        Total Items
                      </span>
                      <span className="text-[15px] font-semibold">
                        {cartSummary?.totalQuantity || 0}
                      </span>
                    </div>

                    {selectedAddress && (
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-medium">
                          Est. Delivery
                        </span>
                        <span className="text-[13px] text-blue-600 font-medium">
                          {estimatedDelivery()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 mb-4 border-t border-[rgba(0,0,0,0.1)]">
                      <span className="text-[16px] font-bold">Total</span>
                      <span className="text-[18px] font-bold text-primary">
                        ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="btn-org btn-lg w-full flex gap-2 items-center justify-center"
                    onClick={handleCheckout}
                    disabled={!canCheckout}
                  >
                    {isCheckingOut || isCreating || isProcessing ? (
                      <>
                        <CircularProgress size={20} className="text-white" />
                        <span>
                          {isCreating
                            ? 'Creating Order...'
                            : isProcessing
                            ? 'Processing...'
                            : 'Please Wait...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <BsFillBagCheckFill className="text-[20px]" />
                        Place Order
                      </>
                    )}
                  </Button>

                  {!canCheckout && (
                    <p className="text-xs text-center text-gray-500 mt-3">
                      Complete all steps above to place your order
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />
    </section>
  );
};

export default Checkout;
