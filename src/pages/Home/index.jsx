import React, { useState, useEffect } from 'react';
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
import { useCategories } from '../../contexts/CategoryContext';
import { productService } from '../../api/services/productService';
import { homeBannerV1Service } from '../../api/services/homeBannerV1Service';
import { blogService } from '../../api/services/blogService';

const Home = () => {
  const [value, setValue] = useState(0);
  const { categories, loading } = useCategories();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [homeBannersV1, setHomeBannersV1] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [latestProducts, setLatestProducts] = useState([]);
  const [latestProductsLoading, setLatestProductsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredProductsLoading, setFeaturedProductsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch home banners V1
  useEffect(() => {
    const fetchHomeBannersV1 = async () => {
      try {
        setBannersLoading(true);
        const response = await homeBannerV1Service.getHomeBannersV1();
        if (response.success && response.data?.banners) {
          setHomeBannersV1(response.data.banners);
        }
      } catch (error) {
        console.error('Error fetching home banners V1:', error);
        setHomeBannersV1([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchHomeBannersV1();
  }, []);

  // Fetch latest products
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLatestProductsLoading(true);
        const response = await productService.getLatestProducts({
          page: 1,
          limit: 6,
        });
        if (response.success && response.data) {
          setLatestProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setLatestProducts([]);
      } finally {
        setLatestProductsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setFeaturedProductsLoading(true);
        const response = await productService.getFeaturedProducts({
          limit: 6,
        });
        if (response.success && response.data) {
          setFeaturedProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setFeaturedProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        const response = await blogService.getBlogs({
          page: 1,
          limit: 8,
        });
        if (response.success && response.data) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (categories.length === 0 || loading) return;

      const selectedCategory = categories[value];
      if (!selectedCategory) return;

      try {
        setProductsLoading(true);
        const response = await productService.getProductsByCategoryId(
          selectedCategory._id,
          { page: 1, limit: 12 }
        );
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [value, categories, loading]);

  return (
    <>
      <HomeSlider />
      <HomeCategorySlider />

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
                value={loading ? 0 : value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="category tabs"
              >
                {loading ? (
                  <Tab label="Loading categories..." disabled />
                ) : (
                  categories.map((category) => (
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
            ) : homeBannersV1.length > 0 ? (
              // Render dynamic banners from API (limit to 2)
              homeBannersV1
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
            ) : (
              // Fallback to static banners if no data
              <></>
            )}
          </div>
        </div>
      </section>

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
          ) : blogs.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: '.blog-prev', nextEl: '.blog-next' }}
              spaceBetween={30}
              slidesPerView={4}
              className="relative"
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <BlogItem blog={blog} />
                </SwiperSlide>
              ))}
              {/* Navigation */}
              <NavButton direction="prev" className="blog-prev" small />
              <NavButton direction="next" className="blog-next" small />
            </Swiper>
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
