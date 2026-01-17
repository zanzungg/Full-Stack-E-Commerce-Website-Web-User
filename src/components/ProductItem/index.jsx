import React, { useContext } from 'react';
import '../ProductItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap, MdOutlineShoppingCart } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { MyContext } from '../../App';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const ProductItem = ({ product }) => {
  const context = useContext(MyContext);
  const { addToCart, isAdding } = useCart();
  const {
    toggleWishlist,
    useCheckWishlist,
    isAdding: isAddingToWishlist,
    isRemoving: isRemovingFromWishlist,
  } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showVariantSelector, setShowVariantSelector] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState({
    type: null,
    value: null,
  });

  // Fallback values if product is not provided
  if (!product) return null;

  const {
    _id,
    name,
    images = [],
    brand,
    price,
    oldPrice,
    rating = 0,
    discount = 0,
    productSize = [],
    productRam = [],
    productWeight = [],
  } = product;

  // Get first two images for hover effect
  const mainImage = images[0]?.url;
  const hoverImage = images[1]?.url || mainImage;

  // Check if product has variants
  const hasVariants =
    (productSize && productSize.length > 0) ||
    (productRam && productRam.length > 0) ||
    (productWeight && productWeight.length > 0);

  // Determine which variant type this product has
  const getVariantType = () => {
    if (productSize && productSize.length > 0)
      return { type: 'size', options: productSize };
    if (productRam && productRam.length > 0)
      return { type: 'ram', options: productRam };
    if (productWeight && productWeight.length > 0)
      return { type: 'weight', options: productWeight };
    return null;
  };

  const variantInfo = getVariantType();

  // Check if product is in wishlist
  const { data: isInWishlist } = useCheckWishlist(_id);

  // Handle wishlist toggle
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add products to your cart', {
        duration: 3000,
        position: 'top-right',
        icon: '🔒',
      });
      return;
    }

    if (hasVariants) {
      // Show variant selector
      setShowVariantSelector(true);
    } else {
      // Add to cart directly without variant
      addToCart({
        productId: _id,
        quantity: 1,
      });
    }
  };

  // Handle variant selection and add to cart
  const handleConfirmAddToCart = () => {
    if (!selectedVariant.value) {
      toast.error(`Please select a ${variantInfo.type}`, {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }

    addToCart({
      productId: _id,
      quantity: 1,
      selectedVariant: selectedVariant,
    });

    // Reset and close
    setShowVariantSelector(false);
    setSelectedVariant({ type: null, value: null });
  };

  // Handle close variant selector
  const handleCloseVariantSelector = () => {
    setShowVariantSelector(false);
    setSelectedVariant({ type: null, value: null });
  };

  return (
    <>
      <div className="productItem group shadow-lg rounded-md border border-[rgba(0,0,0,0.1)] relative">
        <div className="imgWrapper w-full rounded-md relative overflow-hidden">
          <Link to={`/product-details/${_id}`}>
            <div className="img h-40 sm:h-[200px] md:h-[220px] overflow-hidden relative">
              <img
                src={mainImage}
                alt={name}
                className="w-full h-full object-cover relative z-1"
              />

              <img
                src={hoverImage}
                alt={name}
                className="w-full h-full object-cover absolute transition-all duration-700 top-0 left-0 z-2
                            opacity-0 md:group-hover:opacity-100 md:group-hover:scale-105"
              />
            </div>
          </Link>
          {discount > 0 && (
            <span
              className="discount flex items-center absolute top-1.5 left-1.5 md:top-2.5 md:left-2.5
                    z-50 bg-primary text-white rounded-lg p-0.5 md:p-1 text-[10px] md:text-[12px] font-medium"
            >
              {discount}%
            </span>
          )}

          <div
            className="actions absolute right-[5px] z-50 flex items-center gap-1.5 md:gap-2
                 flex-col w-10 md:w-[50px] transition-all duration-300 md:group-hover:top-[15px] md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto
                 top-2 opacity-100 translate-y-0 pointer-events-auto md:top-0 md:opacity-0 md:translate-y-full"
          >
            <Button
              className="w-[30px]! h-[30px]! md:w-[35px]! md:h-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
              onClick={() => context.setOpenProductDetailsModal(product)}
            >
              <MdZoomOutMap className="text-[14px] md:text-[18px] text-black! group-hover:text-white hover:text-white!" />
            </Button>

            <Button
              className="w-[30px]! h-[30px]! md:w-[35px]! md:h-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group hidden md:flex!"
            >
              <IoGitCompareOutline className="text-[14px] md:text-[18px] text-black! group-hover:text-white hover:text-white!" />
            </Button>

            <Tooltip
              title={
                !isAuthenticated
                  ? 'Login to add to wishlist'
                  : isInWishlist
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
              }
              arrow
            >
              <Button
                className={`w-[30px]! h-[30px]! md:w-[35px]! md:h-[35px]! rounded-full! ${
                  isInWishlist
                    ? 'bg-red-500! text-white!'
                    : 'bg-white! text-black hover:bg-primary! hover:text-white'
                } group`}
                onClick={handleWishlistClick}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
              >
                {isAddingToWishlist || isRemovingFromWishlist ? (
                  <CircularProgress size={14} className="text-current" />
                ) : isInWishlist ? (
                  <FaHeart className="text-[14px] md:text-[18px] text-white!" />
                ) : (
                  <FaRegHeart className="text-[14px] md:text-[18px] text-black! group-hover:text-white hover:text-white!" />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="info p-2 md:p-3 py-3 md:py-5">
          <h6 className="text-[11px] md:text-[13px]">
            <Link
              to={`/product-listing?search=${brand}`}
              className="link transition-all"
            >
              {brand || 'No Brand'}
            </Link>
          </h6>
          <h3 className="text-[12px] md:text-[13px] title mt-1 font-medium mb-1 text-black line-clamp-1">
            <Link
              to={`/product-details/${_id}`}
              className="link transition-all"
            >
              {name.length > 50 ? `${name.substring(0, 50)}...` : name}
            </Link>
          </h3>

          {rating > 0 ? (
            <Rating
              name="product-rating"
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
          ) : (
            <span className="text-[10px] md:text-xs text-gray-400">
              No reviews
            </span>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            {oldPrice > 0 && (
              <span className="oldPrice line-through text-gray-500 text-[13px] md:text-[16px] font-medium">
                ${oldPrice.toFixed(2)}
              </span>
            )}
            <span className="price text-primary font-semibold text-[14px] md:text-base">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="mt-2 md:mt-3">
            <Tooltip
              title={
                !isAuthenticated
                  ? 'Login to add to cart'
                  : isAdding
                    ? 'Adding to cart...'
                    : hasVariants
                      ? 'Select variant'
                      : 'Add to cart'
              }
              arrow
            >
              <span className="w-full">
                <Button
                  className="btn-org flex gap-1 md:gap-2 w-full transition-all duration-300 text-[11px] md:text-[14px] py-1.5 md:py-2!"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  sx={{
                    '&:disabled': {
                      opacity: 0.7,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  {isAdding ? (
                    <>
                      <CircularProgress size={14} className="text-white" />
                      <span className="text-[11px] md:text-[14px]">
                        Adding...
                      </span>
                    </>
                  ) : (
                    <>
                      <MdOutlineShoppingCart className="text-[14px] md:text-[16px]" />
                      <span className="text-[11px] md:text-[14px]">
                        Add To Cart
                      </span>
                    </>
                  )}
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Variant Selector Overlay */}
      {showVariantSelector && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4"
          onClick={handleCloseVariantSelector}
          style={{ margin: 0 }}
        >
          <div
            className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute! top-2 right-2 w-8! h-8! min-w-8! rounded-full! bg-gray-100! hover:bg-gray-200!"
              onClick={handleCloseVariantSelector}
            >
              <IoCloseSharp className="text-[18px]" />
            </Button>

            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 pr-8">
              Select {variantInfo?.type}
            </h2>

            <div className="mb-4 md:mb-6 mt-2">
              <div className="flex flex-wrap gap-2">
                {variantInfo?.options.map((option, index) => (
                  <Button
                    key={index}
                    className={`${
                      selectedVariant.value === option
                        ? 'bg-primary! text-white!'
                        : 'bg-gray-100! text-black!'
                    } hover:bg-primary! hover:text-white! min-w-[60px]! text-[13px] md:text-[14px]!`}
                    onClick={() =>
                      setSelectedVariant({
                        type: variantInfo.type,
                        value: option,
                      })
                    }
                    sx={{
                      padding: { xs: '6px 16px', md: '8px 20px' },
                      textTransform: 'none',
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 md:gap-3">
              <Button
                variant="outlined"
                className="flex-1 border-gray-300! text-gray-700! hover:bg-gray-50!"
                onClick={handleCloseVariantSelector}
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '13px', md: '14px' },
                  padding: { xs: '8px 16px', md: '10px 20px' },
                }}
              >
                Cancel
              </Button>
              <Button
                className="btn-org flex-1"
                onClick={handleConfirmAddToCart}
                disabled={isAdding}
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '13px', md: '14px' },
                  padding: { xs: '8px 16px', md: '10px 20px' },
                }}
              >
                {isAdding ? (
                  <>
                    <CircularProgress size={16} className="text-white" />
                    <span className="ml-2">Adding...</span>
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductItem;
