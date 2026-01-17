import { useState } from 'react';
import HomeSlider from '../../components/HomeSlider';
import HomeCategorySlider from '../../components/HomeCategorySlider';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AdsBannerSlider from '../../components/AdsBannerSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsSlider from '../../components/ProductsSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BlogItem from '../../components/BlogItem';
import HomeBannerV2 from '../../components/HomeSliderV2';
import BannerBoxV2 from '../../components/BannerBoxV2';
import AdsBannerSliderV2 from '../../components/AdsBannerSliderV2';
import { useCategory } from '../../hooks/useCategory';
import {
  useProductsByCategory,
  useLatestProducts,
  useFeaturedProducts,
} from '../../hooks/useProduct';
import { useHomeBannerV1 } from '../../hooks/useHomeBannerV1';
import { useBlog } from '../../hooks/useBlog';

const Home = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // Categories hook
  const { categories, categoriesLoading } = useCategory({
    autoFetch: true,
    fetchTree: true,
    enableCache: true,
    cacheTime: 10 * 60 * 1000,
  });

  // Get selected category ID
  const selectedCategory = categories[selectedCategoryIndex];
  const selectedCategoryId = selectedCategory?._id;

  // Products by category hook
  const { products, loading: productsLoading } = useProductsByCategory(
    selectedCategoryId,
    {
      autoFetch: true,
      params: { page: 1, limit: 12 },
      enableCache: true,
      cacheTime: 5 * 60 * 1000,
    }
  );

  // Latest products hook
  const { latestProducts, latestProductsLoading } = useLatestProducts({
    autoFetch: true,
    params: { page: 1, limit: 6 },
    enableCache: true,
    cacheTime: 5 * 60 * 1000,
  });

  // Featured products hook
  const { featuredProducts, featuredProductsLoading } = useFeaturedProducts({
    autoFetch: true,
    params: { limit: 6 },
    enableCache: true,
    cacheTime: 5 * 60 * 1000,
  });

  const {
    banners: homeBannersV1,
    bannersLoading,
    error: bannersError,
    getActiveBanners,
  } = useHomeBannerV1({
    autoFetch: true,
    enableCache: true,
    cacheTime: 5 * 60 * 1000,
  });

  const activeHomeBannersV1 = getActiveBanners();

  // Blogs hook
  const {
    blogs,
    blogsLoading,
    error: blogsErrorState,
    refresh: refreshBlogs,
    loadMore: loadMoreBlogs,
    hasData: hasBlogs,
    isEmpty: isBlogsEmpty,
  } = useBlog({
    autoFetch: true,
    params: { page: 1, limit: 8 },
    enableCache: true,
    cacheTime: 5 * 60 * 1000,
  });

  const handleChangeCategory = (event, newValue) => {
    setSelectedCategoryIndex(newValue);
  };

  return (
    <>
      <HomeSlider />
      <HomeCategorySlider />

      {/* Popular Products Section */}
      <section className="py-6 md:py-8 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4">
            <div className="leftSec w-full md:w-[40%] md:pl-5">
              <h2 className="font-semibold text-[18px] md:text-[20px]">
                Popular Products
              </h2>
              <p className="font-normal text-[13px] md:text-[14px] text-gray-600">
                Do not miss the current offers until the end of{' '}
                {new Date().getFullYear()}.
              </p>
            </div>

            <div className="rightSec w-full md:w-[60%] overflow-x-auto">
              <Tabs
                value={selectedCategoryIndex}
                onChange={handleChangeCategory}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="category tabs"
                disabled={categoriesLoading}
              >
                {categoriesLoading ? (
                  <Tab label="Loading categories..." disabled />
                ) : (
                  categories.map((category, index) => (
                    <Tab key={category._id} label={category.name} />
                  ))
                )}
              </Tabs>
            </div>
          </div>

          <ProductsSlider
            items={6}
            products={products}
            loading={productsLoading}
          />
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-4 md:py-6 bg-white">
        <div className="container flex flex-col lg:flex-row gap-4 md:gap-5">
          <div className="part1 w-full lg:w-[70%]">
            <HomeBannerV2 />
          </div>
          <div className="part2 w-full lg:w-[30%] flex flex-row lg:flex-col items-center gap-4 md:gap-5 justify-between">
            {bannersLoading ? (
              // Loading skeleton
              <>
                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md"></div>
              </>
            ) : activeHomeBannersV1.length > 0 ? (
              // Render dynamic banners from API (limit to 2)
              activeHomeBannersV1
                .slice(0, 2)
                .map((banner) => (
                  <BannerBoxV2
                    key={banner._id}
                    info="right"
                    image={banner.image?.url}
                    title={banner.title}
                    price={banner.price}
                    catId={banner.catId?._id}
                    subCatId={banner.subCatId?._id}
                    thirdSubCatId={banner.thirdSubCatId?._id}
                  />
                ))
            ) : bannersError ? (
              <p className="text-sm text-red-500">Failed to load banners</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Free Shipping Section */}
      <section className="py-4 md:pt-6 bg-white">
        <div className="container">
          <div
            className="freeShipping w-full md:w-[90%] lg:w-[80%] mx-auto py-3 md:py-4 px-3 md:p-4 border-2 border-primary 
                    flex flex-col md:flex-row items-center gap-3 md:gap-4 justify-between rounded-md mb-4 md:mb-7"
          >
            <div className="col1 flex items-center gap-3 md:gap-4">
              <LiaShippingFastSolid className="text-[40px] md:text-[50px] text-primary" />
              <span className="text-[16px] md:text-[20px] font-semibold uppercase">
                Free Shipping
              </span>
            </div>

            <div className="col2 text-center md:text-left">
              <p className="mb-0 font-medium text-[13px] md:text-[14px]">
                Free Delivery Now On Your First Order and over $200
              </p>
            </div>

            <p className="font-bold text-[24px] md:text-[30px] text-primary">
              - Only $200*
            </p>
          </div>

          {/* <AdsBannerSliderV2 items={4} /> */}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-4 md:py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[18px] md:text-[20px] mb-2">
            Latest Products
          </h2>
          <ProductsSlider
            items={6}
            products={latestProducts}
            loading={latestProductsLoading}
          />

          <AdsBannerSlider items={3} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-4 md:py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[18px] md:text-[20px] mb-2">
            Featured Products
          </h2>
          <ProductsSlider
            items={6}
            products={featuredProducts}
            loading={featuredProductsLoading}
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-4 md:py-5 pt-0 bg-white blogSection">
        <div className="container">
          <h2 className="font-semibold text-[18px] md:text-[20px] mb-4">
            From The Blog
          </h2>

          {blogsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : hasBlogs ? (
            <div className="relative group">
              <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: '.blog-prev', nextEl: '.blog-next' }}
                spaceBetween={12}
                slidesPerView={1}
                grabCursor={true}
                touchRatio={1}
                threshold={5}
                breakpoints={{
                  480: { slidesPerView: 1.5, spaceBetween: 14 },
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                }}
              >
                {blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <BlogItem blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation */}
              <NavButton
                direction="prev"
                className="blog-prev hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
                small
              />
              <NavButton
                direction="next"
                className="blog-next hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
                small
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No blogs available</p>
          )}
        </div>
      </section>
    </>
  );
};

const NavButton = ({ direction, className, small }) => {
  const isPrev = direction === 'prev';
  return (
    <button
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
      className={`
        ${className}
        absolute top-1/2 -translate-y-1/2 z-10
        ${isPrev ? 'left-1 sm:left-2 md:left-4' : 'right-1 sm:right-2 md:right-4'}
        flex items-center justify-center
        rounded-full bg-white text-gray-800 shadow-md border border-gray-100
        transition-all hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-400
        ${small ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11'}
      `}
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

export default Home;
