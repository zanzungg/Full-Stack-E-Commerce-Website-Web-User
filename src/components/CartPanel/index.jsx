import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteOutline, MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const CartPanel = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, cartSummary, isLoading, removeItem } = useCart();

  const [removingItemId, setRemovingItemId] = useState(null);

  const handleRemove = async (itemId) => {
    setRemovingItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setRemovingItemId(null);
    }
  };

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <FaRegUser className="text-[80px] text-gray-300 mb-4" />
        <h3 className="text-[18px] font-semibold mb-2">Login Required</h3>
        <p className="text-gray-500 text-[14px] mb-6 text-center">
          Please login to view your shopping cart
        </p>
        <Link to="/login" className="w-full px-4">
          <Button className="btn-org w-full">Login Now</Button>
        </Link>
        <Link to="/register" className="mt-3">
          <Button variant="text" className="text-primary!">
            Create an account
          </Button>
        </Link>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <CircularProgress size={30} />
      </div>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <MdOutlineShoppingCart className="text-[80px] text-gray-300 mb-3" />
        <p className="text-gray-500 text-[14px] mb-4">Your cart is empty</p>
        <Link to="/">
          <Button className="btn-org" size="small">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* WRAPPER */}
      <div className="h-full flex flex-col">
        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-4">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            const mainImage =
              product.images?.[0]?.url || 'https://via.placeholder.com/300';
            const currentPrice = product.price || 0;
            const itemTotal = currentPrice * item.quantity;

            return (
              <div
                key={item._id}
                className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4 mb-4 last:mb-0"
              >
                {/* IMAGE */}
                <div className="w-[25%] h-[90px] overflow-hidden rounded-md">
                  <Link
                    to={`/product-details/${product._id}`}
                    className="block group h-full"
                  >
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                  </Link>
                </div>

                {/* INFO */}
                <div className="w-[75%] pr-5 relative">
                  <h4 className="text-[14px] font-medium line-clamp-2">
                    <Link
                      to={`/product-details/${product._id}`}
                      className="link transition-all"
                    >
                      {product.name}
                    </Link>
                  </h4>

                  <div className="flex items-center gap-5 mt-2">
                    <span className="text-[13px] text-gray-600">
                      Qty:{' '}
                      <span className="font-semibold text-black">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="text-primary font-bold text-[14px]">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  <Tooltip title="Remove item">
                    <IconButton
                      className="absolute! top-0 right-0"
                      size="small"
                      onClick={() => handleRemove(item._id)}
                      disabled={removingItemId === item._id}
                    >
                      {removingItemId === item._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <MdOutlineDeleteOutline className="text-[20px] link transition-all" />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER – ALWAYS VISIBLE */}
        <div className="sticky bottom-0 bg-white border-t border-[rgba(0,0,0,0.1)]">
          {/* ITEMS + SHIPPING */}
          <div className="py-3 px-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[14px] font-semibold">
                {cartSummary?.totalItems || 0} items
              </span>
              <span className="text-primary font-bold">
                ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[14px] font-semibold">Shipping</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
          </div>

          {/* TOTAL */}
          <div className="py-3 px-4 border-t flex justify-between">
            <span className="text-[15px] font-bold">Total</span>
            <span className="text-primary font-bold text-[16px]">
              ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="px-4 pb-4 flex gap-3">
            <Link to="/cart" className="w-1/2">
              <Button className="btn-org w-full text-[13px]! py-2!">
                View Cart
              </Button>
            </Link>
            <Link to="/checkout" className="w-1/2">
              <Button className="btn-org w-full text-[13px]! py-2!">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
