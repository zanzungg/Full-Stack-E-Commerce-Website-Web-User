import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Rating from '@mui/material/Rating';
import { Button, CircularProgress } from '@mui/material';
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
      <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)] last:border-b-0">
        {/* Product Image */}
        <div className="img w-[15%] rounded-md overflow-hidden">
          <Link to={`/product/${productId}`} className="group">
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
        <div className="info w-[85%] relative">
          {/* Remove Button */}
          <IoCloseSharp
            className={`cursor-pointer absolute top-0 right-0 text-[22px] link transition-all hover:text-red-500 ${
              isRemoving ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={onRemove}
            title="Remove from wishlist"
          />

          {/* Brand */}
          <span className="text-[13px] text-gray-600 block mb-1">
            {productBrand}
          </span>

          {/* Product Name */}
          <h3 className="text-[15px] font-semibold mb-2 pr-8">
            <Link
              to={`/product/${productId}`}
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
            />
          ) : (
            <span className="text-xs text-gray-400">No reviews</span>
          )}

          {/* Price Section */}
          <div className="flex items-center gap-4 mt-4 mb-4">
            <span className="price text-black font-semibold text-[18px]">
              ${productPrice.toFixed(2)}
            </span>

            {productOldPrice > productPrice && (
              <>
                <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
                  ${productOldPrice.toFixed(2)}
                </span>
                <span className="discount text-primary font-semibold text-[14px] bg-red-50 px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="btn-org btn-sm"
            onClick={handleAddToCartClick}
            disabled={isAdding || isRemoving}
            variant="contained"
            size="small"
          >
            {isAdding ? (
              <>
                <CircularProgress size={16} className="mr-2" color="inherit" />
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
            className="bg-white rounded-lg p-6 max-w-md w-[90%] relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute! top-2 right-2 w-8! h-8! min-w-8! rounded-full! bg-gray-100! hover:bg-gray-200!"
              onClick={handleCloseVariantSelector}
            >
              <IoCloseSharp className="text-[18px]" />
            </Button>

            <h2 className="text-lg font-semibold mb-4 capitalize">
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
                    } hover:bg-primary! hover:text-white! transition-all`}
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
                className="flex-1 border-gray-300! text-gray-700! hover:bg-gray-50!"
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

export default MyListItems;
