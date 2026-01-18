import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createElement } from 'react';
import cartService from '../api/services/cartService';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useCart = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();

  // Fetch cart items - only when authenticated
  const {
    data: cartResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => response?.data?.data, // Extract data from response
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity, selectedVariant }) =>
      cartService.addToCart(productId, quantity, selectedVariant),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Enhanced success toast with action button
      toast.success(
        (t) =>
          createElement(
            'div',
            { className: 'flex flex-col gap-2' },
            createElement(
              'span',
              { className: 'font-medium' },
              response?.data?.message || 'Product added to cart!'
            ),
            createElement(
              'button',
              {
                type: 'button',
                className:
                  'text-sm text-primary hover:underline font-medium text-left cursor-pointer',
                onClick: () => {
                  toast.dismiss(t.id);
                  navigate('/cart');
                },
              },
              'View Cart →'
            )
          ),
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f0fdf4',
            color: '#166534',
            padding: '16px',
          },
          icon: '🛒',
        }
      );
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          padding: '16px',
        },
        icon: '❌',
      });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response?.data?.message || 'Quantity updated');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update';
      toast.error(message);
    },
  });

  // Update variant mutation
  const updateVariantMutation = useMutation({
    mutationFn: ({ itemId, variantValue }) =>
      cartService.updateVariantValue(itemId, variantValue),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      const isMerged = response?.data?.data?.merged;
      const message = isMerged
        ? 'Items merged successfully'
        : response?.data?.message || 'Variant updated';

      toast.success(message, {
        duration: 3000,
        position: 'top-right',
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to update variant';
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
    },
  });

  // Increment mutation
  const incrementMutation = useMutation({
    mutationFn: (itemId) => cartService.incrementCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to increment';
      toast.error(message);
    },
  });

  // Decrement mutation
  const decrementMutation = useMutation({
    mutationFn: (itemId) => cartService.decrementCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to decrement';
      toast.error(message);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId) => cartService.removeCartItem(itemId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response?.data?.message || 'Item removed');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to remove';
      toast.error(message);
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response?.data?.message || 'Cart cleared');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    },
  });

  // Delete batch mutation
  const deleteBatchMutation = useMutation({
    mutationFn: (cartItemIds) => cartService.deleteCartBatch(cartItemIds),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(response?.data?.message || 'Items deleted');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete';
      toast.error(message);
    },
  });

  return {
    // Data
    cart: cartResponse,
    cartItems: cartResponse?.items || [],
    cartSummary: cartResponse?.summary || null,
    stockAlerts: cartResponse?.alerts?.stockIssues || null,

    // States
    isLoading,
    error,
    refetch,

    // Actions
    addToCart: addToCartMutation.mutate,
    addToCartAsync: addToCartMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutate,
    updateVariant: updateVariantMutation.mutate,
    increment: incrementMutation.mutate,
    decrement: decrementMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    clearCartAsync: clearCartMutation.mutateAsync,
    deleteBatch: deleteBatchMutation.mutate,

    // Loading states
    isAdding: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isUpdatingVariant: updateVariantMutation.isPending,
    isIncrementing: incrementMutation.isPending,
    isDecrementing: decrementMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;
