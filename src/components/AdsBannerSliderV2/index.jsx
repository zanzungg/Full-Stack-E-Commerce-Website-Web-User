import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BannerBoxV2 from '../BannerBoxV2';

const bannerData = [
  { info: 'left', img: './homebanner1.jpg', link: '/' },
  { info: 'left', img: './homebanner2.jpg', link: '/' },
  { info: 'right', img: './homebanner3.jpg', link: '/' },
  { info: 'right', img: './homebanner4.jpg', link: '/' },
];

const AdsBannerSliderV2 = ({ items = 3 }) => {
  return (
    <div className="py-5 w-full relative">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={{
          prevEl: '.ads-v2-prev',
          nextEl: '.ads-v2-next',
        }}
        modules={[Navigation]}
        className="smlBtn"
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: Math.min(items, 3) },
          1024: { slidesPerView: Math.min(items, 4) },
        }}
      >
        {bannerData.map((banner, index) => (
          <SwiperSlide key={index}>
            <BannerBoxV2
              info={banner.info}
              image={banner.img}
              link={banner.info}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <NavButton direction="prev" className="ads-v2-prev left-1" small />
      <NavButton direction="next" className="ads-v2-next right-1" small />
    </div>
  );
};

const NavButton = ({ direction, className, small }) => {
  const isPrev = direction === 'prev';
  return (
    <button
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 flex ${
        small ? 'h-8 w-8' : 'h-11 w-11'
      } items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition-all hover:bg-red-500 hover:text-white`}
    >
      <svg
        className={`${small ? 'h-4 w-4' : 'h-5 w-5'}`}
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

export default AdsBannerSliderV2;
