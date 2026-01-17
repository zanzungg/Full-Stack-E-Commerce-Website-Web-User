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
          sx={{
            borderRadius: '6px',
            '@media (max-width: 768px)': {
              height: 180,
            },
            '@media (max-width: 480px)': {
              height: 160,
            },
          }}
        />
      </div>

      {/* Info Skeleton */}
      <div className="info p-2 md:p-3 py-3 md:py-5">
        {/* Brand/Category */}
        <Skeleton
          variant="text"
          width="40%"
          height={18}
          animation="wave"
          sx={{
            '@media (max-width: 768px)': {
              height: 16,
            },
          }}
        />

        {/* Product Title */}
        <Skeleton
          variant="text"
          width="90%"
          height={18}
          animation="wave"
          sx={{
            mt: 1,
            mb: 1,
            '@media (max-width: 768px)': {
              height: 16,
            },
          }}
        />

        {/* Rating */}
        <Skeleton
          variant="text"
          width="50%"
          height={20}
          animation="wave"
          sx={{
            '@media (max-width: 768px)': {
              height: 18,
            },
          }}
        />

        {/* Price */}
        <div className="flex items-center gap-2 md:gap-4 mt-2">
          <Skeleton
            variant="text"
            width="30%"
            height={22}
            animation="wave"
            sx={{
              '@media (max-width: 768px)': {
                height: 18,
              },
            }}
          />
          <Skeleton
            variant="text"
            width="25%"
            height={22}
            animation="wave"
            sx={{
              '@media (max-width: 768px)': {
                height: 18,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductLoading;
