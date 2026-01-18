import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMenuSharp, IoCloseSharp } from 'react-icons/io5';
import { FaRegUser, FaRegHeart } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoLogOutOutline } from 'react-icons/io5';
import { IoBagCheckOutline, IoSettingsOutline } from 'react-icons/io5';
import { Drawer, IconButton, Badge, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CategoryPanel from './CategoryPanel';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -2,
    top: 4,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    fontSize: '10px',
    fontWeight: 600,
  },
}));

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, isAuthenticated } = useAuth();
  const { user } = useUser();
  const { cartSummary } = useCart();
  const { wishlistCount } = useWishlist();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="mobile-menu-btn lg:hidden">
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{
            p: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 82, 82, 0.08)',
            },
          }}
        >
          <IoMenuSharp size={26} className="text-gray-700" />
        </IconButton>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: '320px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        <div className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Menu</h3>
              <IconButton
                onClick={toggleDrawer(false)}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <IoCloseSharp size={22} className="text-gray-600" />
              </IconButton>
            </div>
          </div>

          {/* User Info */}
          {isAuthenticated && user ? (
            <div className="p-4 bg-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-linear-to-br from-red-100 to-orange-100
                            flex items-center justify-center border-2 border-red-200"
                >
                  <FaRegUser className="text-primary text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 capitalize truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white border-b border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="flex-1 py-2 px-4 text-sm font-medium text-primary border border-primary
                           rounded-lg hover:bg-red-50 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="flex-1 py-2 px-4 text-sm font-medium text-white bg-primary
                           rounded-lg hover:bg-red-600 transition-all"
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4">
              {/* Categories */}
              <button
                onClick={() => setIsCategoryOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg
                         hover:bg-gray-50 transition-all mb-2"
              >
                <span className="text-sm font-medium text-gray-700">
                  Categories
                </span>
                <IoMenuSharp size={18} className="text-gray-500" />
              </button>

              {/* Shop Cart */}
              <button
                onClick={() => handleNavClick('/cart')}
                className={`w-full flex items-center justify-between p-3 rounded-lg
                         transition-all mb-2 ${
                           isActivePath('/cart')
                             ? 'bg-red-50 text-primary'
                             : 'hover:bg-gray-50 text-gray-700'
                         }`}
              >
                <div className="flex items-center gap-3">
                  <MdOutlineShoppingCart size={20} />
                  <span className="text-sm font-medium">Shopping Cart</span>
                </div>
                {cartSummary?.totalItems > 0 && (
                  <StyledBadge
                    badgeContent={cartSummary.totalItems}
                    color="secondary"
                  />
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => handleNavClick('/my-wishlist')}
                className={`w-full flex items-center justify-between p-3 rounded-lg
                         transition-all mb-2 ${
                           isActivePath('/my-wishlist')
                             ? 'bg-red-50 text-primary'
                             : 'hover:bg-gray-50 text-gray-700'
                         }`}
              >
                <div className="flex items-center gap-3">
                  <FaRegHeart size={18} />
                  <span className="text-sm font-medium">My Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <StyledBadge badgeContent={wishlistCount} color="secondary" />
                )}
              </button>

              {isAuthenticated && (
                <>
                  <Divider sx={{ my: 2 }} />

                  {/* My Account */}
                  <button
                    onClick={() => handleNavClick('/my-account')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg
                             transition-all mb-2 ${
                               isActivePath('/my-account')
                                 ? 'bg-red-50 text-primary'
                                 : 'hover:bg-gray-50 text-gray-700'
                             }`}
                  >
                    <FaRegUser size={18} />
                    <span className="text-sm font-medium">My Account</span>
                  </button>

                  {/* My Orders */}
                  <button
                    onClick={() => handleNavClick('/my-orders')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg
                             transition-all mb-2 ${
                               isActivePath('/my-orders')
                                 ? 'bg-red-50 text-primary'
                                 : 'hover:bg-gray-50 text-gray-700'
                             }`}
                  >
                    <IoBagCheckOutline size={18} />
                    <span className="text-sm font-medium">My Orders</span>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => handleNavClick('/')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg
                             hover:bg-gray-50 transition-all mb-2 text-gray-700"
                  >
                    <IoSettingsOutline size={18} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>

                  <Divider sx={{ my: 2 }} />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg
                             hover:bg-red-50 transition-all text-red-500"
                  >
                    <IoLogOutOutline size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              © 2025 ClassyShop. All rights reserved.
            </p>
          </div>
        </div>
      </Drawer>

      {/* Category Panel */}
      <CategoryPanel
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
      />
    </>
  );
};

export default MobileNav;
