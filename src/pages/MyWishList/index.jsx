import React, { useState, useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import MyListItems from './myListItems';
import AccountSidebar from '../../components/AccountSidebar';
import { MyContext } from '../../App';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../../contexts/AuthContext';

const MyWishList = () => {
  const context = useContext(MyContext);
  const { user } = useAuthContext();

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

  const [userInfo, setUserInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '/default-avatar.png',
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, avatar: reader.result });
        context.openAlertBox('success', 'Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

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
      <div className="container flex gap-5">
        {/* Sidebar */}
        <div className="col1 w-[25%]">
          <AccountSidebar
            userInfo={userInfo}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        {/* Main Content */}
        <div className="col2 w-[75%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-5 px-5 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[22px] font-bold">My Wishlist</h2>
              <p className="mt-0 text-gray-600">
                There {wishlistCount === 1 ? 'is' : 'are'}{' '}
                <span className="font-bold text-primary">
                  {wishlistCount || 0}
                </span>{' '}
                {wishlistCount === 1 ? 'product' : 'products'} in your wishlist
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
              <div className="p-10 text-center">
                <img
                  src="/empty-wishlist.png"
                  alt="Empty Wishlist"
                  className="w-[200px] mx-auto mb-4 opacity-50"
                />
                <h3 className="text-[18px] font-semibold text-gray-600 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Add items you like to your wishlist. Review them anytime and
                  easily move them to cart.
                </p>
                <Button
                  className="btn-org"
                  onClick={() => (window.location.href = '/')}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyWishList;
