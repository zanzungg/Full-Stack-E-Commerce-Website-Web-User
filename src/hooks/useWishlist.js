import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createElement } from 'react';
import wishlistService from '../api/services/wishlistService';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useWishlist = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();

  // Fetch wishlist items - only when authenticated
  const {
    data: wishlistResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => response?.data?.data, // Extract data directly
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: (productId) => wishlistService.addToWishlist(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });

      // Enhanced success toast with action button
      toast.success(
        (t) =>
          createElement(
            'div',
            { className: 'flex flex-col gap-2' },
            createElement(
              'span',
              { className: 'font-medium' },
              response.data.message || 'Product added to wishlist!'
            ),
            createElement(
              'button',
              {
                type: 'button',
                className:
                  'text-sm text-primary hover:underline font-medium text-left',
                onClick: () => {
                  toast.dismiss(t.id);
                  navigate('/my-wishlist');
                },
              },
              'View Wishlist →'
            )
          ),
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            padding: '16px',
          },
          icon: '❤️',
        }
      );
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to add to wishlist';
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

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId) => wishlistService.removeFromWishlist(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
      toast.success(response.data.message || 'Product removed from wishlist', {
        duration: 3000,
        position: 'top-right',
        icon: '💔',
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
    },
  });

  // Clear wishlist mutation
  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
      toast.success(response.data.message || 'Wishlist cleared', {
        duration: 3000,
        position: 'top-right',
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to clear wishlist';
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
    },
  });

  // Check if product is in wishlist
  const useCheckWishlist = (productId) => {
    return useQuery({
      queryKey: ['wishlist-check', productId],
      queryFn: () => wishlistService.checkWishlist(productId),
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (response) => response?.data?.data?.inWishlist || false,
      enabled: isAuthenticated && !!productId,
    });
  };

  // Get wishlist count
  const { data: wishlistCountResponse, isLoading: isCountLoading } = useQuery({
    queryKey: ['wishlist-count'],
    queryFn: wishlistService.getWishlistCount,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (response) => response?.data?.data?.count || 0,
    enabled: isAuthenticated,
  });

  // Get wishlist stats
  const { data: wishlistStatsResponse, isLoading: isStatsLoading } = useQuery({
    queryKey: ['wishlist-stats'],
    queryFn: wishlistService.getWishlistStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (response) => response?.data,
    enabled: isAuthenticated,
  });

  // Sync wishlist mutation
  const syncWishlistMutation = useMutation({
    mutationFn: () => wishlistService.syncWishlist(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });

      const data = response?.data?.data;
      const message = response?.data?.message || 'Wishlist synced';
      const details = data
        ? `Updated: ${data.updated?.length || 0}, Failed: ${data.failed || 0}`
        : '';

      toast.success(
        createElement(
          'div',
          { className: 'flex flex-col gap-1' },
          createElement('span', { className: 'font-medium' }, message),
          details &&
            createElement('span', { className: 'text-xs opacity-80' }, details)
        ),
        {
          duration: 3000,
          position: 'top-right',
        }
      );
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to sync wishlist';
      toast.error(message, {
        duration: 4000,
        position: 'top-right',
      });
    },
  });

  // Toggle wishlist (add if not in wishlist, remove if in wishlist)
  const toggleWishlist = async (productId) => {
    try {
      const checkResponse = await wishlistService.checkWishlist(productId);
      const isInWishlist = checkResponse?.data?.data?.inWishlist;

      if (isInWishlist) {
        removeFromWishlistMutation.mutate(productId);
      } else {
        addToWishlistMutation.mutate(productId);
      }
    } catch (error) {
      toast.error('Failed to toggle wishlist', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  return {
    // Data
    wishlist: wishlistResponse,
    wishlistItems: wishlistResponse?.items || [],
    wishlistCount: wishlistCountResponse || 0,
    wishlistStats: wishlistStatsResponse || null,

    // States
    isLoading,
    isCountLoading,
    isStatsLoading,
    error,
    refetch,

    // Actions
    addToWishlist: addToWishlistMutation.mutate,
    addToWishlistAsync: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    removeFromWishlistAsync: removeFromWishlistMutation.mutateAsync,
    clearWishlist: clearWishlistMutation.mutate,
    syncWishlist: syncWishlistMutation.mutate,
    toggleWishlist,

    // Helper hooks
    useCheckWishlist,

    // Loading states
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
    isSyncing: syncWishlistMutation.isPending,
  };
};

export default useWishlist;
