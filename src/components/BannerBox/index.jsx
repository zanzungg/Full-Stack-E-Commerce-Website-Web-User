import { Link } from 'react-router-dom';

const BannerBox = ({ img, link = '/', ...props }) => {
  return (
    <div className="box bannerBox rounded-lg overflow-hidden group" {...props}>
      <Link to={link}>
        <img
          src={img}
          alt="Banner"
          className="w-full transition-all group-hover:scale-105 group-hover:rotate-1
           h-auto object-contain bg-gray-50"
          loading="lazy"
        />
      </Link>
    </div>
  );
};

export default BannerBox;
