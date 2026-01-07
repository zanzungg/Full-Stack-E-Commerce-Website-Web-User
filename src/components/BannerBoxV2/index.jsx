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
      <img
        src={image}
        alt={title}
        className="w-full transition-all duration-150 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/fallback-banner.jpg';
        }}
      />

      <div
        className={`info absolute p-5 top-0 ${
          info === 'left' ? 'left-0' : 'right-0'
        } 
                w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2
                ${info === 'left' ? '' : 'pl-20'}`}
      >
        <h2 className="text-[16px] font-semibold">{title}</h2>
        <span className="text-[20px] text-primary font-semibold w-full">
          ${price}
        </span>
        <div className="w-full">
          <Link to={generateLink()} className="text-[18px] font-semibold link">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBoxV2;
