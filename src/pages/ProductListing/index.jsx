import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../components/ProductItem';
import ProductItemListView from '../../components/ProductItemListView';
import ProductLoading from '../../components/ProductLoading';
import { Button, CircularProgress, Drawer, IconButton } from '@mui/material';
import { IoGrid } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import { MdFilterList, MdClose } from 'react-icons/md';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { useCategories } from '../../contexts/CategoryContext';
import { useProductListing } from '../../hooks/useProduct';
import { cleanQueryParams } from '../../utils/query';
import './style.css';

const ProductListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { categories } = useCategories();

  // Derive currentPage and sortBy from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sort') || 'name_asc';

  // Build queryParams from searchParams
  const rawParams = {
    page: currentPage,
    limit: 12,
    sort: sortBy,
    search: searchParams.get('search'),
    category: searchParams.get('category'),
    catId: searchParams.get('catId'),
    subCatId: searchParams.get('subCatId'),
    thirdSubCatId: searchParams.get('thirdSubCatId'),
    brand: searchParams.get('brand'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    rating: searchParams.get('rating'),
    inStock: searchParams.get('inStock'),
    productRam: searchParams.get('productRam'),
    productSize: searchParams.get('productSize'),
    productWeight: searchParams.get('productWeight'),
  };

  const queryParams = cleanQueryParams(rawParams);

  // Use the hook
  const {
    products,
    loading,
    error,
    pagination: { totalPages, totalProducts },
    availableFilters,
    appliedFilters,
    refresh,
  } = useProductListing(queryParams, { autoFetch: true });

  // UI States
  const [itemView, setItemView] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileFilterToggle = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const handleMobileFilterClose = () => {
    setMobileFilterOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && itemView === 'list') {
        setItemView('grid');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemView]);

  // Handle page change
  const handlePageChange = (event, page) => {
    searchParams.set('page', page.toString());
    navigate(`/product-listing?${searchParams.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    searchParams.set('sort', sortValue);
    searchParams.set('page', '1');
    navigate(`/product-listing?${searchParams.toString()}`, { replace: true });
    handleClose();
  };

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterName, filterValue) => {
      const params = new URLSearchParams(location.search);

      if (filterName === 'catId') {
        // Khi chọn Category → reset sub levels
        params.delete('subCatId');
        params.delete('thirdSubCatId');
      }

      if (filterName === 'subCatId') {
        // Khi chọn SubCategory → reset third level
        params.delete('thirdSubCatId');
      }

      // Handle price range
      if (filterName === 'priceRange') {
        if (filterValue?.min != null && filterValue?.max != null) {
          params.set('minPrice', filterValue.min);
          params.set('maxPrice', filterValue.max);
        } else {
          params.delete('minPrice');
          params.delete('maxPrice');
        }
      } else {
        if (filterValue) {
          params.set(filterName, filterValue);
        } else {
          params.delete(filterName);
        }
      }

      params.set('page', '1');
      navigate(`/product-listing?${params.toString()}`, { replace: true });
    },
    [location.search, navigate]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams();

    ['catId', 'subCatId', 'thirdSubCatId'].forEach((key) => {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    });

    params.set('sort', 'name_asc');
    params.set('page', '1');

    navigate(`/product-listing?${params.toString()}`, { replace: true });
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
          {/* Desktop Sidebar */}
          <div className="sidebarWrapper w-[20%] h-full bg-white hidden lg:block">
            <Sidebar
              availableFilters={availableFilters}
              appliedFilters={appliedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              loading={loading}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="left"
            open={mobileFilterOpen}
            onClose={handleMobileFilterClose}
            className="lg:hidden"
            keepMounted={true}
            PaperProps={{
              sx: {
                width: '85%',
                maxWidth: '320px',
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <div className="p-4 flex items-center justify-between border-b mobile-filter-header">
              <h2 className="text-lg font-bold">Filters</h2>
              <IconButton onClick={handleMobileFilterClose}>
                <MdClose size={24} />
              </IconButton>
            </div>
            <div className="overflow-y-auto">
              <Sidebar
                availableFilters={availableFilters}
                appliedFilters={appliedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => {
                  handleClearFilters();
                  handleMobileFilterClose();
                }}
                loading={loading}
                isMobile={true}
              />
            </div>
          </Drawer>

          <div className="rightContent w-full lg:w-[80%] py-3">
            <div
              className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center
                        justify-between flex-wrap gap-2"
            >
              <div className="col1 flex items-center itemViewActions flex-wrap gap-2">
                {/* Mobile Filter Button - Only on Mobile */}
                <Button
                  sx={{
                    display: { xs: 'inline-flex', lg: 'none' },
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '50%',
                    bgcolor: 'white',
                    color: 'rgba(0,0,0,0.7)',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                  onClick={handleMobileFilterToggle}
                >
                  <MdFilterList className="text-[20px]" />
                </Button>

                {/* List View Button - Only on Desktop */}
                <Button
                  sx={{
                    display: { xs: 'none', lg: 'inline-flex' },
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '50%',
                    bgcolor: itemView === 'list' ? '#ef4444' : 'white',
                    color: itemView === 'list' ? 'white' : 'rgba(0,0,0,0.7)',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor:
                        itemView === 'list' ? '#b71c1c' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                  onClick={() => setItemView('list')}
                >
                  <LuMenu className="text-[18px]" />
                </Button>

                {/* Grid View Button - Always Visible */}
                <Button
                  sx={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '50%',
                    bgcolor: itemView === 'grid' ? '#ef4444' : 'white',
                    color: itemView === 'grid' ? 'white' : 'rgba(0,0,0,0.7)',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor:
                        itemView === 'grid' ? '#b71c1c' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                  onClick={() => setItemView('grid')}
                >
                  <IoGrid className="text-[18px]" />
                </Button>

                <span className="text-[12px] md:text-[14px] font-medium pl-1 md:pl-3 text-[rgba(0,0,0,0.7)]">
                  {loading ? 'Loading...' : `Showing ${totalProducts} results`}
                </span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-1 md:gap-3 pr-2 md:pr-4">
                <span className="hidden md:inline text-[12px] md:text-[14px] font-medium text-[rgba(0,0,0,0.7)]">
                  Sort By
                </span>
                <Button
                  id="basic-button"
                  onClick={handleClick}
                  className="bg-white! text-[11px] md:text-[12px]! text-black! capitalize! border-2 border-[#ccc]! font-semibold! px-2 md:px-4!"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
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
                  onClick={refresh}
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
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-1'
                } gap-2 md:gap-4`}
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
