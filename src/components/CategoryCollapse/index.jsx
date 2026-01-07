import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { FaRegPlusSquare } from 'react-icons/fa';
import { FaRegSquareMinus } from 'react-icons/fa6';

const CategoryCollapse = ({
  mainCategories,
  extraCategories,
  openSubmenu,
  handleMainItemClick,
  handleSubItemClick,
  handleExtraItemClick,
  toggleSubmenu,
}) => {
  // Recursive component để render nested subcategories
  const renderSubcategories = (
    subcategories,
    level = 1,
    parentLevel = 'cat'
  ) => {
    if (!subcategories || subcategories.length === 0) return null;

    return (
      <List component="div" disablePadding>
        {subcategories.map((subItem) => {
          const hasChildren =
            subItem.subcategories && subItem.subcategories.length > 0;
          const isOpen = openSubmenu[subItem._id];

          // Determine URL param based on level
          let productUrl = '';
          if (parentLevel === 'cat') {
            productUrl = `/product-listing?subCatId=${subItem._id}`;
          } else if (parentLevel === 'subCat') {
            productUrl = `/product-listing?thirdSubCatId=${subItem._id}`;
          }

          return (
            <React.Fragment key={subItem._id}>
              <ListItem disablePadding sx={{ pl: 2 * level }}>
                <ListItemButton
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleSubmenu(subItem._id);
                    } else {
                      handleSubItemClick(e);
                    }
                  }}
                  component={hasChildren ? 'div' : Link}
                  to={hasChildren ? undefined : productUrl}
                  sx={{
                    py: 1.2,
                    borderRadius: '6px',
                    mx: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 82, 82, 0.06)',
                      pl: 2 * level + 0.5,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemText
                    primary={subItem.name}
                    primaryTypographyProps={{
                      fontSize: '13px',
                      color: 'rgba(0, 0, 0, 0.7)',
                    }}
                  />
                  {hasChildren && (
                    <div className="ml-auto">
                      {isOpen ? (
                        <FaRegSquareMinus size={14} className="text-primary" />
                      ) : (
                        <FaRegPlusSquare size={14} className="text-gray-500" />
                      )}
                    </div>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Nested subcategories */}
              {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  {renderSubcategories(
                    subItem.subcategories,
                    level + 1,
                    parentLevel === 'cat' ? 'subCat' : 'thirdSubCat'
                  )}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };
  return (
    <>
      <List>
        {mainCategories.map(({ _id, name, slug, sub }) => {
          const isOpen = openSubmenu[name];

          return (
            <React.Fragment key={_id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(e) => handleMainItemClick(e, name)}
                  component={sub.length === 0 ? Link : 'div'}
                  to={
                    sub.length === 0
                      ? `/product-listing?catId=${_id}`
                      : undefined
                  }
                  sx={{
                    py: 1.8,
                    borderRadius: '8px',
                    mx: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 82, 82, 0.08)',
                      transform: 'translateX(2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(0, 0, 0, 0.85)',
                    }}
                  />
                  {sub.length > 0 && (
                    <div className="ml-auto">
                      {isOpen ? (
                        <FaRegSquareMinus size={16} className="text-primary" />
                      ) : (
                        <FaRegPlusSquare size={16} className="text-gray-500" />
                      )}
                    </div>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Submenu với nested categories */}
              {sub.length > 0 && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  {renderSubcategories(sub, 1, 'cat')}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      <Divider sx={{ my: 1.5, opacity: 0.6 }} />

      <List sx={{ mt: 1 }}>
        {extraCategories.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                onClick={() => handleExtraItemClick(item.path)}
                sx={{
                  py: 1.8,
                  borderRadius: '10px',
                  mx: 0.5,
                  background:
                    'linear-gradient(135deg, rgba(255, 82, 82, 0.06) 0%, rgba(255, 152, 0, 0.04) 100%)',
                  border: '1px solid rgba(255, 82, 82, 0.15)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, rgba(255, 82, 82, 0.12) 0%, rgba(255, 152, 0, 0.08) 100%)',
                    transform: 'translateX(4px)',
                    boxShadow: '0 2px 8px rgba(255, 82, 82, 0.15)',
                  },
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  mb: 1,
                }}
              >
                <div className="flex items-center gap-2.5 w-full">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgba(0, 0, 0, 0.8)',
                    }}
                  />
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default CategoryCollapse;
