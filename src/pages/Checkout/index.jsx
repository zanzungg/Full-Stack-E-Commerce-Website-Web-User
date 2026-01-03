import { Button, TextField, Radio, CircularProgress } from '@mui/material';
import React, { useState, useContext } from 'react';
import { BsFillBagCheckFill } from 'react-icons/bs';
import {
  MdAdd,
  MdEdit,
  MdLocationOn,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAddress } from '../../hooks/useAddress';
import { useCart } from '../../hooks/useCart';
import { MyContext } from '../../App';
import AddressFormDialog from '../../components/AddressFormDialog';

const Checkout = () => {
  const context = useContext(MyContext);

  // Address management
  const {
    activeAddresses,
    selectedAddress,
    loading,
    createAddress,
    updateAddress,
    selectAddress,
  } = useAddress({
    onSuccess: (message) => context.openAlertBox('success', message),
    onError: (message) => context.openAlertBox('error', message),
    autoFetch: true,
  });

  // Cart management
  const { cartItems, cartSummary, isLoading: cartLoading } = useCart();

  // UI State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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
    if (editingAddress) {
      await updateAddress(editingAddress._id, addressData);
    } else {
      await createAddress(addressData);
    }
    handleCloseDialog();
  };

  const handleSelectAddress = async (addressId) => {
    await selectAddress(addressId);
  };

  const handleCheckout = () => {
    if (!selectedAddress && activeAddresses.length === 0) {
      context.openAlertBox('error', 'Please add a delivery address');
      return;
    }
    if (!selectedAddress) {
      context.openAlertBox('error', 'Please select a delivery address');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      context.openAlertBox('error', 'Your cart is empty');
      return;
    }
    // TODO: Implement checkout logic
    context.openAlertBox('success', 'Proceeding to payment...');
  };

  return (
    <section className="py-10">
      <div className="container flex gap-5">
        <div className="leftCol w-[70%]">
          <div className="card bg-white shadow-md p-5 rounded-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-[16px] font-semibold uppercase">
                Select Delivery Address
              </h1>
              <Button
                className="btn-org flex items-center gap-2"
                onClick={handleOpenAddDialog}
                size="small"
              >
                <MdAdd className="text-[18px]" />
                Add New Address
              </Button>
            </div>

            {loading && activeAddresses.length === 0 ? (
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
                  Add Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAddresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      address.selected || selectedAddress?._id === address._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectAddress(address._id)}
                  >
                    <div className="flex items-start gap-3">
                      <Radio
                        checked={
                          address.selected ||
                          selectedAddress?._id === address._id
                        }
                        onChange={() => handleSelectAddress(address._id)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {address.addressType && (
                              <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-2">
                                {address.addressType}
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
        </div>

        <div className="rightCol w-[30%]">
          <div className="card bg-white shadow-md p-5 rounded-md sticky top-5">
            <h2 className="text-[16px] font-semibold uppercase mb-4">
              Your Order
            </h2>

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

                <div className="scroll max-h-[250px] overflow-y-scroll overflow-x-hidden my-4">
                  {cartItems.map((item) => {
                    const product = item.productId;
                    if (!product) return null;

                    const mainImage =
                      product.images?.[0]?.url ||
                      'https://via.placeholder.com/300';
                    const currentPrice = product.price || 0;
                    const itemTotal = currentPrice * item.quantity;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="part1 flex items-center gap-3 flex-1 min-w-0">
                          <Link
                            to={`/product/${product._id}`}
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
                              to={`/product/${product._id}`}
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
                    <span className="text-[14px] font-medium">Total Items</span>
                    <span className="text-[15px] font-semibold">
                      {cartSummary?.totalQuantity || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mb-4 border-t border-[rgba(0,0,0,0.1)]">
                    <span className="text-[16px] font-bold">Total</span>
                    <span className="text-[18px] font-bold text-primary">
                      ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                <Button
                  className="btn-org btn-lg w-full flex gap-2 items-center"
                  onClick={handleCheckout}
                >
                  <BsFillBagCheckFill className="text-[20px]" />
                  Place Order
                </Button>
              </>
            )}
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
