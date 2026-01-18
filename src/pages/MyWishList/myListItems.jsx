import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { toast } from 'react-hot-toast';

const MyListItems = ({ item, onRemove, onAddToCart, isRemoving, isAdding }) => {
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({
    type: null,
    value: null,
  });

  // Extract product data from response structure
  const product = item.productId || item;

  // Extract các trường từ item level (ưu tiên) hoặc productId level
  const productId = product?._id || item?._id || item?.id;
  const productName = item?.productTitle || product?.name || 'Unnamed Product';
  const productBrand = item?.brand || product?.brand || 'Unknown Brand';
  const productRating = item?.rating || product?.rating || 0;
  const productPrice = item?.price || product?.price || 0;
  const productOldPrice = item?.oldPrice || product?.oldPrice || productPrice;
  const productDiscount = item?.discount || product?.discount || 0;

  // Extract variant options - check both item level and productId level
  const productSize = item?.productSize || product?.productSize || [];
  const productRam = item?.productRam || product?.productRam || [];
  const productWeight = item?.productWeight || product?.productWeight || [];

  // Image từ item level hoặc productId level
  const productImage =
    item?.productImage ||
    (product?.images && product.images[0]?.url) ||
    product?.image ||
    '/placeholder.jpg';

  // Calculate discount percentage nếu không có sẵn
  const discountPercentage =
    productDiscount ||
    (productOldPrice > productPrice
      ? Math.round(((productOldPrice - productPrice) / productOldPrice) * 100)
      : 0);

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

  // Handle add to cart button click
  const handleAddToCartClick = () => {
    if (hasVariants) {
      // Show variant selector
      setShowVariantSelector(true);
    } else {
      // Add to cart directly without variant - pass null explicitly
      onAddToCart(null);
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

    // Call onAddToCart with valid variant info
    if (onAddToCart) {
      // Only pass selectedVariant if it has valid type and value
      const validVariant =
        selectedVariant.type && selectedVariant.value ? selectedVariant : null;
      onAddToCart(validVariant);
    }

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
      <div className="cartItem w-full p-2.5 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 md:gap-4 pb-3 sm:pb-4 md:pb-5 border-b border-[rgba(0,0,0,0.1)] last:border-b-0 relative">
        {/* Remove Button - góc phải trên cùng */}
        <Tooltip title="Remove from wishlist">
          <IconButton
            className="absolute! top-2.5 right-2.5 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 bg-white! shadow-sm! hover:bg-red-50!"
            onClick={onRemove}
            disabled={isRemoving}
            size="small"
          >
            {isRemoving ? (
              <CircularProgress size={16} />
            ) : (
              <IoCloseSharp className="text-[18px] sm:text-[20px] md:text-[22px] text-red-500 hover:text-red-700 transition-all" />
            )}
          </IconButton>
        </Tooltip>

        {/* Product Image */}
        <div className="img w-full sm:w-[30%] md:w-[20%] lg:w-[15%] rounded-md overflow-hidden shrink-0">
          <Link to={`/product-details/${productId}`} className="group">
            <img
              src={productImage}
              className="w-full group-hover:scale-105 transition-all"
              alt={productName}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="info w-full sm:w-[70%] md:w-[80%] lg:w-[85%] relative pr-8 sm:pr-0">
          {/* Brand */}
          <span className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-600 block mb-0.5 sm:mb-1">
            {productBrand}
          </span>

          {/* Product Name */}
          <h3 className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-semibold mb-1.5 sm:mb-2">
            <Link
              to={`/product-details/${productId}`}
              className="link hover:text-primary transition-colors line-clamp-2"
            >
              {productName}
            </Link>
          </h3>

          {/* Rating */}
          {productRating > 0 ? (
            <Rating
              name="size-small"
              value={productRating}
              size="small"
              readOnly
              precision={0.5}
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
            />
          ) : (
            <span className="text-[10px] sm:text-xs text-gray-400">
              No reviews
            </span>
          )}

          {/* Price Section */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 mb-2 sm:mb-3 md:mb-4">
            <span className="price text-black font-semibold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]">
              ${productPrice.toFixed(2)}
            </span>

            {productOldPrice > productPrice && (
              <>
                <span className="oldPrice line-through text-gray-500 text-[11px] sm:text-[12px] md:text-[14px] font-medium">
                  ${productOldPrice.toFixed(2)}
                </span>
                <span className="discount text-primary font-semibold text-[10px] sm:text-[11px] md:text-[13px] bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="btn-org btn-sm text-[11px] sm:text-[12px] md:text-[13px] px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2"
            onClick={handleAddToCartClick}
            disabled={isAdding || isRemoving}
            variant="contained"
            size="small"
          >
            {isAdding ? (
              <>
                <CircularProgress
                  size={14}
                  className="mr-1.5 sm:mr-2"
                  color="inherit"
                />
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>

      {/* Variant Selector Overlay */}
      {showVariantSelector && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-9999 flex items-center justify-center"
          onClick={handleCloseVariantSelector}
        >
          <div
            className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-[90%] sm:w-[95%] relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute! top-1.5 sm:top-2 right-1.5 sm:right-2 w-7! h-7! sm:w-8! sm:h-8! min-w-7! sm:min-w-8! rounded-full! bg-gray-100! hover:bg-gray-200!"
              onClick={handleCloseVariantSelector}
            >
              <IoCloseSharp className="text-[16px] sm:text-[18px]" />
            </Button>

            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 capitalize pr-8">
              Select {variantInfo?.type}
            </h2>

            <div className="mb-4 sm:mb-6 mt-2">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {variantInfo?.options.map((option, index) => (
                  <Button
                    key={index}
                    className={`${
                      selectedVariant.value === option
                        ? 'bg-primary! text-white!'
                        : 'bg-gray-100! text-black!'
                    } hover:bg-primary! hover:text-white! transition-all text-[12px]! sm:text-[13px]! px-2.5! sm:px-3! py-1! sm:py-1.5!`}
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

            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outlined"
                className="flex-1 border-gray-300! text-gray-700! hover:bg-gray-50! text-[12px]! sm:text-[13px]! py-1.5! sm:py-2!"
                onClick={handleCloseVariantSelector}
              >
                Cancel
              </Button>
              <Button
                className="btn-org flex-1 text-[12px]! sm:text-[13px]! py-1.5! sm:py-2!"
                onClick={handleConfirmAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <CircularProgress size={14} className="text-white" />
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

export default MyListItems;
