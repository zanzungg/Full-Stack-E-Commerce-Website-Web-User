import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline, IoCloseSharp } from 'react-icons/io5';
import useDebounce from '../../hooks/useDebounce';
import { useProductSearch } from '../../hooks/useProduct';

const MobileSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    searchResults,
    searching,
    hasResults,
    isEmpty,
    error: searchError,
  } = useProductSearch(debouncedSearch, {
    autoFetch: true,
    params: { page: 1, limit: 5 },
    minSearchLength: 2,
  });

  // Show dropdown when there are results or searching
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(
        `/product-listing?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="mobileSearch bg-white border-b border-gray-200 lg:hidden">
      <div className="container py-3">
        <form onSubmit={handleSearch} className="relative" ref={searchRef}>
          <div
            className={`flex items-center bg-gray-50 rounded-lg border-2 transition-all duration-200 ${
              showDropdown ? 'border-primary shadow-md' : 'border-gray-200'
            }`}
          >
            <IoSearchOutline
              size={20}
              className={`ml-3 transition-colors ${
                showDropdown ? 'text-primary' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2.5 text-[14px] outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="mr-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <IoCloseSharp size={18} className="text-gray-500" />
              </button>
            )}
            <button
              type="submit"
              disabled={searchQuery.trim().length < 2 || searching}
              className="mr-2 px-4 py-1.5 bg-primary text-white rounded-md text-[13px] font-medium 
                       hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search suggestions dropdown */}
          {showDropdown && debouncedSearch.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
              {searching && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {!searching && searchError && (
                <div className="py-8 text-center text-red-500">
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-xs mt-1">{searchError}</p>
                </div>
              )}

              {!searching && !searchError && isEmpty && (
                <div className="py-8 text-center text-gray-500">
                  <p className="text-sm">
                    No products found for "{debouncedSearch}"
                  </p>
                  <p className="text-xs mt-1">Try different keywords</p>
                </div>
              )}

              {!searching && hasResults && (
                <div className="p-2">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={
                          product.images?.[0]?.url ||
                          product.images?.[0] ||
                          '/placeholder.jpg'
                        }
                        alt={product.name || 'Product'}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-primary font-semibold">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MobileSearch;
