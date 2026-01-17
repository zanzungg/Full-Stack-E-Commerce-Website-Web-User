import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from '../ProductItem';
import ProductLoading from '../ProductLoading';

const ProductsSlider = ({ items = 6, products = [], loading = false }) => {
  // Loading state
  if (loading) {
    return (
      <div className="productsSlider py-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: items }).map((_, index) => (
            <ProductLoading key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="productsSlider py-3">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-sm font-medium">
            No products found in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="productsSlider py-3">
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: '.pro-prev', nextEl: '.pro-next' }}
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: items, spaceBetween: 20 },
        }}
        className="relative py-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}

        {/* Navigation buttons */}
        <NavButton direction="prev" className="pro-prev left-3" />
        <NavButton direction="next" className="pro-next right-3" />
      </Swiper>
    </div>
  );
};

const NavButton = ({ direction, className }) => {
  const isPrev = direction === 'prev';
  return (
    <button
      className={`
        ${className}
        absolute top-1/2 -translate-y-1/2 
        ${isPrev ? 'left-4' : 'right-4'}
        z-10 flex h-11 w-11 items-center justify-center 
        rounded-full bg-white text-gray-800 shadow-lg 
        transition-all hover:bg-red-500 hover:text-white
      `}
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d={
            isPrev
              ? 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              : 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
          }
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default ProductsSlider;
