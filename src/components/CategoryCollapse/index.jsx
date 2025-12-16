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
  const renderSubcategories = (subcategories, level = 1) => {
    if (!subcategories || subcategories.length === 0) return null;

    return (
      <List component="div" disablePadding>
        {subcategories.map((subItem) => {
          const hasChildren =
            subItem.subcategories && subItem.subcategories.length > 0;
          const isOpen = openSubmenu[subItem._id];

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
                  to={hasChildren ? undefined : `/category/${subItem.slug}`}
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
                  {renderSubcategories(subItem.subcategories, level + 1)}
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
                  to={sub.length === 0 ? `/category/${slug}` : undefined}
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
                  {renderSubcategories(sub)}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      <Divider />

      <List sx={{ mt: 1 }}>
        {extraCategories.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={handleExtraItemClick}
              sx={{
                py: 1.8,
                borderRadius: '8px',
                mx: 0.5,
                backgroundColor: 'rgba(255, 82, 82, 0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 82, 82, 0.12)',
                  transform: 'translateX(2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'rgba(0, 0, 0, 0.75)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CategoryCollapse;
