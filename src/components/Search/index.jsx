import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useProductSearch } from '../../hooks/useProduct';
import useDebounce from '../../hooks/useDebounce';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 500);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const {
    searchResults,
    searching,
    hasResults,
    isEmpty,
    error: searchError,
    pagination,
  } = useProductSearch(debouncedSearch, {
    autoFetch: true,
    params: { page: 1, limit: 6 },
    minSearchLength: 2,
  });

  // Show dropdown when there are results or searching
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearch, hasResults, searching]);

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

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (searchInput.trim().length >= 2) {
      navigate(
        `/product-listing?search=${encodeURIComponent(searchInput.trim())}`
      );
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
    setShowDropdown(false);
    setSearchInput('');
  };

  const handleViewAllResults = () => {
    navigate(
      `/product-listing?search=${encodeURIComponent(searchInput.trim())}`
    );
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="searchBox flex h-12 w-full items-center overflow-hidden rounded-md bg-gray-100">
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search for products..."
          className="flex-1 bg-transparent px-4 text-[15px] placeholder-gray-600 focus:outline-none"
        />

        {/* Clear Button */}
        {searchInput && (
          <Button
            onClick={handleClearSearch}
            sx={{
              minWidth: '32px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              marginRight: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <IoClose size={20} />
          </Button>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={searchInput.trim().length < 2}
          sx={{
            minWidth: '40px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4e4e4e',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:disabled': {
              color: '#9ca3af',
            },
          }}
        >
          {searching ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <IoSearch size={22} />
          )}
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && debouncedSearch.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[400px] overflow-y-auto z-50">
          {searching && (
            <div className="flex items-center justify-center py-8">
              <CircularProgress size={32} />
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
            <>
              <div className="p-2">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        '/placeholder.jpg'
                      }
                      alt={product.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      {product.brand && (
                        <p className="text-xs text-gray-500 truncate">
                          {product.brand}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-semibold text-primary">
                          ${product.price}
                        </p>
                        {product.oldPrice &&
                          product.oldPrice > product.price && (
                            <p className="text-xs text-gray-400 line-through">
                              ${product.oldPrice}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Results Button */}
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={handleViewAllResults}
                  className="w-full py-2.5 text-sm font-medium text-primary hover:bg-gray-50 rounded-md transition-colors"
                >
                  View all {pagination?.totalProducts || ''} results for "
                  {debouncedSearch}"
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
