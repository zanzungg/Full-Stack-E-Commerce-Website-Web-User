import { Button, CircularProgress } from '@mui/material';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { Link } from 'react-router-dom';
import CartItems from './cartItems';
import { useCart } from '../../hooks/useCart.jsx';

const CartPage = () => {
  const { cartItems, cartSummary, isLoading, error, stockAlerts } = useCart();

  // Loading state
  if (isLoading) {
    return (
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%]">
          <div className="flex items-center justify-center py-20">
            <CircularProgress />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%]">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load cart items</p>
              <Button
                className="btn-org"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <section className="section py-10 pb-10">
        <div className="container w-[80%] max-w-[80%]">
          <div className="flex flex-col items-center justify-center py-20">
            <MdOutlineShoppingCart className="text-[120px] text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Add some products to get started
            </p>
            <Link to="/">
              <Button className="btn-org">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section py-10 pb-10">
      <div className="container w-[80%] max-w-[80%] flex gap-5">
        <div className="leftPart w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-2 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="font-semibold">Your Cart</h2>
              <p className="mt-0">
                There are{' '}
                <span className="font-bold text-primary">
                  {cartSummary?.totalItems || 0}
                </span>{' '}
                {cartSummary?.totalItems === 1 ? 'product' : 'products'} in your
                cart
              </p>
            </div>

            {/* Stock Alerts */}
            {stockAlerts && stockAlerts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-3">
                <div className="flex">
                  <div className="shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Stock Alert:</strong> Some items have limited
                      availability
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            {cartItems.map((item) => (
              <CartItems key={item._id} item={item} />
            ))}
          </div>
        </div>

        <div className="rightPart w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5 sticky top-5">
            <h3 className="pb-3">Cart Totals</h3>
            <hr className="border-[rgba(0,0,0,0.1)]" />

            <p className="flex items-center justify-between mt-3">
              <span className="text-[14px] font-medium">Subtotal</span>
              <span className="text-primary font-bold">
                ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
              </span>
            </p>

            <p className="flex items-center justify-between mt-3">
              <span className="text-[14px] font-medium">Shipping</span>
              <span className="font-bold">Free</span>
            </p>

            <p className="flex items-center justify-between mt-3">
              <span className="text-[14px] font-medium">Total Items</span>
              <span className="font-bold">
                {cartSummary?.totalQuantity || 0}
              </span>
            </p>

            <hr className="border-[rgba(0,0,0,0.1)] my-3" />

            <p className="flex items-center justify-between mt-3">
              <span className="text-[16px] font-semibold">Total</span>
              <span className="text-primary font-bold text-[18px]">
                ${cartSummary?.subtotal?.toFixed(2) || '0.00'}
              </span>
            </p>

            <br />

            <div className="flex flex-col gap-2">
              <Link to="/checkout">
                <Button className="btn-org btn-lg w-full flex gap-2 text-[20px]">
                  <BsFillBagCheckFill /> Checkout
                </Button>
              </Link>

              <Link to="/">
                <Button
                  variant="outlined"
                  className="w-full border-primary! text-primary! hover:bg-primary! hover:text-white!"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
