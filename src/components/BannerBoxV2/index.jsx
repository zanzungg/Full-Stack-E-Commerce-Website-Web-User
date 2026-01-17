import '../BannerBoxV2/style.css';
import { Link } from 'react-router-dom';

const BannerBoxV2 = (props) => {
  const {
    image = '',
    title = '',
    price = 90,
    info = 'right',
    link = '/',
    subCatId,
  } = props;

  // Generate dynamic link based on category structure using query params
  const generateLink = () => {
    const params = new URLSearchParams();

    if (subCatId) {
      params.set('subCatId', subCatId);
      return `/product-listing?${params.toString()}`;
    }

    return link;
  };

  return (
    <div className="bannerBoxV2 w-full overflow-hidden rounded-md group relative">
      {/* Banner Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-all duration-150 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/fallback-banner.jpg';
        }}
        style={{ minHeight: '180px', maxHeight: '240px' }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent z-10"></div>

      {/* Info Section */}
      <div
        className={`info absolute top-0 ${
          info === 'left' ? 'left-0' : 'right-0'
        } 
                w-[50%] sm:w-[50%] md:w-[50%] h-full z-20 
                p-3 sm:p-4 md:p-5 
                flex flex-col justify-center
                ${info === 'left' ? 'items-start' : 'items-start'}
                gap-1 sm:gap-1.5 md:gap-2`}
      >
        <h2 className="text-white text-[11px] sm:text-[13px] md:text-[16px] lg:text-[18px] font-semibold leading-tight line-clamp-2 drop-shadow-md">
          {title}
        </h2>

        <span className="text-red-400 text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] font-bold drop-shadow-md">
          ${price}
        </span>

        <div className="mt-0.5 sm:mt-1">
          <Link
            to={generateLink()}
            className="text-white text-[11px] sm:text-[13px] md:text-[16px] lg:text-[18px] font-semibold underline underline-offset-2 hover:text-red-400 transition-colors duration-200 inline-block active:opacity-70 drop-shadow-md"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBoxV2;
