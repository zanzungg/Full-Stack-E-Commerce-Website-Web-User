import React from 'react';
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

const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
                Do not miss the current offers until the end of March.
              </p>
            </div>

            <div className="rightSec w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Fashion" />
                <Tab label="Electronics" />
                <Tab label="Bags" />
                <Tab label="Footwear" />
                <Tab label="Groceries" />
                <Tab label="Beauty" />
                <Tab label="Wellness" />
                <Tab label="Jewellery" />
              </Tabs>
            </div>
          </div>

          <ProductsSlider items={6} />
        </div>
      </section>

      <section className="py-6 bg-white">
        <div className="container flex gap-5">
          <div className="part1 w-[70%]">
            <HomeBannerV2 />
          </div>
          <div className="part2 w-[30%] flex items-center gap-5 justify-between flex-col">
            <BannerBoxV2
              info="right"
              image={
                'https://serviceapi.spicezgold.com/download/1760160666204_1737020916820_New_Project_52.jpg'
              }
            />
            <BannerBoxV2
              info="right"
              image={
                'https://serviceapi.spicezgold.com/download/1741664665391_1741497254110_New_Project_50.jpg'
              }
            />
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

          <AdsBannerSliderV2 items={4} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[20px]">Latest Products</h2>
          <ProductsSlider items={6} />

          <AdsBannerSlider items={2} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="font-semibold text-[20px]">Featured Products</h2>
          <ProductsSlider items={6} />

          <AdsBannerSlider items={3} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white blogSection">
        <div className="container">
          <h2 className="font-semibold text-[20px] mb-4">From The Blog</h2>
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: '.blog-prev', nextEl: '.blog-next' }}
            spaceBetween={30}
            slidesPerView={4}
            className="relative"
          >
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            {/* Navigation */}
            <NavButton direction="prev" className="blog-prev" small />
            <NavButton direction="next" className="blog-next" small />
          </Swiper>
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
