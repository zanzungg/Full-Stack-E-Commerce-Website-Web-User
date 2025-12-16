import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Autoplay,
  Pagination,
  Keyboard,
  EffectFade,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import homeSliderBannerService from '../../api/services/homeSliderBannerService';
import './style.css';

const HomeSlider = memo(() => {
  const [banners, setBanners] = useState([]);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const swiperRef = useRef(null);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await homeSliderBannerService.getBanners();

        const bannersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data;

        if (bannersData && Array.isArray(bannersData)) {
          const allImages = bannersData
            .flatMap((banner) => banner.images.map((img) => img.url))
            .filter((url) => url && url.trim());

          setBanners(allImages);

          // Preload first image
          if (allImages.length > 0) {
            const img = new Image();
            img.src = allImages[0];
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load banners');
        console.error('Banner fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const handleAutoplayToggle = useCallback(() => {
    if (!swiperRef.current) return;

    if (isAutoplayPaused) {
      swiperRef.current.autoplay.start();
    } else {
      swiperRef.current.autoplay.stop();
    }
    setIsAutoplayPaused(!isAutoplayPaused);
  }, [isAutoplayPaused]);

  if (loading) {
    return (
      <section
        className="py-2 md:py-3"
        aria-label="Loading promotional banners"
      >
        <div className="container mx-auto px-3 md:px-4">
          <div className="relative w-full rounded-lg md:rounded-xl overflow-hidden">
            <div className="aspect-16/7 md:aspect-24/7 home-slider-skeleton" />
          </div>
        </div>
      </section>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  return (
    <section className="py-2 md:py-3" aria-label="Promotional banners">
      <div className="container mx-auto px-3 md:px-4">
        <div className="relative group">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Autoplay, Pagination, Keyboard, EffectFade]}
            navigation={{
              prevEl: '.banner-prev',
              nextEl: '.banner-next',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            loop={banners.length > 1}
            speed={600}
            spaceBetween={0}
            effect="slide"
            touchRatio={1.5}
            threshold={10}
            resistanceRatio={0.85}
            className="rounded-lg md:rounded-xl shadow-xl overflow-hidden banner-swiper"
            style={{
              '--swiper-navigation-size': '20px',
              '--swiper-pagination-color': '#ef4444',
              '--swiper-pagination-bullet-inactive-color': '#ffffff',
              '--swiper-pagination-bullet-inactive-opacity': '0.5',
            }}
          >
            {banners.map((src, i) => (
              <SwiperSlide key={`banner-${i}-${src.slice(-10)}`}>
                <div className="relative w-full bg-linear-to-br from-gray-100 to-gray-200">
                  <div className="aspect-16/7 md:aspect-24/7 relative">
                    {!loadedImages.has(i) && (
                      <div className="absolute inset-0 home-slider-skeleton" />
                    )}

                    <img
                      src={src}
                      alt={`Promotional banner ${i + 1} of ${banners.length}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                        loadedImages.has(i)
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                      }`}
                      onLoad={() => handleImageLoad(i)}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : 'low'}
                      decoding={i === 0 ? 'sync' : 'async'}
                      onError={(e) => {
                        console.error('Banner load error:', src);
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%23f3f4f6" width="1200" height="400"/%3E%3Ctext x="50%25" y="50%25" font-family="system-ui" font-size="20" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EBanner Unavailable%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {banners.length > 1 && (
            <>
              <NavButton
                direction="prev"
                className="banner-prev left-2 md:left-3"
                ariaLabel="Previous banner"
              />
              <NavButton
                direction="next"
                className="banner-next right-2 md:right-3"
                ariaLabel="Next banner"
              />

              {/* Autoplay Control */}
              <button
                onClick={handleAutoplayToggle}
                className="home-slider-control"
                aria-label={
                  isAutoplayPaused ? 'Resume autoplay' : 'Pause autoplay'
                }
                aria-pressed={isAutoplayPaused}
              >
                {isAutoplayPaused ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                  </svg>
                )}
                <span className="hidden sm:inline text-xs">
                  {isAutoplayPaused ? 'Play' : 'Pause'}
                </span>
              </button>

              {/* Progress indicator */}
              <div
                className="home-slider-progress"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="font-medium text-xs">
                  {banners.length} {banners.length === 1 ? 'banner' : 'banners'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
});

HomeSlider.displayName = 'HomeSlider';

const NavButton = memo(({ direction, className, ariaLabel }) => {
  const isPrev = direction === 'prev';
  return (
    <button className={`${className} home-slider-nav`} aria-label={ariaLabel}>
      <svg
        className="h-4 w-4 lg:h-5 lg:w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
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

export default HomeSlider;
