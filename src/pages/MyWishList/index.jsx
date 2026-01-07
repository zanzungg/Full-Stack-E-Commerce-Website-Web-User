import { useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';
import MyListItems from './myListItems';
import AccountSidebar from '../../components/AccountSidebar';
import { MyContext } from '../../App';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const MyWishList = () => {
  const context = useContext(MyContext);

  // Wishlist hook
  const {
    wishlistItems,
    wishlistCount,
    isLoading: isWishlistLoading,
    removeFromWishlist,
    isRemoving,
  } = useWishlist();

  // Cart hook
  const { addToCart, isAdding } = useCart();

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product, selectedVariant = null) => {
    // Extract product ID - handle both _id and id fields
    const productId = product?._id || product?.id;

    if (!productId) {
      toast.error('Invalid product', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    addToCart({
      productId,
      quantity: 1,
      selectedVariant: selectedVariant,
    });
  };

  return (
    <section className="section py-10 pb-10">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <div className="w-full lg:w-[25%]">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-[75%]">
            <div className="shadow-md rounded-md bg-white">
              <div className="py-5 px-5 border-b border-[rgba(0,0,0,0.1)]">
                <h2 className="text-[22px] font-bold">My Wishlist</h2>
                <p className="mt-0 text-gray-600">
                  There {wishlistCount === 1 ? 'is' : 'are'}{' '}
                  <span className="font-bold text-primary">
                    {wishlistCount || 0}
                  </span>{' '}
                  {wishlistCount === 1 ? 'product' : 'products'} in your
                  wishlist
                </p>
              </div>

              {isWishlistLoading ? (
                <div className="p-10 flex justify-center items-center">
                  <CircularProgress />
                </div>
              ) : wishlistItems && wishlistItems.length > 0 ? (
                <div className="p-3">
                  {wishlistItems.map((item) => (
                    <MyListItems
                      key={item._id || item.id}
                      item={item}
                      onRemove={() =>
                        handleRemoveItem(
                          item.productId?._id || item._id || item.id
                        )
                      }
                      onAddToCart={(selectedVariant) =>
                        handleAddToCart(item.productId || item, selectedVariant)
                      }
                      isRemoving={isRemoving}
                      isAdding={isAdding}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-8xl mb-6 animate-pulse">❤️</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-3">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Looks like you haven't added anything to your wishlist yet.
                    Explore our products and save your favorites here!
                  </p>
                  <Button
                    className="btn-org"
                    onClick={() => (window.location.href = '/')}
                  >
                    Discover Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWishList;
