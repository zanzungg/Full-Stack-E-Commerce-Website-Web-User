import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { Button } from "@mui/material";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import { IoBagCheckOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";

// Custom Styled Badge
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    context.setIsLogin(false);
    context.openAlertBox("success", "Logged out successfully!");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleMenuClick = (path) => {
    handleClose();
    navigate(path);
  };

  return (
    <header className="bg-white">
      {/* Top Strip */}
      <div className="top-strip py-2 border-t border-b border-gray-250">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="w-[50%]">
              <p className="text-[12px] font-medium text-gray-700">
                Get up to 50% off new season style, limited time only.
              </p>
            </div>
            <div className="flex items-center justify-end">
              <ul className="flex items-center gap-3">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-[13px] link font-medium transition"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-[13px] link font-medium transition"
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
      <div className="header py-4 border-b border-gray-250">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <div className="w-[25%]">
            <Link to="/">
              <img src="/logo.jpg" alt="ClassyShop Logo" className="h-10" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-[40%]">
            <Search />
          </div>

          {/* User Actions */}
          <div className="w-[35%] flex items-center">
            <ul className="flex items-center justify-end w-full gap-3 pl-10">
              {
                context.isLogin === false ?
                  (
                    <li className="list-none flex items-center gap-1 text-[15px] font-medium">
                      <Link to="/login" className="link transition">
                        Login
                      </Link>
                      <span className="text-gray-400">|</span>
                      <Link to="/register" className="link transition">
                        Register
                      </Link>
                    </li>
                  )
                :
                  (
                    <>
                      <Button 
                        className="myAccountWrap flex items-center gap-3 cursor-pointer"
                        onClick={handleClick}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <div className="w-10! h-10! min-w-10! rounded-full!
                          bg-[#f1f1f1]! flex items-center justify-center">
                          <FaRegUser className="text-[16px] text-[rgba(0,0,0,0.7)]"/>
                        </div>

                        <div className="info flex flex-col">
                          <h4 className="leading-3 text-[14px] text-black mb-0 font-semibold capitalize text-left justify-start">
                            Rinku Verma
                          </h4>
                          <span className="text-[13px] text-black normal-case text-left justify-start">
                            example@example.com
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
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              minWidth: 200,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={() => handleMenuClick('/my-account')}>
                          <ListItemIcon>
                            <FaRegUser fontSize="small" />
                          </ListItemIcon>
                          <span className="text-[13px]">My Account</span>
                        </MenuItem>

                        <MenuItem onClick={() => handleMenuClick('/orders')}>
                          <ListItemIcon>
                            <IoBagCheckOutline fontSize="small" />
                          </ListItemIcon>
                          <span className="text-[13px]">Orders</span>
                        </MenuItem>

                        <MenuItem onClick={() => handleMenuClick('/wishlist')}>
                          <ListItemIcon>
                            <FaRegHeart fontSize="small" />
                          </ListItemIcon>
                          <span className="text-[13px]">My Wishlist</span>
                        </MenuItem>

                        <MenuItem onClick={() => handleMenuClick('/settings')}>
                          <ListItemIcon>
                            <MdOutlineSettings fontSize="small" />
                          </ListItemIcon>
                          <span className="text-[13px]">Settings</span>
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                          <ListItemIcon>
                            <IoLogOutOutline fontSize="small" />
                          </ListItemIcon>
                          <span className="text-[13px]">Logout</span>
                        </MenuItem>
                      </Menu>
                    </>
                  )
              }              

              {/* Compare */}
              <li>
                <Tooltip title="Compare" arrow>
                  <IconButton 
                    aria-label="compare"
                    onClick={() => navigate('/compare')}
                  >
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoGitCompareOutline size={20} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {/* Wishlist */}
              <li>
                <Tooltip title="Wishlist" arrow>
                  <IconButton 
                    aria-label="wishlist"
                    onClick={() => navigate('/wishlist')}
                  >
                    <StyledBadge badgeContent={4} color="secondary">
                      <FaRegHeart size={20} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {/* Cart */}
              <li>
                <Tooltip title="Cart" arrow>
                  <IconButton 
                    aria-label="cart" 
                    onClick={() => context.setOpenCartPanel(true)}
                  >
                    <StyledBadge badgeContent={4} color="secondary">
                      <MdOutlineShoppingCart size={22} />
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