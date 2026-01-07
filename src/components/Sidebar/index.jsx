import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../Sidebar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import useDebounce from '../../hooks/useDebounce';
import { useCategory } from '../../hooks/useCategory';

const Sidebar = ({
  availableFilters,
  appliedFilters,
  onFilterChange,
  onClearFilters,
  loading,
}) => {
  // Use category hook
  const { categories, loading: categoriesLoading } = useCategory({
    autoFetch: true,
    fetchTree: true,
    enableCache: true,
  });

  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);
  const [isApplyingPriceFilter, setIsApplyingPriceFilter] = useState(false);

  // Price range state
  const [priceRange, setPriceRange] = useState([
    availableFilters?.priceRange?.minPrice || 0,
    availableFilters?.priceRange?.maxPrice || 10000,
  ]);

  // Debounce price range to avoid too many API calls
  const debouncedPriceRange = useDebounce(priceRange, 800);

  // Update price range when availableFilters change
  useEffect(() => {
    if (!availableFilters?.priceRange) return;

    const [min, max] = debouncedPriceRange;
    onFilterChange('priceRange', { min, max });
  }, [debouncedPriceRange, availableFilters, onFilterChange]);

  useEffect(() => {
    if (loading) {
      setIsApplyingPriceFilter(false);
    }
  }, [loading]);

  useEffect(() => {
    if (appliedFilters?.priceRange) {
      setPriceRange([
        Number(appliedFilters.priceRange.min),
        Number(appliedFilters.priceRange.max),
      ]);
    }
  }, [appliedFilters]);

  const handlePriceRangeChange = (values) => {
    setIsApplyingPriceFilter(true);
    setPriceRange(values);
  };

  const handleRatingChange = (rating) => {
    const currentRating = appliedFilters?.rating;
    onFilterChange('rating', currentRating === rating ? '' : rating);
  };

  const hasActiveFilters =
    appliedFilters &&
    Object.values(appliedFilters).some(
      (value) =>
        value &&
        value !== null &&
        (typeof value === 'object' ? Object.keys(value).length > 0 : true)
    );

  return (
    <aside className="sidebar py-5">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mb-4">
          <Button
            variant="outlined"
            color="error"
            size="small"
            fullWidth
            onClick={onClearFilters}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Categories Filter */}
      {!categoriesLoading && categories.length > 0 && (
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">
            Shop by Category
            <Button
              className="w-[30px]! h-[30px]! min-w-[30px]! rounded-full! ml-auto! text-black! text-[20px]!"
              onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
            >
              {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isOpenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat._id}
                  control={
                    <Checkbox
                      size="small"
                      checked={appliedFilters?.catId === cat._id}
                      onChange={() =>
                        onFilterChange(
                          'catId',
                          appliedFilters?.catId === cat._id ? '' : cat._id
                        )
                      }
                    />
                  }
                  label={cat.name}
                  className="w-full"
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {/* Loading state for categories */}
      {categoriesLoading && (
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-semibold">
            Shop by Category
          </h3>
          <div className="px-4 py-6 text-center">
            <CircularProgress size={24} />
            <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      {availableFilters?.priceRange && (
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">
            Filter By Price
            <Button
              className="w-[30px]! h-[30px]! min-w-[30px]! rounded-full! ml-auto! text-black! text-[20px]!"
              onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
            >
              {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isOpenPriceFilter}>
            <div
              className={`px-2 transition-opacity ${
                loading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <RangeSlider
                min={availableFilters.priceRange.minPrice}
                max={availableFilters.priceRange.maxPrice}
                value={priceRange}
                onInput={handlePriceRangeChange}
                disabled={loading}
              />

              <div className="flex pt-4 pb-2 priceRange">
                <span className="text-[13px]">
                  From: <strong>${priceRange[0]}</strong>
                </span>
                <span className="text-[13px] ml-auto">
                  To: <strong>${priceRange[1]}</strong>
                </span>
              </div>

              {isApplyingPriceFilter && !loading && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <CircularProgress size={14} />
                  <span className="text-[12px] text-gray-500">
                    Applying filter...
                  </span>
                </div>
              )}

              {loading && (
                <p className="text-[11px] text-gray-400 text-center mt-1">
                  Updating results...
                </p>
              )}
            </div>
          </Collapse>
        </div>
      )}

      {/* Rating Filter */}
      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[16px] font-semibold flex items-center pr-5">
          Filter By Rating
          <Button
            className="w-[30px]! h-[30px]! min-w-[30px]! rounded-full! ml-auto! text-black! text-[20px]!"
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            {isOpenRatingFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenRatingFilter}>
          <div className="px-4 -mx-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const value = rating.toString();

              return (
                <label
                  key={rating}
                  className="w-full hover:bg-gray-50 p-1 rounded flex items-center gap-2"
                >
                  <Checkbox
                    size="small"
                    checked={appliedFilters?.rating === value}
                    onChange={() => handleRatingChange(value)}
                  />

                  <Rating
                    name={`rating-${rating}`}
                    value={rating}
                    size="small"
                    readOnly
                    sx={{ pointerEvents: 'none' }}
                  />
                </label>
              );
            })}
          </div>
        </Collapse>
      </div>
    </aside>
  );
};

export default Sidebar;
