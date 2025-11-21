import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import Navigation from "./Navigation";
import { MyContext } from "../../App";

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
  const context = useContext(MyContext)
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
          <div className="w-[45%]">
            <Search />
          </div>

          {/* User Actions */}
          <div className="w-[30%] flex items-center">
            <ul className="flex items-center justify-end w-full gap-3 pl-10">
              {/* Login / Register */}
              <li className="list-none flex items-center gap-1 text-[15px] font-medium">
                <Link to="/login" className="link transition">
                  Login
                </Link>
                <span className="text-gray-400">|</span>
                <Link to="/register" className="link transition">
                  Register
                </Link>
              </li>

              {/* Compare */}
              <li>
                <Tooltip title="Compare">
                  <IconButton aria-label="compare">
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoGitCompareOutline size={20} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {/* Wishlist */}
              <li>
                <Tooltip title="Wishlist">
                  <IconButton aria-label="wishlist">
                    <StyledBadge badgeContent={4} color="secondary">
                      <FaRegHeart size={20} />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>

              {/* Cart */}
              <li>
                <Tooltip title="Cart">
                  <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
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