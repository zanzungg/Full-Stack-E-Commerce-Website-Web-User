import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import Rating from '@mui/material/Rating';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useCart } from '../../hooks/useCart';

const CartItems = ({ item }) => {
  const {
    increment,
    decrement,
    removeItem,
    updateVariant,
    isIncrementing,
    isDecrementing,
    isRemoving,
    isUpdatingVariant,
  } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedNewVariant, setSelectedNewVariant] = useState(null);

  if (!item || !item.productId) return null;

  const product = item.productId;
  const cartItemId = item._id;

  // Calculate price info
  const currentPrice = product.price || 0;
  const oldPrice = product.oldPrice || 0;
  const discount = product.discount || 0;
  const totalPrice = currentPrice * item.quantity;

  // Get main image
  const mainImage =
    product.images?.[0]?.url || 'https://via.placeholder.com/300';

  // Get variant info
  const hasVariant = item.selectedVariant && item.selectedVariant.type;
  const variantType = item.selectedVariant?.type;
  const currentVariantValue = item.selectedVariant?.value;

  // Get available variant options
  const getAvailableVariants = () => {
    if (!variantType) return [];
    if (variantType === 'size') return product.productSize || [];
    if (variantType === 'ram') return product.productRam || [];
    if (variantType === 'weight') return product.productWeight || [];
    return [];
  };

  const availableVariants = getAvailableVariants();

  // Handle remove item
  const handleRemove = () => {
    setRemovingItemId(cartItemId);
    removeItem(cartItemId);
  };

  // Handle variant change
  const handleVariantChange = (newValue) => {
    if (newValue === currentVariantValue) {
      setShowVariantSelector(false);
      return;
    }

    updateVariant(
      { itemId: cartItemId, variantValue: newValue },
      {
        onSuccess: () => {
          setShowVariantSelector(false);
          setSelectedNewVariant(null);
        },
      }
    );
  };

  // Check if out of stock
  const isOutOfStock = product.countInStock === 0;
  const isLowStock = product.countInStock < item.quantity;

  return (
    <div className="cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)] relative">
      <div className="img w-[15%] rounded-md overflow-hidden">
        <Link to={`/product-details/${product._id}`} className="group">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[85%] relative">
        <Tooltip title="Remove item">
          <IconButton
            className="absolute! top-0 right-0"
            onClick={handleRemove}
            disabled={removingItemId === cartItemId}
            size="small"
          >
            {removingItemId === cartItemId ? (
              <CircularProgress size={16} />
            ) : (
              <IoCloseSharp className="text-[22px] link transition-all" />
            )}
          </IconButton>
        </Tooltip>

        <span className="text-[13px] text-gray-600">
          {product.brand || 'No Brand'}
        </span>
        <h3 className="text-[15px] font-semibold">
          <Link to={`/product-details/${product._id}`} className="link">
            {product.name}
          </Link>
        </h3>

        {product.rating > 0 ? (
          <Rating
            name="size-small"
            value={product.rating || 0}
            size="small"
            readOnly
            precision={0.5}
          />
        ) : (
          <span className="text-xs text-gray-400">No reviews</span>
        )}

        {/* Variant Display and Selector */}
        {hasVariant && (
          <div className="mt-2">
            {!showVariantSelector ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {variantType?.toUpperCase()}:
                </span>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-md">
                  <span className="font-semibold text-primary">
                    {currentVariantValue}
                  </span>
                  {availableVariants.length > 1 && (
                    <Tooltip title="Change variant">
                      <IconButton
                        size="small"
                        onClick={() => setShowVariantSelector(true)}
                        className="w-6! h-6!"
                        disabled={isUpdatingVariant}
                      >
                        <MdEdit className="text-[14px]" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Select {variantType?.toUpperCase()}:
                  </span>
                  <button
                    onClick={() => setShowVariantSelector(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                    disabled={isUpdatingVariant}
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => handleVariantChange(variant)}
                      disabled={isUpdatingVariant}
                      className={`px-3 py-1.5 rounded-md border-2 transition-all text-sm font-medium
                        ${
                          variant === currentVariantValue
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-primary/5'
                        }
                        ${
                          isUpdatingVariant
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }
                      `}
                    >
                      {isUpdatingVariant ? (
                        <CircularProgress size={14} className="text-inherit" />
                      ) : (
                        variant
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock alerts */}
        {isOutOfStock && (
          <div className="mt-2 text-red-600 text-sm font-medium">
            ⚠️ Out of stock
          </div>
        )}
        {!isOutOfStock && isLowStock && (
          <div className="mt-2 text-yellow-600 text-sm font-medium">
            ⚠️ Only {product.countInStock} left in stock
          </div>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 bg-[#f1f1f1] rounded-md p-1">
            <Tooltip title="Decrease quantity">
              <span>
                <IconButton
                  size="small"
                  onClick={() => decrement(cartItemId)}
                  disabled={item.quantity <= 1 || isDecrementing}
                  className="w-[30px]! h-[30px]!"
                >
                  <FiMinus className="text-[14px]" />
                </IconButton>
              </span>
            </Tooltip>

            <span className="px-3 font-semibold min-w-10 text-center">
              {item.quantity}
            </span>

            <Tooltip title="Increase quantity">
              <span>
                <IconButton
                  size="small"
                  onClick={() => increment(cartItemId)}
                  disabled={
                    isOutOfStock ||
                    item.quantity >= product.countInStock ||
                    item.quantity >= 100 ||
                    isIncrementing
                  }
                  className="w-[30px]! h-[30px]!"
                >
                  <FiPlus className="text-[14px]" />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          <span className="text-[12px] text-gray-500">
            {product.countInStock > 0
              ? `${product.countInStock} available`
              : 'Out of stock'}
          </span>
        </div>

        {/* Price info */}
        <div className="flex items-center gap-4 mt-3">
          <span className="price text-black font-semibold text-[15px]">
            ${currentPrice.toFixed(2)}
          </span>
          {oldPrice > currentPrice && (
            <>
              <span className="oldPrice line-through text-gray-500 text-[14px] font-medium">
                ${oldPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-green-600 font-semibold text-[13px]">
                  {discount}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Total price for this item */}
        <div className="mt-2">
          <span className="text-[13px] text-gray-600">Subtotal: </span>
          <span className="text-primary font-bold text-[16px]">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
