import React from 'react';
import { Skeleton } from '@mui/material';

const ProductLoading = () => {
  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border border-[rgba(0,0,0,0.1)]">
      {/* Image Skeleton */}
      <div className="imgWrapper w-full overflow-hidden rounded-md relative">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={220}
          animation="wave"
          sx={{ borderRadius: '6px' }}
        />
      </div>

      {/* Info Skeleton */}
      <div className="info p-3 py-5">
        {/* Brand/Category */}
        <Skeleton variant="text" width="40%" height={20} animation="wave" />

        {/* Product Title */}
        <Skeleton
          variant="text"
          width="90%"
          height={20}
          animation="wave"
          sx={{ mt: 1, mb: 1 }}
        />

        {/* Rating */}
        <Skeleton variant="text" width="50%" height={24} animation="wave" />

        {/* Price */}
        <div className="flex items-center gap-4 mt-2">
          <Skeleton variant="text" width="30%" height={24} animation="wave" />
          <Skeleton variant="text" width="25%" height={24} animation="wave" />
        </div>
      </div>
    </div>
  );
};

export default ProductLoading;
