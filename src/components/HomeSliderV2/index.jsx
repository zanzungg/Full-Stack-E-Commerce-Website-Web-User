import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useActiveBanners } from '../../hooks/useProduct';

const HomeBannerV2 = () => {
  const navigate = useNavigate();
  const { banners, loading, error } = useActiveBanners();

  const slides = useMemo(() => {
    if (!banners || banners.length === 0) return [];
    return banners.map((product) => ({
      id: product._id,
      src: product.banner?.image?.url || product.images?.[0]?.url || '',
      alt: product.name || 'Banner',
      badge: product.banner?.content?.badge || '',
      title: product.banner?.content?.title || product.name,
      subtitle: product.banner?.content?.subtitle || '',
      priceDisplay:
        product.banner?.content?.priceDisplay ||
        `Starting At $${product.price}`,
      buttonText: product.banner?.content?.buttonText || 'SHOP NOW',
      productId: product._id,
    }));
  }, [banners]);

  if (loading) {
    return (
      <div className="relative w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
        <CircularProgress size={50} className="text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-gray-600 text-lg">No active banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden group">
      <Swiper
        spaceBetween={30}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: '.banner-v2-prev',
          nextEl: '.banner-v2-next',
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className}"></span>`,
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="homeSliderV2"
        fadeEffect={{ crossFade: true }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="item relative w-full h-full rounded-md overflow-hidden">
              {/* Background Image */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/fallback-banner.jpg';
                }}
                className="w-full h-auto object-cover select-none"
                style={{ maxHeight: '60vh', minHeight: '280px' }}
              />

              {/* Overlay Content - Stronger gradient for better text readability */}
              <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/50 to-black/20 z-10"></div>

              {/* Info section - Always positioned on the right side with proper spacing */}
              <div className="info absolute top-0 right-0 w-[50%] sm:w-[50%] md:w-[50%] h-full z-20 p-2 sm:p-3 md:p-6 lg:p-8 flex flex-col justify-center text-white">
                {slide.badge && (
                  <span className="inline-block bg-red-600 text-white text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-0.5 md:py-1 rounded-full mb-1 sm:mb-1.5 md:mb-2 w-fit shadow-md">
                    {slide.badge}
                  </span>
                )}

                <h4 className="text-[9px] sm:text-[10px] md:text-sm lg:text-lg font-medium mb-0.5 sm:mb-1 md:mb-2 opacity-95 drop-shadow-sm line-clamp-2">
                  {slide.title}
                </h4>

                {slide.subtitle && (
                  <h2 className="text-xs sm:text-sm md:text-2xl lg:text-4xl font-bold leading-tight mb-1 sm:mb-1.5 md:mb-3 drop-shadow-md line-clamp-2">
                    {slide.subtitle}
                  </h2>
                )}

                <h3 className="text-[10px] sm:text-xs md:text-lg lg:text-2xl font-medium mb-1.5 sm:mb-2 md:mb-4">
                  <span className="text-red-400 md:text-red-500 text-sm sm:text-base md:text-2xl lg:text-3xl font-bold drop-shadow-md">
                    {slide.priceDisplay}
                  </span>
                </h3>

                <Button
                  variant="contained"
                  className="btn-org bg-red-600! hover:bg-red-700! text-white! font-semibold! py-1! sm:py-1.5! md:py-3! px-10! sm:px-14! md:px-20! text-[9px]! sm:text-[10px]! md:text-sm! rounded-md! shadow-lg! transition-all! duration-300! hover:scale-105! active:scale-95! w-fit!"
                  onClick={() =>
                    navigate(`/product-details/${slide.productId}`)
                  }
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <NavButton
        direction="prev"
        className="banner-v2-prev left-1 sm:left-2 md:left-4 lg:left-8 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <NavButton
        direction="next"
        className="banner-v2-next right-1 sm:right-2 md:right-4 lg:right-8 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

const NavButton = ({ direction, className }) => {
  const isPrev = direction === 'prev';

  return (
    <button
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      className={`${className} absolute top-1/2 z-30 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 md:h-11 lg:h-12 md:w-11 lg:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl transition-all duration-300 hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400`}
    >
      <svg
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 lg:h-6 md:w-5 lg:w-6"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
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

export default HomeBannerV2;
