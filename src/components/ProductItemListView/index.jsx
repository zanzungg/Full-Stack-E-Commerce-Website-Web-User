import { useContext, useState } from 'react';
import '../ProductItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { MyContext } from '../../App';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const ProductItemListView = ({ product }) => {
  const context = useContext(MyContext);
  const { addToCart, isAdding } = useCart();
  const {
    toggleWishlist,
    useCheckWishlist,
    isAdding: isAddingToWishlist,
    isRemoving: isRemovingFromWishlist,
  } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({
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
    description,
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
      <div className="productItem shadow-lg rounded-md border border-[rgba(0,0,0,0.1)] flex items-center relative">
        <div className="group imgWrapper w-[25%] rounded-md relative">
          <Link to={`/product/${_id}`}>
            <div className="img aspect-4/5 overflow-hidden relative">
              <img
                src={mainImage}
                alt={name}
                className="w-full h-full object-cover"
              />

              <img
                src={hoverImage}
                alt={name}
                className="w-full h-full object-cover absolute transition-all duration-700 top-0 left-0 
                            opacity-0 group-hover:opacity-100 group-hover:scale-105"
              />
            </div>
          </Link>
          {discount > 0 && (
            <span
              className="discount flex items-center absolute top-2.5 left-2.5
                        z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-medium"
            >
              {discount}%
            </span>
          )}

          <div
            className="actions absolute top-[-200px] right-[5px] z-50 flex items-center gap-2
                 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100"
          >
            <Button
              className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
              onClick={() => context.setOpenProductDetailsModal(product)}
            >
              <MdZoomOutMap className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
            </Button>

            <Button
              className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
            >
              <IoGitCompareOutline className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
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
                className={`w-[35px]! h-[35px]! min-[35px]! rounded-full! ${
                  isInWishlist
                    ? 'bg-red-500! text-white!'
                    : 'bg-white! text-black hover:bg-primary! hover:text-white'
                } group`}
                onClick={handleWishlistClick}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
              >
                {isAddingToWishlist || isRemovingFromWishlist ? (
                  <CircularProgress size={16} className="text-current" />
                ) : isInWishlist ? (
                  <FaHeart className="text-[18px] text-white!" />
                ) : (
                  <FaRegHeart className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="info p-3 py-5 px-8 w-[75%]">
          {brand && (
            <h6 className="text-[15px]">
              <Link
                to={`/products?search=${brand}`}
                className="link transition-all"
              >
                {brand}
              </Link>
            </h6>
          )}
          <h3 className="text-[18px] title mt-5 font-medium mb-3 text-black">
            <Link to={`/product/${_id}`} className="link transition-all">
              {name}
            </Link>
          </h3>

          <p className="text-[14px] mb-3 line-clamp-3">
            {description || 'No description available'}
          </p>

          {rating > 0 ? (
            <Rating name="size-small" value={rating} size="small" readOnly />
          ) : (
            <span className="text-xs text-gray-400">No reviews</span>
          )}

          <div className="flex items-center mt-3 gap-4">
            {oldPrice && oldPrice > price && (
              <span className="oldPrice line-through text-gray-500 text-[16px] font-medium">
                ${oldPrice.toFixed(2)}
              </span>
            )}
            <span className="price text-primary font-semibold">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="mt-4">
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
              <span>
                <Button
                  className="btn-org flex gap-2 transition-all duration-300"
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
                      <CircularProgress size={18} className="text-white" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineShoppingCart className="text-[20px]" />
                      <span>Add To Cart</span>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center"
          onClick={handleCloseVariantSelector}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-[90%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute! top-2 right-2 w-8! h-8! min-w-8! rounded-full! bg-gray-100!"
              onClick={handleCloseVariantSelector}
            >
              <IoCloseSharp className="text-[18px]" />
            </Button>

            <h2 className="text-lg font-semibold mb-4">
              Select {variantInfo?.type}
            </h2>

            <div className="mb-6 mt-2">
              <div className="flex flex-wrap gap-2">
                {variantInfo?.options.map((option, index) => (
                  <Button
                    key={index}
                    className={`${
                      selectedVariant.value === option
                        ? 'bg-primary! text-white!'
                        : 'bg-gray-100! text-black!'
                    } hover:bg-primary! hover:text-white!`}
                    onClick={() =>
                      setSelectedVariant({
                        type: variantInfo.type,
                        value: option,
                      })
                    }
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outlined"
                className="flex-1 border-gray-300! text-gray-700!"
                onClick={handleCloseVariantSelector}
              >
                Cancel
              </Button>
              <Button
                className="btn-org flex-1"
                onClick={handleConfirmAddToCart}
                disabled={isAdding}
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

export default ProductItemListView;
