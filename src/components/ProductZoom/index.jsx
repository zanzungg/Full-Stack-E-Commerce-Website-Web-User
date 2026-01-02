import React, { useState, useRef, useEffect } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductZoom = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainIndex, setMainIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const thumbsSwiperRef = useRef(null);

  // Convert images array from API or use placeholder
  const imageUrls =
    images.length > 0
      ? images.map((img) => img.url || img)
      : ['https://via.placeholder.com/500x500?text=No+Image'];

  const handleThumbClick = (index) => {
    setActiveIndex(index);
    setMainIndex(index);
    if (thumbsSwiperRef.current) {
      thumbsSwiperRef.current.slideTo(index);
    }
  };

  useEffect(() => {
    const swiper = thumbsSwiperRef.current;
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [showNavigation]);

  return (
    <div className="flex gap-4 max-w-5xl mx-auto p-4">
      <div className="flex flex-col w-[15%] items-center">
        {showNavigation && (
          <button
            ref={prevRef}
            disabled={isAtStart}
            className={`w-full py-2 mb-2 rounded-md border flex items-center justify-center transition-all duration-200
                            ${
                              isAtStart
                                ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-50'
                                : 'bg-white border-gray-300 hover:bg-red-500 hover:border-red-500 group'
                            }`}
          >
            <svg
              className={`w-5 h-5 ${
                isAtStart
                  ? 'text-gray-400'
                  : 'text-gray-700 group-hover:text-white'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}

        <Swiper
          onSwiper={(swiper) => {
            thumbsSwiperRef.current = swiper;
            const needNav = swiper.slides.length > swiper.params.slidesPerView;
            setShowNavigation(needNav);
            setIsAtStart(swiper.isBeginning);
            setIsAtEnd(swiper.isEnd);

            if (prevRef.current && nextRef.current) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          direction="vertical"
          spaceBetween={12}
          slidesPerView={4}
          modules={[Navigation]}
          onReachBeginning={() => setIsAtStart(true)}
          onReachEnd={() => setIsAtEnd(true)}
          onFromEdge={() => {
            setIsAtStart(false);
            setIsAtEnd(false);
          }}
          onSlideChange={(swiper) => {
            setIsAtStart(swiper.isBeginning);
            setIsAtEnd(swiper.isEnd);
          }}
          onSlidesLengthChange={(swiper) => {
            const needNav = swiper.slides.length > swiper.params.slidesPerView;
            setShowNavigation(needNav);
          }}
          className="thumbs-swiper h-[440px] overflow-hidden"
        >
          {imageUrls.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => handleThumbClick(index)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300
                        ${
                          activeIndex === index
                            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                            : 'shadow-sm hover:shadow-md'
                        }`}
              >
                <img
                  src={src}
                  alt={`Thumb ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg transition-all duration-300
                        ${
                          activeIndex === index
                            ? 'brightness-100 opacity-100'
                            : 'brightness-50 opacity-60 hover:brightness-75 hover:opacity-80'
                        }`}
                />
                {activeIndex !== index && (
                  <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none" />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showNavigation && (
          <button
            ref={nextRef}
            disabled={isAtEnd}
            className={`w-full py-2 mt-2 rounded-md border flex items-center justify-center transition-all duration-200
                        ${
                          isAtEnd
                            ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-white border-gray-300 hover:bg-red-500 hover:border-red-500 group'
                        }`}
          >
            <svg
              className={`w-5 h-5 ${
                isAtEnd
                  ? 'text-gray-400'
                  : 'text-gray-700 group-hover:text-white'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 h-[535px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 p-2 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <InnerImageZoom
            src={imageUrls[mainIndex]}
            zoomSrc={imageUrls[mainIndex]}
            zoomType="hover"
            zoomScale={1.0}
            zoomPreload={true}
            hideHint={true}
            className="max-w-full max-h-full object-contain rounded-lg"
            fullscreenOnMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductZoom;
