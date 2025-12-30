import React, { useContext } from 'react';
import '../ProductItem/style.css';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';

const ProductItem = ({ product }) => {
  const context = useContext(MyContext);

  // Fallback values if product is not provided
  if (!product) return null;

  const {
    _id,
    name,
    images = [],
    brand,
    price,
    oldPrice,
    rating = 0,
    discount = 0,
  } = product;

  // Get first two images for hover effect
  const mainImage = images[0]?.url || 'https://via.placeholder.com/300';
  const hoverImage = images[1]?.url || mainImage;

  return (
    <div className="productItem group shadow-lg rounded-md border border-[rgba(0,0,0,0.1)]">
      <div className="imgWrapper w-full rounded-md relative">
        <Link to={`/product/${_id}`}>
          <div className="img h-[220px] overflow-hidden">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover"
            />

            <img
              src={hoverImage}
              alt={name}
              className="w-full h-full object-cover absolute transition-all duration-700 top-0 left-0 
                            opacity-0 group-hover:opacity-100 group-hover:scale-105"
            />
          </div>
        </Link>
        {discount > 0 && (
          <span
            className="discount flex items-center absolute top-2.5 left-2.5
                    z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-medium"
          >
            {discount}%
          </span>
        )}

        <div
          className="actions absolute top-0 -translate-y-full right-[5px] z-50 flex items-center gap-2
                 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Button
            className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
            onClick={() => context.setOpenProductDetailsModal(true)}
          >
            <MdZoomOutMap className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
          </Button>

          <Button
            className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
          >
            <IoGitCompareOutline className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
          </Button>

          <Button
            className="w-[35px]! h-[35px]! min-[35px]! rounded-full! bg-white!
                   text-black hover:bg-primary! hover:text-white group"
          >
            <FaRegHeart className="text-[18px] text-black! group-hover:text-white hover:text-white!" />
          </Button>
        </div>
      </div>

      <div className="info p-3 py-5">
        <h6 className="text-[13px]">
          <Link to={`/product/${_id}`} className="link transition-all">
            {brand || 'No Brand'}
          </Link>
        </h6>
        <h3 className="text-[13px] title mt-1 font-medium mb-1 text-black line-clamp-1">
          <Link to={`/product/${_id}`} className="link transition-all">
            {name.length > 50 ? `${name.substring(0, 50)}...` : name}
          </Link>
        </h3>

        {rating > 0 ? (
          <Rating
            name="product-rating"
            value={rating}
            size="small"
            readOnly
            precision={0.5}
          />
        ) : (
          <span className="text-xs text-gray-400">No reviews</span>
        )}

        <div className="flex items-center gap-4">
          {oldPrice > 0 && (
            <span className="oldPrice line-through text-gray-500 text-[16px] font-medium">
              ${oldPrice.toFixed(2)}
            </span>
          )}
          <span className="price text-primary font-semibold">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
