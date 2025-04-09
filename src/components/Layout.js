import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  ListItemIcon,
  Divider,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FoodBankIcon from '@mui/icons-material/FoodBank';

// Styled logo for better branding
const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  textDecoration: 'none',
  '& svg': {
    fontSize: 28,
    marginRight: theme.spacing(1)
  }
}));

// Animated navigation button
const NavButton = styled(Button)(({ theme, active }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: active ? '70%' : '0%',
    height: '3px',
    bottom: '6px',
    left: '15%',
    backgroundColor: 'white',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:after': {
      width: '70%',
    }
  },
}));

const navItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Chef', path: '/chef', icon: <RestaurantIcon /> },
  { name: 'Customer', path: '/customer', icon: <PeopleIcon /> },
  { name: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
];

function Layout({ children }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FoodBankIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Tabble
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              textDecoration: 'none',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 90, 95, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.name} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'primary.main' : 'inherit'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Background with gradient for the AppBar
  const appBarBackground = `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: appBarBackground, boxShadow: 3 }}>
        <Container>
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Logo
              component={RouterLink}
              to="/"
              sx={{ flexGrow: 1, textDecoration: 'none' }}
            >
              <FoodBankIcon />
              <Typography
                variant="h5"
                fontWeight="bold"
                letterSpacing="-0.02em"
              >
                Tabble
              </Typography>
            </Logo>
            
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex' }}>
                {navItems.map((item) => (
                  <Tooltip title={item.name} key={item.name}>
                    <NavButton
                      component={RouterLink}
                      to={item.path}
                      active={location.pathname === item.path ? 1 : 0}
                      startIcon={item.icon}
                    >
                      {item.name}
                    </NavButton>
                  </Tooltip>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ mt: 4, mb: 5, flexGrow: 1 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          background: `linear-gradient(90deg, #2A2A2A 0%, #333333 100%)`,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" mb={2}>
              <FoodBankIcon sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h6" component="span" fontWeight="bold">
                Tabble
              </Typography>
            </Box>
            <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
              Elegant dining experience management
            </Typography>
            <Typography variant="body2" align="center" sx={{ mt: 2, opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} Tabble - Hotel Management App
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
