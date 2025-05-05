import React, { useState } from 'react';
import { Link as RouterLink, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Container,
  Collapse
} from '@mui/material';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DiscountIcon from '@mui/icons-material/Discount';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Sidebar width
const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  // Start with sidebar closed by default
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [offersOpen, setOffersOpen] = useState(false);

  // Toggle drawer
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Check if the current route matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin'
    },
    {
      text: 'Menu Management',
      icon: <RestaurantMenuIcon />,
      submenu: [
        {
          text: 'Manage Dishes',
          icon: <RestaurantMenuIcon />,
          path: '/admin/dishes'
        },
        {
          text: 'Manage Offers',
          icon: <LocalOfferIcon />,
          path: '/admin/offers'
        },
        {
          text: 'Today\'s Special',
          icon: <StarIcon />,
          path: '/admin/specials'
        }
      ]
    },
    {
      text: 'Offers & Loyalty',
      icon: <DiscountIcon />,
      submenu: [
        {
          text: 'Loyalty Program',
          icon: <CardMembershipIcon />,
          path: '/admin/loyalty'
        },
        {
          text: 'Selection Offers',
          icon: <DiscountIcon />,
          path: '/admin/selection-offers'
        }
      ]
    },
    {
      text: 'Completed Orders',
      icon: <ReceiptIcon />,
      path: '/admin/completed-orders'
    },
    {
      text: 'Table Management',
      icon: <TableRestaurantIcon />,
      path: '/admin/tables'
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analysis'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings'
    }
  ];

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;

    // Find the matching menu item
    for (const item of menuItems) {
      if (item.path === currentPath) {
        return item.text;
      }

      // Check submenu items
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === currentPath) {
            return subItem.text;
          }
        }
      }
    }

    // Default title
    return "Admin Portal";
  };

  // Drawer content
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2
      }}>
        <FoodBankIcon sx={{ fontSize: 32, mr: 1.5, color: theme.palette.primary.main }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFFFFF' }}>
          TABBLE ADMIN
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />
      <List component="nav" sx={{ px: 1 }}>
        {menuItems.map((item, index) => (
          item.submenu ? (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.text === 'Menu Management') {
                      setMenuOpen(!menuOpen);
                    } else if (item.text === 'Offers & Loyalty') {
                      setOffersOpen(!offersOpen);
                    }
                  }}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 'medium',
                      color: '#FFFFFF'
                    }}
                  />
                  {item.text === 'Menu Management' ?
                    (menuOpen ? <ExpandLess sx={{ color: '#FFFFFF' }} /> : <ExpandMore sx={{ color: '#FFFFFF' }} />) :
                    (offersOpen ? <ExpandLess sx={{ color: '#FFFFFF' }} /> : <ExpandMore sx={{ color: '#FFFFFF' }} />)
                  }
                </ListItemButton>
              </ListItem>
              <Collapse
                in={item.text === 'Menu Management' ? menuOpen : offersOpen}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.submenu.map((subItem, subIndex) => (
                    <ListItem key={subIndex} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={subItem.path}
                        selected={isActive(subItem.path)}
                        sx={{
                          pl: 4,
                          borderRadius: '8px',
                          mb: 0.5,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 165, 0, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 165, 0, 0.3)',
                            }
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                          }
                        }}
                      >
                        <ListItemIcon sx={{
                          color: isActive(subItem.path) ?
                            theme.palette.primary.main :
                            'rgba(255, 255, 255, 0.7)'
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontWeight: isActive(subItem.path) ? 'bold' : 'medium',
                            color: isActive(subItem.path) ?
                              '#FFFFFF' :
                              'rgba(255, 255, 255, 0.7)'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 165, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 165, 0, 0.3)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: isActive(item.path) ?
                    theme.palette.primary.main :
                    'rgba(255, 255, 255, 0.7)'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 'bold' : 'medium',
                    color: isActive(item.path) ?
                      '#FFFFFF' :
                      'rgba(255, 255, 255, 0.7)'
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255, 165, 0, 0.2)', mt: 2 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          &copy; {new Date().getFullYear()} Tabble
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 165, 0, 0.2)',
          width: '100%',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={open ? "close drawer" : "open drawer"}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: 'primary.main',
              backgroundColor: 'rgba(255, 165, 0, 0.08)',
              transition: 'transform 0.3s',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
              '&:hover': {
                backgroundColor: 'rgba(255, 165, 0, 0.15)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getCurrentPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#121212',
            borderRight: '1px solid rgba(255, 165, 0, 0.2)',
            mt: '64px', // Height of AppBar
            height: 'calc(100% - 64px)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: theme.transitions.create(['margin', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: '64px', // Height of AppBar
          pl: { xs: 3, sm: open ? 4 : 3 }, // Add extra padding when sidebar is open
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
