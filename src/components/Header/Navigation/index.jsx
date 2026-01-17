import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiMenu2Fill } from 'react-icons/ri';
import { FaAngleDown } from 'react-icons/fa6';
import { GoRocket } from 'react-icons/go';
import { AiOutlineHome } from 'react-icons/ai';
import { Button } from '@mui/material';
import CategoryPanel from './CategoryPanel';
import { useCategory } from '../../../hooks/useCategory';

const Navigation = () => {
  const [isOpenCategoryPanel, setIsOpenCategoryPanel] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const location = useLocation();

  // Use category hook
  const { categories, loading } = useCategory({
    autoFetch: true,
    fetchTree: true,
    enableCache: true,
    cacheTime: 10 * 60 * 1000,
  });

  const openCategoryPanel = () => setIsOpenCategoryPanel(true);
  const closeCategoryPanel = () => setIsOpenCategoryPanel(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  // Transform categories data with safety check
  const menuItems = Array.isArray(categories)
    ? categories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        path: `/product-listing?catId=${cat._id}`,
        sub: cat.subcategories || [],
      }))
    : [];

  // Hover handlers
  const handleMouseEnter = (name) => {
    if (timeoutId) clearTimeout(timeoutId);
    setHoveredItem(name);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setHoveredItem(null);
    }, 500);
    setTimeoutId(id);
  };

  // Check if current path matches
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isActiveCategory = (slug) => {
    return location.pathname.includes(`/category/${slug}`);
  };

  return (
    <>
      <nav className="py-2 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 hidden lg:block">
        <div className="container flex items-center gap-4">
          {/* Shop By Categories */}
          <div className="w-[17%] shrink-0">
            <Button
              onClick={openCategoryPanel}
              startIcon={<RiMenu2Fill size={18} />}
              endIcon={<FaAngleDown size={13} />}
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                color: '#1a1a1a',
                gap: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 82, 82, 0.04)',
                  borderColor: 'rgba(255, 82, 82, 0.3)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(255, 82, 82, 0.15)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Shop By Categories
            </Button>
          </div>

          {/* Horizontal Menu */}
          <div className="w-[60%] flex-1">
            <ul className="flex items-center justify-start gap-0.1">
              {/* Home Button */}
              <li className="list-none">
                <Link to="/" className="link">
                  <Button
                    startIcon={<AiOutlineHome size={16} />}
                    className="normal-case"
                    sx={{
                      color: isActivePath('/') ? '#ff5252' : 'rgba(0,0,0,0.75)',
                      fontWeight: isActivePath('/') ? 600 : 500,
                      fontSize: '14px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: isActivePath('/')
                        ? 'rgba(255, 82, 82, 0.08)'
                        : 'transparent',
                      position: 'relative',
                      '&::after': isActivePath('/')
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            backgroundColor: '#ff5252',
                            borderRadius: '2px 2px 0 0',
                          }
                        : {},
                      '&:hover': {
                        color: '#ff5252',
                        backgroundColor: 'rgba(255, 82, 82, 0.08)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Home
                  </Button>
                </Link>
              </li>

              {loading ? (
                <li className="text-sm text-gray-500 py-2 px-4">
                  <div className="flex items-center gap-2">
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
                </li>
              ) : (
                menuItems.map((item) => (
                  <li
                    key={item._id}
                    className="list-none relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to={item.path} className="link">
                      <Button
                        className="normal-case"
                        sx={{
                          color: isActiveCategory(item.slug)
                            ? '#ff5252'
                            : 'rgba(0,0,0,0.75)',
                          fontWeight: isActiveCategory(item.slug) ? 600 : 500,
                          fontSize: '14px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          backgroundColor: isActiveCategory(item.slug)
                            ? 'rgba(255, 82, 82, 0.08)'
                            : 'transparent',
                          position: 'relative',
                          '&::after': isActiveCategory(item.slug)
                            ? {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '2px',
                                backgroundColor: '#ff5252',
                                borderRadius: '2px 2px 0 0',
                              }
                            : {},
                          '&:hover': {
                            color: '#ff5252',
                            backgroundColor: 'rgba(255, 82, 82, 0.08)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {item.name}
                      </Button>
                    </Link>

                    {/* Submenu */}
                    {item.sub.length > 0 && hoveredItem === item.name && (
                      <div
                        className="absolute top-full left-0 mt-1 pt-2 w-56 z-50"
                        style={{
                          animation:
                            'slideDown 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        }}
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="absolute -top-1 left-6 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45 z-10"></div>

                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                          <div className="py-2">
                            {item.sub.map((subItem, index) => (
                              <div
                                key={subItem._id}
                                style={{
                                  animation: `fadeInUp 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                                    index * 0.04
                                  }s both`,
                                }}
                              >
                                <Link
                                  to={`/product-listing?subCatId=${subItem._id}`}
                                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-linear-to-r hover:from-red-50 hover:to-orange-50 hover:text-primary transition-all duration-200 relative group"
                                  onClick={() => {
                                    setHoveredItem(null);
                                    if (timeoutId) clearTimeout(timeoutId);
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary group-hover:scale-150 transition-all duration-200"></span>
                                  <span className="flex-1">{subItem.name}</span>
                                  <span className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200 text-primary">
                                    →
                                  </span>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Free Delivery */}
          <div className="w-[23%] flex justify-end">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-linear-to-r from-red-50 to-transparent rounded-xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-300 group">
              <GoRocket
                size={20}
                className="text-primary group-hover:animate-bounce"
              />
              <p className="text-[13px] font-semibold text-gray-700 leading-tight">
                Free International
                <br />
                <span className="text-primary">Delivery</span>
              </p>
            </div>
          </div>
        </div>
      </nav>

      <CategoryPanel
        isOpen={isOpenCategoryPanel}
        onClose={closeCategoryPanel}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;
