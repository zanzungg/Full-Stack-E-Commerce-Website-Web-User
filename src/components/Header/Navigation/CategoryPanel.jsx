import { useState, useMemo } from 'react';
import Drawer from '@mui/material/Drawer';
import { IoCloseSharp, IoSearchOutline } from 'react-icons/io5';
import { MdTrendingUp, MdNewReleases } from 'react-icons/md';
import CategoryCollapse from '../../CategoryCollapse';
import { useCategory } from '../../../hooks/useCategory';
import { useNavigate } from 'react-router-dom';

const CategoryPanel = ({ isOpen, onClose }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Use category hook
  const { categories, loading, searchCategories } = useCategory({
    autoFetch: true,
    fetchTree: true,
    enableCache: true,
  });

  // Transform categories from API
  const mainCategories = categories.map((cat) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug,
    sub: cat.subcategories || [],
  }));

  const extraCategories = [
    { name: 'New Arrivals', icon: MdNewReleases, path: '/' },
    { name: 'Best Sellers', icon: MdTrendingUp, path: '/' },
  ];

  // Filter categories based on search query using hook method
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return mainCategories;

    const searchResults = searchCategories(searchQuery);
    // Transform search results to match expected format
    return searchResults.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      sub: cat.subcategories || [],
    }));
  }, [searchQuery, mainCategories, searchCategories]);

  const toggleSubmenu = (name) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleMainItemClick = (e, name) => {
    e.stopPropagation();
    const category = mainCategories.find((cat) => cat.name === name);
    if (category?.sub.length > 0) {
      toggleSubmenu(name);
    } else {
      onClose();
    }
  };

  const handleSubItemClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleExtraItemClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleClose = () => {
    setSearchQuery('');
    setOpenSubmenu({});
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 320,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
      transitionDuration={300}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-linear-to-r from-red-50 via-orange-50 to-white">
        <div>
          <h3 className="text-[18px] font-bold text-gray-900 mb-0.5">
            Shop By Categories
          </h3>
          <p className="text-[12px] text-gray-500 font-medium">
            {loading ? 'Loading...' : `${categories.length} categories`}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-white hover:shadow-lg transition-all duration-200 group"
          aria-label="Close menu"
        >
          <IoCloseSharp
            size={22}
            className="text-gray-600 group-hover:text-primary group-hover:rotate-90 transition-all duration-300"
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="relative group">
          <IoSearchOutline
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-[14px] border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
              aria-label="Clear search"
            >
              <IoCloseSharp
                size={16}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div
        className="w-full overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 180px)' }}
        role="presentation"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Loading categories...
              </p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <IoSearchOutline size={28} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  No categories found
                </p>
                <p className="text-xs text-gray-500">Try different keywords</p>
              </div>
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="mt-2 px-4 py-2 text-xs font-medium text-primary hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <CategoryCollapse
              mainCategories={filteredCategories}
              extraCategories={extraCategories}
              openSubmenu={openSubmenu}
              toggleSubmenu={toggleSubmenu}
              handleMainItemClick={handleMainItemClick}
              handleSubItemClick={handleSubItemClick}
              handleExtraItemClick={handleExtraItemClick}
            />

            {/* Footer Info */}
            {!searchQuery && (
              <div className="mt-4 p-4 mx-4 mb-4 bg-linear-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                <p className="text-xs text-gray-600 text-center font-medium">
                  🎉 Discover amazing products across all categories
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default CategoryPanel;
