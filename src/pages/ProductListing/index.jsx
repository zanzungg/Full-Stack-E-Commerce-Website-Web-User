import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../components/ProductItem';
import ProductItemListView from '../../components/ProductItemListView';
import ProductLoading from '../../components/ProductLoading';
import { Button, CircularProgress } from '@mui/material';
import { IoGrid } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { productService } from '../../api/services/productService';
import { useCategories } from '../../contexts/CategoryContext';

const ProductListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { categories } = useCategories();

  // UI States
  const [itemView, setItemView] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page')) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name_asc');
  const [availableFilters, setAvailableFilters] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build params from URL search params
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        catId: searchParams.get('catId') || '',
        subCatId: searchParams.get('subCatId') || '',
        thirdSubCatId: searchParams.get('thirdSubCatId') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        rating: searchParams.get('rating') || '',
        inStock: searchParams.get('inStock') || '',
        productRam: searchParams.get('productRam') || '',
        productSize: searchParams.get('productSize') || '',
        productWeight: searchParams.get('productWeight') || '',
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await productService.getProducts(params);

      if (response.success) {
        setProducts(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalProducts(response.pagination?.totalProducts || 0);
        setAvailableFilters(response.availableFilters || null);
        setAppliedFilters(response.appliedFilters || null);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, location.search]);

  // Fetch products on mount and when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    searchParams.set('page', page.toString());
    navigate({ search: searchParams.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1);
    searchParams.set('sort', sortValue);
    searchParams.set('page', '1');
    navigate({ search: searchParams.toString() });
    handleClose();
  };

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterName, filterValue) => {
      setCurrentPage(1);
      const newSearchParams = new URLSearchParams(location.search);

      // Handle price range
      if (filterName === 'priceRange') {
        newSearchParams.set('minPrice', filterValue.min);
        newSearchParams.set('maxPrice', filterValue.max);
      } else {
        if (filterValue) {
          newSearchParams.set(filterName, filterValue);
        } else {
          newSearchParams.delete(filterName);
        }
      }

      newSearchParams.set('page', '1');
      navigate({ search: newSearchParams.toString() });
    },
    [location.search, navigate]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
    const newSearchParams = new URLSearchParams();

    // Keep only catId, subCatId, thirdSubCatId if they exist
    const catId = searchParams.get('catId');
    const subCatId = searchParams.get('subCatId');
    const thirdSubCatId = searchParams.get('thirdSubCatId');

    if (catId) newSearchParams.set('catId', catId);
    if (subCatId) newSearchParams.set('subCatId', subCatId);
    if (thirdSubCatId) newSearchParams.set('thirdSubCatId', thirdSubCatId);

    newSearchParams.set('page', '1');
    navigate({ search: newSearchParams.toString() });
  }, [searchParams, navigate]);

  // Get sort label
  const getSortLabel = () => {
    const sortOptions = {
      name_asc: 'Name, A to Z',
      name_desc: 'Name, Z to A',
      price_asc: 'Price, Low to High',
      price_desc: 'Price, High to Low',
    };
    return sortOptions[sortBy] || 'Name, A to Z';
  };

  // Get breadcrumb trail based on current category
  const getBreadcrumbTrail = () => {
    const catId = searchParams.get('catId');
    const subCatId = searchParams.get('subCatId');
    const thirdSubCatId = searchParams.get('thirdSubCatId');
    const searchQuery = searchParams.get('search');

    const trail = [{ name: 'Home', path: '/' }];

    if (searchQuery) {
      trail.push({ name: `Search: "${searchQuery}"`, path: null });
      return trail;
    }

    // Find category hierarchy
    if (catId || subCatId || thirdSubCatId) {
      for (const cat of categories) {
        if (catId && cat._id === catId) {
          trail.push({
            name: cat.name,
            path: `/product-listing?catId=${cat._id}`,
          });
          break;
        }

        if (cat.subcategories) {
          for (const subCat of cat.subcategories) {
            if (subCatId && subCat._id === subCatId) {
              trail.push({
                name: cat.name,
                path: `/product-listing?catId=${cat._id}`,
              });
              trail.push({
                name: subCat.name,
                path: `/product-listing?subCatId=${subCat._id}`,
              });
              break;
            }

            if (subCat.subcategories) {
              for (const thirdCat of subCat.subcategories) {
                if (thirdSubCatId && thirdCat._id === thirdSubCatId) {
                  trail.push({
                    name: cat.name,
                    path: `/product-listing?catId=${cat._id}`,
                  });
                  trail.push({
                    name: subCat.name,
                    path: `/product-listing?subCatId=${subCat._id}`,
                  });
                  trail.push({
                    name: thirdCat.name,
                    path: `/product-listing?thirdSubCatId=${thirdCat._id}`,
                  });
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (trail.length === 1) {
      trail.push({ name: 'All Products', path: null });
    }

    return trail;
  };

  const breadcrumbTrail = getBreadcrumbTrail();

  return (
    <section className="py-5 pb-0">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbTrail.map((crumb, index) => {
            const isLast = index === breadcrumbTrail.length - 1;

            if (isLast || !crumb.path) {
              return (
                <span key={index} className="text-gray-700 font-medium">
                  {crumb.name}
                </span>
              );
            }

            return (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={crumb.path}
                className="link transition hover:text-primary"
              >
                {crumb.name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
      <div className="bg-white p-2 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <Sidebar
              availableFilters={availableFilters}
              appliedFilters={appliedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              loading={loading}
            />
          </div>

          <div className="rightContent w-[80%] py-3">
            <div
              className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center
                        justify-between"
            >
              <div className="col1 flex items-center itemViewActions">
                <Button
                  className={`w-10! h-10! min-w-10! rounded-full!
                                 text-black! ${
                                   itemView === 'list' && 'active'
                                 }`}
                  onClick={() => setItemView('list')}
                >
                  <LuMenu className="text-[rgba(0,0,0,0.7)] text-[18px]" />
                </Button>
                <Button
                  className={`w-10! h-10! min-w-10! rounded-full!
                                 text-black! ${
                                   itemView === 'grid' && 'active'
                                 }`}
                  onClick={() => setItemView('grid')}
                >
                  <IoGrid className="text-[rgba(0,0,0,0.7)]" />
                </Button>

                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  {loading
                    ? 'Loading...'
                    : `There ${
                        totalProducts === 1 ? 'is' : 'are'
                      } ${totalProducts} product${
                        totalProducts !== 1 ? 's' : ''
                      }.`}
                </span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  Sort By
                </span>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className="bg-white! text-[12px]! text-black! capitalize! border-2 border-black! font-semibold!"
                >
                  {getSortLabel()}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleSortChange('name_asc')}
                    className="text-[13px]! text-black! capitalize!"
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('name_desc')}
                    className="text-[13px]! text-black! capitalize!"
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('price_asc')}
                    className="text-[13px]! text-black! capitalize!"
                  >
                    Price, Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('price_desc')}
                    className="text-[13px]! text-black! capitalize!"
                  >
                    Price, High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                {[...Array(12)].map((_, index) => (
                  <ProductLoading key={index} />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-10">
                <p className="text-red-500 text-lg">{error}</p>
                <Button
                  onClick={fetchProducts}
                  className="mt-4 bg-blue-500! text-white!"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && products.length > 0 && (
              <div
                className={`grid ${
                  itemView === 'grid'
                    ? 'grid-cols-4 md:grid-cols-5'
                    : 'grid-cols-1 md:grid-cols-1'
                } gap-4`}
              >
                {itemView === 'grid'
                  ? products.map((product) => (
                      <ProductItem key={product._id} product={product} />
                    ))
                  : products.map((product) => (
                      <ProductItemListView
                        key={product._id}
                        product={product}
                      />
                    ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center mt-10">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showFirstButton
                  showLastButton
                  color="primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
