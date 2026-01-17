import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BannerBox from '../BannerBox';

const bannerData = [
  { img: '/homebanner1.jpg', link: '/' },
  { img: '/homebanner2.jpg', link: '/' },
  { img: '/homebanner3.jpg', link: '/' },
  { img: '/homebanner4.jpg', link: '/' },
];

const AdsBannerSlider = ({ items = 3 }) => {
  return (
    <div className="py-3 sm:py-4 md:py-5 w-full relative group">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={{
          prevEl: '.ads-prev',
          nextEl: '.ads-next',
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Navigation, Autoplay]}
        grabCursor={true}
        touchRatio={1}
        threshold={5}
        className="smlBtn"
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 2, spaceBetween: 14 },
          768: { slidesPerView: Math.min(items, 3), spaceBetween: 16 },
          1024: { slidesPerView: Math.min(items, 3), spaceBetween: 18 },
          1280: { slidesPerView: items, spaceBetween: 20 },
        }}
      >
        {bannerData.map((banner, index) => (
          <SwiperSlide key={index}>
            <BannerBox img={banner.img} link={banner.link} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <NavButton
        direction="prev"
        className="ads-prev left-0 sm:left-1 md:left-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
        small
      />
      <NavButton
        direction="next"
        className="ads-next right-0 sm:right-1 md:right-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
        small
      />
    </div>
  );
};

const NavButton = ({ direction, className, small }) => {
  const isPrev = direction === 'prev';
  return (
    <button
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 flex ${
        small
          ? 'h-8 w-8 sm:h-9 sm:w-9'
          : 'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11'
      } items-center justify-center rounded-full bg-white text-gray-800 shadow-md border border-gray-100 transition-all hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400`}
    >
      <svg
        className={`${small ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'}`}
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

export default AdsBannerSlider;
