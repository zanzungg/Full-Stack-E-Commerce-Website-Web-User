import React, { useState, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const banners = [
  "https://serviceapi.spicezgold.com/download/1762393375689_34292.jpg",
  "https://serviceapi.spicezgold.com/download/1759938751802_30744.jpg",
  "https://serviceapi.spicezgold.com/download/1751685130717_NewProject(8).jpg",
  "https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg",
];

const HomeSlider = memo(() => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <section className="py-4">
      <div className="container mx-auto px-4 relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".banner-prev",
            nextEl: ".banner-next",
          }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          speed={700}
          spaceBetween={12}
          className="overflow-visible rounded-2xl"
        >
          {banners.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                {!loadedImages[i] && (
                  <div className="w-full h-64 md:h-96 animate-pulse bg-linear-to-r from-gray-200 to-gray-300" />
                )}

                <img
                  src={src}
                  alt={`Banner ${i + 1}`}
                  className={`block w-full h-auto max-w-full transition-opacity duration-500 rounded-2xl ${
                    loadedImages[i] ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ objectFit: "contain" }}
                  onLoad={() => handleLoad(i)}
                  loading="lazy"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/800x400?text=Image+Not+Found")
                  }
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <NavButton direction="prev" className="banner-prev left-3" />
        <NavButton direction="next" className="banner-next right-3" />
      </div>
    </section>
  );
});

const NavButton = ({ direction, className }) => {
  const isPrev = direction === "prev";
  return (
    <button
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition-all hover:bg-red-500 hover:text-white`}
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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

export default HomeSlider;