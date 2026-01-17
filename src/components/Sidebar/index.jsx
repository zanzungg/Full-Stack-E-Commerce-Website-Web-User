import { useEffect, useState, useRef } from 'react';
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
  isMobile = false,
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

  // Track previous debounced value to prevent infinite loops
  const prevDebouncedPriceRangeRef = useRef(null);

  // Update price range when user changes slider (debounced)
  useEffect(() => {
    if (!availableFilters?.priceRange) return;

    const [min, max] = debouncedPriceRange;
    const prevValue = prevDebouncedPriceRangeRef.current;

    // Only call onFilterChange if the value actually changed
    if (prevValue && prevValue[0] === min && prevValue[1] === max) {
      return;
    }

    // Update ref before calling onFilterChange
    prevDebouncedPriceRangeRef.current = [min, max];

    // Only update if different from available filters
    const currentMin = availableFilters.priceRange.minPrice;
    const currentMax = availableFilters.priceRange.maxPrice;

    // Skip if values match the current filter bounds (initial state)
    if (min === currentMin && max === currentMax && !prevValue) {
      return;
    }

    onFilterChange('priceRange', { min, max });
  }, [debouncedPriceRange, availableFilters]);

  useEffect(() => {
    if (loading) {
      setIsApplyingPriceFilter(false);
    }
  }, [loading]);

  useEffect(() => {
    if (appliedFilters?.priceRange) {
      const newMin = Number(appliedFilters.priceRange.min);
      const newMax = Number(appliedFilters.priceRange.max);

      // Only update if different from current state
      if (priceRange[0] !== newMin || priceRange[1] !== newMax) {
        setPriceRange([newMin, newMax]);
        prevDebouncedPriceRangeRef.current = [newMin, newMax];
      }
    } else if (availableFilters?.priceRange) {
      // Reset to available range if no filters applied
      const defaultMin = availableFilters.priceRange.minPrice;
      const defaultMax = availableFilters.priceRange.maxPrice;

      if (priceRange[0] !== defaultMin || priceRange[1] !== defaultMax) {
        setPriceRange([defaultMin, defaultMax]);
        prevDebouncedPriceRangeRef.current = null;
      }
    }
  }, [appliedFilters, availableFilters]);

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
    <aside className={`sidebar ${isMobile ? 'py-3 px-2' : 'py-5'}`}>
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
          <h3 className="w-full mb-3 text-[14px] md:text-[16px] font-semibold flex items-center pr-5">
            Shop by Category
            <Button
              className="w-[30px]! h-[30px]! min-w-[30px]! rounded-full! ml-auto! text-black! text-[20px]!"
              onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
            >
              {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isOpenCategoryFilter}>
            <div
              className={`scroll px-2 md:px-4 relative -left-[13px] ${isMobile ? 'max-h-[250px]' : ''}`}
            >
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
                  label={
                    <span className="text-[13px] md:text-[14px]">
                      {cat.name}
                    </span>
                  }
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
          <h3 className="w-full mb-3 text-[14px] md:text-[16px] font-semibold">
            Shop by Category
          </h3>
          <div className="px-2 md:px-4 py-6 text-center">
            <CircularProgress size={24} />
            <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      {availableFilters?.priceRange && (
        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[14px] md:text-[16px] font-semibold flex items-center pr-5">
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
              className={`px-2 md:px-2 transition-opacity ${
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
        <h3 className="w-full mb-3 text-[14px] md:text-[16px] font-semibold flex items-center pr-5">
          Filter By Rating
          <Button
            className="w-[30px]! h-[30px]! min-w-[30px]! rounded-full! ml-auto! text-black! text-[20px]!"
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            {isOpenRatingFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenRatingFilter}>
          <div className="px-2 md:px-4 -mx-2">
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
