import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const categories = [
  { name: "Fashion", icon: "https://serviceapi.spicezgold.com/download/1761905882455_file_1734525204708_fash.png" },
  { name: "Electronics", icon: "https://serviceapi.spicezgold.com/download/1761905929738_file_1734525218436_ele.png" },
  { name: "Bags", icon: "https://serviceapi.spicezgold.com/download/1761905971086_file_1734525231018_bag.png" },
  { name: "Footwear", icon: "https://serviceapi.spicezgold.com/download/1761905982766_file_1734525239704_foot.png" },
  { name: "Groceries", icon: "https://serviceapi.spicezgold.com/download/1761905996339_file_1734525248057_gro.png" },
  { name: "Beauty", icon: "https://serviceapi.spicezgold.com/download/1761906005923_file_1734525255799_beauty(1).png" },
  { name: "Wellness", icon: "https://serviceapi.spicezgold.com/download/1761906015678_file_1734525275367_well.png" },
  { name: "Jewellery", icon: "https://serviceapi.spicezgold.com/download/1761906025549_file_1734525286186_jw.png" },
];

const HomeCategorySlider = memo(() => {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4 relative">
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: ".cat-prev", nextEl: ".cat-next" }}
          spaceBetween={16}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={i}>
              <div className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:border-red-500 hover:shadow-md">
                <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="h-12 w-12 object-contain"
                    loading="lazy"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/60?text=Icon")
                    }
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 transition-colors group-hover:text-red-500 md:text-[15px]">
                  {cat.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <NavButton direction="prev" className="cat-prev left-1" small />
        <NavButton direction="next" className="cat-next right-1" small />
      </div>
    </section>
  );
});

const NavButton = ({ direction, className, small }) => {
  const isPrev = direction === "prev";
  return (
    <button
      className={`${className} absolute top-1/2 z-10 -translate-y-1/2 flex ${
        small ? "h-8 w-8" : "h-11 w-11"
      } items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition-all hover:bg-red-500 hover:text-white`}
    >
      <svg
        className={`${small ? "h-4 w-4" : "h-5 w-5"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
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

export default HomeCategorySlider;
