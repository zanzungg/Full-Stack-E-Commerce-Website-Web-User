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
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="leftSec w-[40%] pl-5">
              <h2 className="font-semibold text-[20px]">Popular Products</h2>
              <p className="font-normal text-[14px]">
                Do not miss the current offers until the end of{' '}
                {new Date().getFullYear()}.
              </p>
            </div>

            <div className="rightSec w-[60%]">
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
      <section className="py-6 bg-white">
        <div className="container flex gap-5">
          <div className="part1 w-[70%]">
            <HomeBannerV2 />
          </div>
          <div className="part2 w-[30%] flex items-center gap-5 justify-between flex-col">
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
      <section className="py-4 pt-6 bg-white">
        <div className="container">
          <div
            className="freeShipping w-[80%] mx-auto py-4 p-4 border-2 border-primary flex items-center 
                    justify-between rounded-md mb-7"
          >
            <div className="col1 flex items-center gap-4">
              <LiaShippingFastSolid className="text-[50px]" />
              <span className="text-[20px] font-semibold uppercase">
                Free Shipping
              </span>
            </div>

            <div className="col2">
              <p className="mb-0 font-medium">
                Free Delivery Now On Your First Order and over $200
              </p>
            </div>

            <p className="font-bold text-[30px]">- Only $200*</p>
          </div>

          {/* <AdsBannerSliderV2 items={4} /> */}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[20px]">Latest Products</h2>
          <ProductsSlider
            items={6}
            products={latestProducts}
            loading={latestProductsLoading}
          />

          <AdsBannerSlider items={3} />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[20px]">Featured Products</h2>
          <ProductsSlider
            items={6}
            products={featuredProducts}
            loading={featuredProductsLoading}
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-5 pt-0 bg-white blogSection">
        <div className="container">
          <h2 className="font-semibold text-[20px] mb-4">From The Blog</h2>

          {blogsLoading ? (
            <div className="grid grid-cols-4 gap-6">
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
            <div className="relative">
              <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: '.blog-prev', nextEl: '.blog-next' }}
                spaceBetween={30}
                slidesPerView={4}
              >
                {blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <BlogItem blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation */}
              <NavButton direction="prev" className="blog-prev" small />
              <NavButton direction="next" className="blog-next" small />
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
      className={`
        ${className}
        absolute top-1/2 -translate-y-1/2 z-10
        ${isPrev ? 'left-4' : 'right-4'}  // ← căn vị trí
        flex items-center justify-center
        rounded-full bg-white text-gray-800 shadow-md
        transition-all hover:bg-red-500 hover:text-white
        ${small ? 'h-8 w-8' : 'h-11 w-11'}
      `}
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

export default Home;
