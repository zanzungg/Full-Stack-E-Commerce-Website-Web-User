import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../Search';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import Navigation from './Navigation';
import { MyContext } from '../../App';
import { Button } from '@mui/material';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import { IoBagCheckOutline } from 'react-icons/io5';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineSettings } from 'react-icons/md';

// Import useAuth và useAuthContext
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';

// Custom Styled Badge
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  // Sử dụng AuthContext và useAuth
  const { user, isAuthenticated } = useAuthContext();
  const { logout, loading } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  const handleMenuClick = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <header className="bg-white">
      {/* Top Strip */}
      <div className="top-strip py-2.5 border-t border-b border-gray-200 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="w-[50%]">
              <p className="text-[13px] font-medium text-gray-600">
                🎉 Get up to 50% off new season style, limited time only!
              </p>
            </div>
            <div className="flex items-center justify-end">
              <ul className="flex items-center gap-4">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-[13px] link font-medium transition hover:text-primary"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="list-none">
                  <span className="text-gray-300">|</span>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-[13px] link font-medium transition hover:text-primary"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header py-5 border-b border-gray-200">
        <div className="container flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="w-[25%]">
            <Link
              to="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <img src="/logo.jpg" alt="ClassyShop Logo" className="h-11" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-[50%]">
            <Search />
          </div>

          {/* User Actions */}
          <div className="w-[25%] flex items-center">
            <ul className="flex items-center justify-end w-full gap-2 pl-8">
              {!isAuthenticated ? (
                <li className="list-none flex items-center gap-2 text-[14px] font-medium">
                  <Link
                    to="/login"
                    className="link transition hover:text-primary px-3 py-1.5 rounded-md hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/register"
                    className="link transition hover:text-primary px-3 py-1.5 rounded-md hover:bg-gray-50"
                  >
                    Register
                  </Link>
                </li>
              ) : (
                <>
                  <Button
                    className="myAccountWrap flex items-center gap-2.5 cursor-pointer"
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    disabled={loading}
                    sx={{
                      textTransform: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                    }}
                  >
                    <div
                      className="w-10 h-10 min-w-10 rounded-full
                          bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center
                          border border-primary/20"
                    >
                      <FaRegUser className="text-[15px] text-primary" />
                    </div>

                    <div className="info flex flex-col items-start">
                      <h4 className="text-[14px] text-gray-900 mb-0 font-semibold capitalize leading-tight">
                        {user?.name || 'User'}
                      </h4>
                      <span className="text-[12px] text-gray-500 normal-case leading-tight mt-0.5">
                        {user?.email?.split('@')[0] || 'user'}@...
                      </span>
                    </div>
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                          mt: 2,
                          minWidth: 220,
                          borderRadius: '12px',
                          border: '1px solid rgba(0,0,0,0.08)',
                          '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1.5,
                            borderRadius: '8px',
                            mx: 1,
                            my: 0.5,
                            '&:hover': {
                              backgroundColor: 'rgba(255, 82, 82, 0.08)',
                            },
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 20,
                            width: 12,
                            height: 12,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRight: 0,
                            borderBottom: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleMenuClick('/my-account')}>
                      <ListItemIcon>
                        <FaRegUser fontSize="small" className="text-gray-600" />
                      </ListItemIcon>
                      <span className="text-[14px] font-medium text-gray-700">
                        My Account
                      </span>
                    </MenuItem>

                    <MenuItem onClick={() => handleMenuClick('/my-wishlist')}>
                      <ListItemIcon>
                        <FaRegHeart
                          fontSize="small"
                          className="text-gray-600"
                        />
                      </ListItemIcon>
                      <span className="text-[14px] font-medium text-gray-700">
                        My Wishlist
                      </span>
                    </MenuItem>

                    <MenuItem onClick={() => handleMenuClick('/my-orders')}>
                      <ListItemIcon>
                        <IoBagCheckOutline
                          fontSize="small"
                          className="text-gray-600"
                        />
                      </ListItemIcon>
                      <span className="text-[14px] font-medium text-gray-700">
                        My Orders
                      </span>
                    </MenuItem>

                    <MenuItem onClick={() => handleMenuClick('/settings')}>
                      <ListItemIcon>
                        <MdOutlineSettings
                          fontSize="small"
                          className="text-gray-600"
                        />
                      </ListItemIcon>
                      <span className="text-[14px] font-medium text-gray-700">
                        Settings
                      </span>
                    </MenuItem>

                    <Divider sx={{ my: 1, mx: 1 }} />

                    <MenuItem onClick={handleLogout} disabled={loading}>
                      <ListItemIcon>
                        <IoLogOutOutline
                          fontSize="small"
                          className="text-red-500"
                        />
                      </ListItemIcon>
                      <span className="text-[14px] font-medium text-red-500">
                        {loading ? 'Logging out...' : 'Logout'}
                      </span>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* Wishlist */}
              <li>
                <Tooltip title="Wishlist" arrow placement="bottom">
                  <IconButton
                    aria-label="wishlist"
                    onClick={() => navigate('/my-wishlist')}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 82, 82, 0.08)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <StyledBadge badgeContent={0} color="secondary">
                      <FaRegHeart size={21} className="text-gray-700" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {/* Cart */}
              <li>
                <Tooltip title="Cart" arrow placement="bottom">
                  <IconButton
                    aria-label="cart"
                    onClick={() => context.setOpenCartPanel(true)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 82, 82, 0.08)',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <StyledBadge badgeContent={0} color="secondary">
                      <MdOutlineShoppingCart
                        size={23}
                        className="text-gray-700"
                      />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <Navigation />
    </header>
  );
};

export default Header;
