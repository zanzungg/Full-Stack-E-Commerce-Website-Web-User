import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCategory } from '../../hooks/useCategory';

const CategorySkeleton = () => {
  return (
    <div className="flex gap-3 md:gap-4 overflow-hidden py-2 md:py-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="shrink-0 w-24 sm:w-28 md:w-36 lg:w-40 p-3 md:p-4 border rounded-lg md:rounded-xl bg-white shadow-sm"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gray-200 rounded-full animate-pulse mb-2 md:mb-3" />
          <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
};

const CategoryCard = memo(({ cat }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl =
    cat.images && cat.images.length > 0 ? cat.images[0].url : null;

  return (
    <Link to={`/product-listing?catId=${cat._id}`} className="block h-full">
      <div className="group h-full flex flex-col items-center justify-center rounded-lg md:rounded-xl border border-gray-100 bg-white p-2.5 sm:p-3 md:p-4 text-center shadow-sm transition-all duration-300 hover:border-red-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95">
        <div className="relative mb-2 md:mb-3 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-105">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={cat.name}
              className="h-full w-full object-contain p-1.5 sm:p-2 mix-blend-multiply"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xl md:text-2xl opacity-40">📦</span>
          )}
        </div>
        <h3 className="w-full text-xs sm:text-sm md:text-[15px] font-medium text-gray-700 transition-colors group-hover:text-red-600 line-clamp-1 min-h-8 sm:min-h-9 md:min-h-10 flex items-start justify-center leading-tight px-0.5">
          {cat.name}
        </h3>
      </div>
    </Link>
  );
});

CategoryCard.displayName = 'CategoryCard';

const HomeCategorySlider = memo(() => {
  // Use category hook
  const { categories, loading, isEmpty } = useCategory({
    autoFetch: true,
    fetchTree: true,
    enableCache: true,
    cacheTime: 10 * 60 * 1000,
  });

  if (loading) {
    return (
      <section className="homeCategorySlider py-4 sm:py-6 md:py-8 bg-gray-50/50">
        <div className="container mx-auto px-3 sm:px-4">
          <CategorySkeleton />
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return null;
  }

  return (
    <section className="homeCategorySlider py-4 sm:py-6 md:py-8 bg-gray-50/50">
      <div className="container mx-auto px-3 sm:px-4 relative group/slider">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={600}
          navigation={{
            prevEl: '.cat-prev',
            nextEl: '.cat-next',
            disabledClass: 'opacity-0 pointer-events-none',
          }}
          spaceBetween={8}
          slidesPerView={3.5}
          slidesPerGroup={1}
          grabCursor={true}
          touchRatio={1}
          threshold={5}
          resistanceRatio={0.85}
          className="pt-2 pb-2!"
          breakpoints={{
            480: { slidesPerView: 3.5, spaceBetween: 12, slidesPerGroup: 2 },
            640: { slidesPerView: 4, spaceBetween: 14, slidesPerGroup: 2 },
            768: { slidesPerView: 5, spaceBetween: 16, slidesPerGroup: 2 },
            1024: { slidesPerView: 6, spaceBetween: 20, slidesPerGroup: 3 },
            1280: { slidesPerView: 7, spaceBetween: 24, slidesPerGroup: 3 },
          }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id} className="h-auto">
              <CategoryCard cat={cat} />
            </SwiperSlide>
          ))}
        </Swiper>

        <NavButton
          direction="prev"
          className="cat-prev left-0 sm:-left-2 md:-left-4 lg:-left-5 hidden sm:flex opacity-0 group-hover/slider:opacity-100 transition-opacity"
        />
        <NavButton
          direction="next"
          className="cat-next right-0 sm:-right-2 md:-right-4 lg:-right-5 hidden sm:flex opacity-0 group-hover/slider:opacity-100 transition-opacity"
        />
      </div>
    </section>
  );
});

HomeCategorySlider.displayName = 'HomeCategorySlider';

const NavButton = memo(({ direction, className }) => {
  const isPrev = direction === 'prev';
  return (
    <button
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400`}
    >
      <svg
        className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  );
});

NavButton.displayName = 'NavButton';

export default HomeCategorySlider;
