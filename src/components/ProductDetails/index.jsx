import React, { useState } from 'react';
import QtyBox from '../../components/QtyBox';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';

const ProductDetailsComponent = ({ product }) => {
  const [productActionIndex, setProductActionIndex] = useState(null);

  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">No product data available</p>
      </div>
    );
  }

  const {
    name,
    brand,
    rating = 0,
    price,
    oldPrice,
    countInStock = 0,
    description,
    productSize = [],
    productRam = [],
    productWeight = [],
    reviews = [],
  } = product;

  return (
    <>
      <h1 className="text-[24px] font-semibold mb-2">{name}</h1>
      <div className="flex items-center gap-3">
        {brand && (
          <span className="text-gray-400 text-[13px]">
            Brands :
            <span className="font-medium text-black opacity-75">{brand}</span>
          </span>
        )}

        <Rating
          name="size-small"
          value={rating}
          size="small"
          readOnly
          precision={0.5}
        />
        <span className="text-[13px] cursor-pointer">
          Review ({reviews.length || 0})
        </span>
      </div>
      <div className="flex items-center gap-4 mt-4">
        {oldPrice > 0 && (
          <span className="oldPrice line-through text-gray-500 text-[20px] font-medium">
            ${oldPrice.toFixed(2)}
          </span>
        )}
        <span className="price text-primary font-semibold text-[20px]">
          ${price.toFixed(2)}
        </span>
        <span className="text-[14px]">
          Available In Stock:{' '}
          <span
            className={`text-[14px] font-bold ${
              countInStock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {countInStock > 0 ? `${countInStock} Items` : 'Out of Stock'}
          </span>
        </span>
      </div>

      <p className="mt-3 pr-10 mb-5 whitespace-pre-line">
        {description || 'No description available.'}
      </p>

      {productRam && productRam.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[16px]">RAM: </span>
          <div className="flex items-center gap-1 actions">
            {productRam.map((ram, index) => (
              <Button
                key={index}
                className={`${
                  productActionIndex === `ram-${index}`
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => setProductActionIndex(`ram-${index}`)}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>
      )}

      {productSize && productSize.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[16px]">Size: </span>
          <div className="flex items-center gap-1 actions">
            {productSize.map((s, index) => (
              <Button
                key={index}
                className={`${
                  productActionIndex === `size-${index}`
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => setProductActionIndex(`size-${index}`)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {productWeight && productWeight.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-[16px]">Weight: </span>
          <div className="flex items-center gap-1 actions">
            {productWeight.map((weight, index) => (
              <Button
                key={index}
                className={`${
                  productActionIndex === `weight-${index}`
                    ? 'bg-primary! text-white!'
                    : ''
                }`}
                onClick={() => setProductActionIndex(`weight-${index}`)}
              >
                {weight}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[14px] mt-5 mb-2">
        Free Shipping (Est. Delivery Time 2-3 Days)
      </p>

      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox />
        </div>

        <Button className="btn-org flex gap-2">
          <MdOutlineShoppingCart className="text-[22px]" />
          Add To Cart
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
          <FaRegHeart className="text-[18px]" />
          Add To Wishlist
        </span>
        <span className="flex items-center gap-2 text-[15px] link cursor-pointer font-medium">
          <IoGitCompareOutline className="text-[18px]" />
          Add To Compare
        </span>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
