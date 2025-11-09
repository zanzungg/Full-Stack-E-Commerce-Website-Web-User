import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Button from "@mui/material/Button";

const HomeBannerV2 = () => {
  const slides = [
    {
      id: 1,
      src: "https://serviceapi.spicezgold.com/download/1756273096312_1737036773579_sample-1.jpg",
      alt: "Women T-Shirt Banner",
      title: "Big Saving Days Sale",
      subtitle: "Women Solid Round Green T-Shirt",
      price: "$59.00",
      buttonText: "SHOP NOW",
    },
    {
      id: 2,
      src: "https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg",
      alt: "Modern Chair Banner",
      title: "New Arrival Collection",
      subtitle: "Buy Modern Chair in Black Color",
      price: "$99.00",
      buttonText: "SHOP NOW",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        spaceBetween={30}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".banner-v2-prev",
          nextEl: ".banner-v2-next",
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<span class="${className}"></span>`,
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
                  e.target.src = "/fallback-banner.jpg";
                }}
                className="w-full h-auto object-cover select-none"
                style={{ maxHeight: "80vh" }}
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent z-10"></div>

              <div className="info absolute top-0 left-0 md:left-auto md:right-0 w-full md:w-[50%] h-full z-20 p-6 md:p-8 flex flex-col justify-center text-black">
                <h4 className="text-sm md:text-lg font-medium mb-2 opacity-90">
                  {slide.title}
                </h4>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
                  {slide.subtitle}
                </h2>
                <h3 className="flex flex-wrap items-center gap-2 text-lg md:text-2xl font-medium mb-4">
                  Starting At Only
                  <span className="text-red-500 text-3xl md:text-4xl font-bold">
                    {slide.price}
                  </span>
                </h3>

                <Button
                  variant="contained"
                  className="btn-org bg-red-600! hover:bg-red-700! text-white! font-semibold! py-3! px-6! rounded-md! shadow-lg! transition-all! duration-300! hover:scale-105!"
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <NavButton direction="prev" className="banner-v2-prev left-4 md:left-8" />
      <NavButton direction="next" className="banner-v2-next right-4 md:right-8" />
    </div>
  );
};

const NavButton = ({ direction, className }) => {
  const isPrev = direction === "prev";

  return (
    <button
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={`${className} absolute top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-800 shadow-xl transition-all duration-300 hover:bg-red-600 hover:text-white hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-400`}
    >
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d={
            isPrev
              ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          }
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default HomeBannerV2;