import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from 'react-icons/io5';
import CategoryCollapse from '../../CategoryCollapse';
import { useCategories } from '../../../contexts/CategoryContext';

const CategoryPanel = ({ isOpen, onClose }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});
  const { categories, loading } = useCategories();

  // Transform categories từ API
  const mainCategories = categories.map((cat) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug,
    sub: cat.subcategories || [],
  }));

  const extraCategories = ['New Arrivals', 'Best Sellers'];

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

  const handleExtraItemClick = () => {
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-white">
        <h3 className="text-[17px] font-bold text-gray-900">
          Shop By Categories
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
          aria-label="Close menu"
        >
          <IoCloseSharp size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Danh sách danh mục - sử dụng component con */}
      <div className="w-full" role="presentation">
        {loading ? (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Loading categories...
              </p>
            </div>
          </div>
        ) : (
          <CategoryCollapse
            mainCategories={mainCategories}
            extraCategories={extraCategories}
            openSubmenu={openSubmenu}
            toggleSubmenu={toggleSubmenu}
            handleMainItemClick={handleMainItemClick}
            handleSubItemClick={handleSubItemClick}
            handleExtraItemClick={handleExtraItemClick}
          />
        )}
      </div>
    </Drawer>
  );
};

export default CategoryPanel;
