import { useState } from 'react';
import QtyBox from '../../components/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const ProductDetailsComponent = ({ product }) => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({
    type: null,
    value: null,
  });
  const { addToCart, isAdding } = useCart();
  const {
    toggleWishlist,
    useCheckWishlist,
    isAdding: isAddingToWishlist,
    isRemoving: isRemovingFromWishlist,
  } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Extract product data with fallbacks - do this BEFORE early return
  const {
    _id = null,
    name = '',
    brand = '',
    rating = 0,
    price = 0,
    oldPrice = 0,
    countInStock = 0,
    description = '',
    productSize = [],
    productRam = [],
    productWeight = [],
    reviews = [],
  } = product || {};

  // Call useCheckWishlist BEFORE any conditional returns
  const { data: isInWishlist } = useCheckWishlist(_id);

  // NOW safe to do early return after all hooks are called
  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">No product data available</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add products to your cart', {
        duration: 3000,
        position: 'top-right',
        icon: '🔒',
      });
      return;
    }

    if (countInStock === 0) return;

    // Check if product has variants and user hasn't selected one
    const hasVariants =
      (productSize && productSize.length > 0) ||
      (productRam && productRam.length > 0) ||
      (productWeight && productWeight.length > 0);

    if (hasVariants && !selectedVariant.value) {
      toast.error('Please select a variant (Size/RAM/Weight)', {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }

    addToCart({
      productId: _id,
      quantity: quantity,
      selectedVariant: selectedVariant.value ? selectedVariant : undefined,
    });
  };

  const isOutOfStock = countInStock === 0;
  const maxQuantity = Math.min(countInStock, 100);

  // Handle wishlist toggle
  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add products to your wishlist', {
        duration: 3000,
        position: 'top-right',
        icon: '🔒',
      });
      return;
    }

    toggleWishlist(_id);
  };

  return (
    <>
      <h1 className="text-[18px] md:text-[24px] font-semibold mb-2">{name}</h1>
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {brand && (
          <span className="text-gray-400 text-[11px] md:text-[13px]">
            Brands :
            <span className="font-medium text-black opacity-75">{brand}</span>
          </span>
        )}

        <Rating
          name="size-small"
          value={rating}
          size="small"
          readOnly
          precision={0.5}
          sx={{
            '& .MuiRating-icon': {
              fontSize: { xs: '0.9rem', md: '1.25rem' },
            },
          }}
        />
        <span className="text-[11px] md:text-[13px] cursor-pointer">
          Review ({reviews.length || 0})
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3 md:mt-4">
        {oldPrice > 0 && (
          <span className="oldPrice line-through text-gray-500 text-[16px] md:text-[20px] font-medium">
            ${oldPrice.toFixed(2)}
          </span>
        )}
        <span className="price text-primary font-semibold text-[18px] md:text-[20px]">
          ${price.toFixed(2)}
        </span>
        <span className="text-[12px] md:text-[14px]">
          Available In Stock:{' '}
          <span
            className={`text-[12px] md:text-[14px] font-bold ${
              countInStock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {countInStock > 0 ? `${countInStock} Items` : 'Out of Stock'}
          </span>
        </span>
      </div>

      <p className="mt-3 pr-0 md:pr-10 mb-3 md:mb-5 whitespace-pre-line text-sm md:text-base">
        {description || 'No description available.'}
      </p>

      {productRam && productRam.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <span className="text-[14px] md:text-[16px]">RAM: </span>
          <div className="flex flex-wrap items-center gap-1 actions">
            {productRam.map((ram, index) => (
              <Button
                key={index}
                className={`text-[12px] md:text-[14px]! min-w-[50px] md:min-w-[60px]! ${
                  selectedVariant.type === 'ram' &&
                  selectedVariant.value === ram
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => {
                  setSelectedVariant({ type: 'ram', value: ram });
                  setProductActionIndex(`ram-${index}`);
                }}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>
      )}

      {productSize && productSize.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <span className="text-[14px] md:text-[16px]">Size: </span>
          <div className="flex flex-wrap items-center gap-1 actions">
            {productSize.map((s, index) => (
              <Button
                key={index}
                className={`text-[12px] md:text-[14px]! min-w-[50px] md:min-w-[60px]! ${
                  selectedVariant.type === 'size' && selectedVariant.value === s
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => {
                  setSelectedVariant({ type: 'size', value: s });
                  setProductActionIndex(`size-${index}`);
                }}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {productWeight && productWeight.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-[14px] md:text-[16px]">Weight: </span>
          <div className="flex flex-wrap items-center gap-1 actions">
            {productWeight.map((weight, index) => (
              <Button
                key={index}
                className={`text-[12px] md:text-[14px]! min-w-[50px] md:min-w-[60px]! ${
                  selectedVariant.type === 'weight' &&
                  selectedVariant.value === weight
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => {
                  setSelectedVariant({ type: 'weight', value: weight });
                  setProductActionIndex(`weight-${index}`);
                }}
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[12px] md:text-[14px] mt-4 md:mt-5 mb-2">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 py-3 md:py-4">
        <div className="qtyBoxWrapper w-[60px] md:w-[70px]">
          <QtyBox
            quantity={quantity}
            onChange={setQuantity}
            max={maxQuantity}
          />
        </div>

        <Tooltip
          title={
            !isAuthenticated
              ? 'Login to add to cart'
              : isOutOfStock
                ? 'Out of stock'
                : isAdding
                  ? 'Adding to cart...'
                  : (productSize?.length ||
                        productRam?.length ||
                        productWeight?.length) &&
                      !selectedVariant.value
                    ? 'Please select a variant'
                    : 'Add to cart'
          }
          arrow
          placement="top"
        >
          <span>
            <Button
              className="btn-org flex gap-1.5 md:gap-2 text-[12px] md:text-[14px]!"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
            >
              {isAdding ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  <span className="hidden md:inline">Adding...</span>
                </>
              ) : (
                <>
                  <MdOutlineShoppingCart className="text-[18px] md:text-[22px]" />
                  Add To Cart
                </>
              )}
            </Button>
          </span>
        </Tooltip>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 md:mt-4">
        <Tooltip
          title={
            !isAuthenticated
              ? 'Login to add to wishlist'
              : isInWishlist
                ? 'Remove from wishlist'
                : 'Add to wishlist'
          }
          placement="top"
          arrow
        >
          <span
            className={`flex items-center gap-1.5 md:gap-2 text-[13px] md:text-[15px] cursor-pointer font-medium transition-colors ${
              isInWishlist
                ? 'text-red-500 hover:text-red-600'
                : 'link hover:text-primary'
            } ${
              isAddingToWishlist || isRemovingFromWishlist
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleWishlistClick}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <>
                <CircularProgress size={16} className="text-current" />
                <span className="hidden md:inline">
                  {isInWishlist ? 'Removing...' : 'Adding...'}
                </span>
              </>
            ) : (
              <>
                {isInWishlist ? (
                  <FaHeart className="text-[16px] md:text-[18px]" />
                ) : (
                  <FaRegHeart className="text-[16px] md:text-[18px]" />
                )}
                <span className="hidden sm:inline">
                  {isInWishlist ? 'Remove from Wishlist' : 'Add To Wishlist'}
                </span>
                <span className="sm:hidden">
                  {isInWishlist ? 'Remove' : 'Wishlist'}
                </span>
              </>
            )}
          </span>
        </Tooltip>
        <span className="flex items-center gap-1.5 md:gap-2 text-[13px] md:text-[15px] link cursor-pointer font-medium">
          <IoGitCompareOutline className="text-[16px] md:text-[18px]" />
          <span className="hidden sm:inline">Add To Compare</span>
          <span className="sm:hidden">Compare</span>
        </span>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
