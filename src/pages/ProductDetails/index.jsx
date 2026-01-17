import { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';

import ProductZoom from '../../components/ProductZoom';
import ProductsSlider from '../../components/ProductsSlider';
import ProductDetailsComponent from '../../components/ProductDetails';
import Reviews from './reviews';

import {
  useProductDetail,
  useProductsByCategory,
} from '../../hooks/useProduct';

const ProductDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  /* ---------- Product detail ---------- */
  const { product, productLoading, error } = useProductDetail(id);

  /* ---------- Related products ---------- */
  const { products: relatedProducts, productsLoading: relatedLoading } =
    useProductsByCategory(product?.catId, {
      autoFetch: !!product?.catId,
      params: { page: 1, limit: 8 },
    });

  // Loading state
  if (productLoading) {
    return (
      <div className="py-20">
        <div className="container">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {error || 'Product not found'}
            </h2>
            <Link to="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-3 md:py-5">
        <div className="container px-3 md:px-4">
          <Breadcrumbs aria-label="breadcrumb" className="text-xs md:text-sm">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition"
            >
              Home
            </Link>
            {product.catName && (
              <Link
                underline="hover"
                color="inherit"
                to={`/product-listing?catId=${product.catId}`}
                className="link transition"
              >
                {product.catName}
              </Link>
            )}
            <span className="text-gray-600">{product.name}</span>
          </Breadcrumbs>
        </div>
      </div>

      <section className="bg-white py-3 md:py-5">
        <div className="container px-3 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-start">
            <div className="productZoomContainer w-full lg:w-[40%]">
              <ProductZoom images={product.images || []} />
            </div>

            <div className="productContent w-full lg:w-[60%] lg:pr-10 lg:pl-10">
              <ProductDetailsComponent product={product} />
            </div>
          </div>
        </div>

        <div className="container pt-6 md:pt-8 px-3 md:px-4">
          <div className="flex items-center gap-4 md:gap-8 mb-4 md:mb-5 overflow-x-auto">
            <span
              className={`link text-[15px] md:text-[17px] cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 0 && 'text-primary'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`link text-[15px] md:text-[17px] cursor-pointer font-medium whitespace-nowrap ${
                activeTab === 1 && 'text-primary'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Reviews ({product.reviews?.length || 0})
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full py-4 md:py-5 px-4 md:px-8 rounded-md">
              <p className="whitespace-pre-line text-sm md:text-base">
                {product.description || 'No description available.'}
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <Reviews
              reviews={product.reviews || []}
              productId={product._id}
              rating={product.rating}
            />
          )}
        </div>

        <div className="container pt-6 md:pt-8 px-3 md:px-4">
          <h2 className="font-semibold text-[18px] md:text-[20px] pb-0 mb-2">
            Related Products
          </h2>
          <ProductsSlider
            items={6}
            products={relatedProducts}
            loading={relatedLoading}
          />
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
