import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../../components/ProductZoom';
import ProductsSlider from '../../components/ProductsSlider';
import ProductDetailsComponent from '../../components/ProductDetails';
import Reviews from './reviews';
import { productService } from '../../api/services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductDetails(id);
        if (response?.success && response.data?.product) {
          setProduct(response.data.product);
        } else if (response?.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.catId) return;

      try {
        setRelatedLoading(true);
        const response = await productService.getProductsByCategoryId(
          product.catId,
          { page: 1, limit: 8 }
        );
        if (response?.success && response.data) {
          const filtered = response.data.filter((p) => p._id !== product._id);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Loading state
  if (loading) {
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
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
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

      <section className="bg-white py-5">
        <div className="container flex gap-8 items-start">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom images={product.images || []} />
          </div>

          <div className="productContent w-[60%] pr-10 pl-10">
            <ProductDetailsComponent product={product} />
          </div>
        </div>

        <div className="container pt-8">
          <div className="flex items-center gap-8 mb-5">
            <span
              className={`link text-[17px] cursor-pointer font-medium ${
                activeTab === 0 && 'text-primary'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`link text-[17px] cursor-pointer font-medium ${
                activeTab === 1 && 'text-primary'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Reviews ({product.reviews?.length || 0})
            </span>
          </div>

          {activeTab === 0 && (
            <div className="shadow-md w-full py-5 px-8 rounded-md">
              <p className="whitespace-pre-line">
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

        <div className="container pt-8">
          <h2 className="font-semibold text-[20px] pb-0">Related Products</h2>
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
