import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCategory } from '../../hooks/useCategory';

const CategorySkeleton = () => {
  return (
    <div className="flex gap-4 overflow-hidden py-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="shrink-0 w-32 md:w-40 p-4 border rounded-xl bg-white shadow-sm"
        >
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full animate-pulse mb-3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
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
      <div className="group h-full flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:border-red-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <div className="relative mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-105">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={cat.name}
              className="h-full w-full object-contain p-2 mix-blend-multiply"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-2xl opacity-40">📦</span>
          )}
        </div>
        <h3 className="w-full text-sm font-medium text-gray-700 transition-colors group-hover:text-red-600 md:text-[15px] line-clamp-2 min-h-10 flex items-start justify-center leading-tight">
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
      <section className="homeCategorySlider py-8 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <CategorySkeleton />
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return null;
  }

  return (
    <section className="homeCategorySlider py-8 bg-gray-50/50">
      <div className="container mx-auto px-4 relative group/slider">
        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          navigation={{
            prevEl: '.cat-prev',
            nextEl: '.cat-next',
            disabledClass: 'opacity-0 pointer-events-none',
          }}
          spaceBetween={12}
          slidesPerView={3}
          grabCursor={true}
          className="pt-2!"
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 16 },
            640: { slidesPerView: 4, spaceBetween: 16 },
            768: { slidesPerView: 5, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 24 },
            1280: { slidesPerView: 7, spaceBetween: 24 },
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
          className="cat-prev -left-3 md:-left-5 hidden md:flex opacity-0 group-hover/slider:opacity-100 transition-opacity"
        />
        <NavButton
          direction="next"
          className="cat-next -right-3 md:-right-5 hidden md:flex opacity-0 group-hover/slider:opacity-100 transition-opacity"
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
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 focus:outline-none`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
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
