import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Badge,
  Fade,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  styled,
  useTheme,
  Zoom,
  Rating
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import TimerIcon from '@mui/icons-material/Timer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaceIcon from '@mui/icons-material/Place';
import { customerService } from '../../services/api';

// Styled components for better visuals
const CategoryTab = styled(Tab)(({ theme }) => ({
  minWidth: 'auto',
  fontSize: '0.95rem',
  padding: '12px 20px',
  fontWeight: 600,
  textTransform: 'none',
  color: theme.palette.text.primary,
  borderRadius: '50px',
  marginRight: '8px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 700,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(1),
  },
}));

const DishCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const MenuImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
}));

const CartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '20px',
  position: 'sticky',
  top: 20,
  maxHeight: 'calc(100vh - 40px)',
  overflow: 'auto',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const PriceBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  bottom: theme.spacing(2),
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  fontWeight: 700,
  padding: '8px 16px',
  borderRadius: '30px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 2,
}));

const CategoryBadge = styled(Chip)(({ theme, categorycolor }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  backgroundColor: categorycolor || theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  zIndex: 2,
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
}));

const SpecialBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  top: theme.spacing(2),
  backgroundColor: theme.palette.error.main,
  color: 'white',
  fontWeight: 700,
  padding: '4px 12px',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  borderRadius: '4px',
  zIndex: 3,
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    fontSize: '14px',
    marginRight: '4px',
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  padding: '8px 14px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },
}));

const CustomerMenu = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tableNumber = queryParams.get('table_number');
  const uniqueId = queryParams.get('unique_id');

  // Redirect if table number or unique ID is missing
  useEffect(() => {
    if (!tableNumber || !uniqueId) {
      navigate('/customer');
    }
  }, [tableNumber, uniqueId, navigate]);

  // State
  const [categories, setCategories] = useState(['All']);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Category color mapping
  const categoryColors = {
    'Appetizer': theme.palette.primary.main,
    'Main Course': theme.palette.secondary.main,
    'Dessert': theme.palette.error.main,
    'Beverage': theme.palette.success.main,
  };

  // Load dishes and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get categories
        const categoriesData = await customerService.getCategories();
        setCategories(['All', ...categoriesData]);
        setLoadingCategories(false);

        // Get menu items
        const dishesData = await customerService.getMenu();
        
        // Add mock ratings and random prep times for visual enhancement
        const enhancedDishes = dishesData.map(dish => ({
          ...dish,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
          prepTime: Math.floor(Math.random() * 15) + 5, // Random prep time between 5-20 mins
          isPopular: Math.random() > 0.7, // 30% chance of being popular
          isNew: Math.random() > 0.8, // 20% chance of being new
          isFeatured: Math.random() > 0.85, // 15% chance of being featured
        }));
        
        setDishes(enhancedDishes);
        setFilteredDishes(enhancedDishes);
        setLoading(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error loading menu data',
          severity: 'error'
        });
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  // Filter dishes by category
  const handleCategoryChange = (event, newValue) => {
    setCurrentCategory(newValue);
    if (newValue === 'All') {
      setFilteredDishes(dishes);
    } else {
      setFilteredDishes(dishes.filter(dish => dish.category === newValue));
    }
  };

  // Open add to cart dialog
  const handleOpenDialog = (dish) => {
    setSelectedDish(dish);
    setQuantity(1);
    setRemarks('');
    setOpenDialog(true);
  };

  // Close add to cart dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Add item to cart
  const handleAddToCart = () => {
    const newItem = {
      dish_id: selectedDish.id,
      dish_name: selectedDish.name,
      price: selectedDish.price,
      quantity: quantity,
      remarks: remarks,
      image: selectedDish.image_path ? `${process.env.REACT_APP_API_URL}${selectedDish.image_path}` : selectedDish.image_path
    };
    
    setCart([...cart, newItem]);
    setOpenDialog(false);
    
    setSnackbar({
      open: true,
      message: `${selectedDish.name} added to cart`,
      severity: 'success'
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Place order
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        table_number: parseInt(tableNumber),
        unique_id: uniqueId,
        items: cart.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          remarks: item.remarks
        }))
      };

      const response = await customerService.createOrder(orderData);
      setCurrentOrder(response);
      setOrderId(response.id);
      setOrderConfirmationOpen(true);
      setCart([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error placing order',
        severity: 'error'
      });
    }
  };

  // Request payment
  const handleRequestPayment = async () => {
    try {
      await customerService.requestPayment(currentOrder.id);
      setSnackbar({
        open: true,
        message: 'Payment request sent! Please proceed to the counter to complete your payment.',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error requesting payment',
        severity: 'error'
      });
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Close order confirmation dialog
  const handleCloseConfirmation = () => {
    setOrderConfirmationOpen(false);
  };

  return (
    <Container maxWidth="xl">
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          height: '240px',
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          background: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            p: 4,
            color: 'white',
          }}
        >
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Exclusive Dining Experience
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <Box display="flex" alignItems="center">
                  <PlaceIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2">Table #{tableNumber}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Rating value={4.8} readOnly precision={0.5} size="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">4.8 (120+ reviews)</Typography>
                </Box>
                <Chip
                  label={uniqueId}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(4px)',
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Menu */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:after': {
                  content: '""',
                  display: 'block',
                  height: '2px',
                  flexGrow: 1,
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  ml: 2
                }
              }}
            >
              Our Menu
            </Typography>

            {/* Category Tabs */}
            {loadingCategories ? (
              <Box display="flex" justifyContent="center" my={3}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <StyledTabs
                value={currentCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 4, mt: 2 }}
              >
                {categories.map((category) => (
                  <CategoryTab key={category} label={category} value={category} />
                ))}
              </StyledTabs>
            )}

            {/* Featured Section */}
            {currentCategory === 'All' && (
              <Box mb={6}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    '&:after': {
                      content: '""',
                      display: 'block',
                      height: '1px',
                      flexGrow: 1,
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      ml: 2
                    }
                  }}
                >
                  <Typography variant="h6" color="primary" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteIcon sx={{ mr: 1, color: theme.palette.error.main }} /> 
                    Chef's Recommendations
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {filteredDishes
                    .filter(dish => dish.isFeatured)
                    .slice(0, 3)
                    .map((dish) => (
                      <Grid item xs={12} key={`featured-${dish.id}`}>
                        <Fade in={true} timeout={500}>
                          <Card 
                            sx={{ 
                              display: 'flex',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                              cursor: 'pointer',
                              '&:hover': {
                                boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                              }
                            }}
                            onClick={() => handleOpenDialog(dish)}
                          >
                            <Box sx={{ width: '35%', position: 'relative' }}>
                              <CardMedia
                                component="img"
                                sx={{ height: '100%', objectFit: 'cover' }}
                                image={dish.image_path ? `${process.env.REACT_APP_API_URL}${dish.image_path}` : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'}
                                alt={dish.name}
                              />
                              <SpecialBadge>
                                <LocalOfferIcon /> Featured
                              </SpecialBadge>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
                              <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                  <Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                      {dish.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                      {dish.description || 'A delectable dish crafted with the finest ingredients.'}
                                    </Typography>
                                  </Box>
                                  <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                    ${dish.price.toFixed(2)}
                                  </Typography>
                                </Box>
                                
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                  <Box display="flex" alignItems="center" gap={2}>
                                    <Box display="flex" alignItems="center">
                                      <Rating value={parseFloat(dish.rating)} readOnly precision={0.5} size="small" />
                                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {dish.rating}
                                      </Typography>
                                    </Box>
                                    <Chip 
                                      icon={<TimerIcon fontSize="small" />} 
                                      label={`${dish.prepTime} min`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Box>
                                  <AddButton
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDialog(dish);
                                    }}
                                  >
                                    Add
                                  </AddButton>
                                </Box>
                              </CardContent>
                            </Box>
                          </Card>
                        </Fade>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* Regular Menu Items */}
            <Box>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  '&:after': {
                    content: '""',
                    display: 'block',
                    height: '1px',
                    flexGrow: 1,
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    ml: 2
                  }
                }}
              >
                <Typography variant="h6" color="text.primary" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                  <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                  {currentCategory === 'All' ? 'All Items' : currentCategory}
                </Typography>
              </Box>

              {/* Menu Items Grid */}
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredDishes
                    .filter(dish => currentCategory === 'All' ? !dish.isFeatured : true)
                    .map((dish) => (
                      <Grid item xs={12} sm={6} md={4} key={dish.id}>
                        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                          <DishCard onClick={() => handleOpenDialog(dish)}>
                            <Box sx={{ position: 'relative' }}>
                              <MenuImage
                                image={dish.image_path ? `${process.env.REACT_APP_API_URL}${dish.image_path}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'}
                                alt={dish.name}
                              />
                              <PriceBadge>${dish.price.toFixed(2)}</PriceBadge>
                              
                              {dish.isPopular && (
                                <SpecialBadge>
                                  <LocalOfferIcon /> Popular
                                </SpecialBadge>
                              )}
                              
                              {dish.isNew && !dish.isPopular && (
                                <SpecialBadge sx={{ backgroundColor: theme.palette.secondary.main }}>
                                  <LocalOfferIcon /> New
                                </SpecialBadge>
                              )}
                              
                              {currentCategory === 'All' && (
                                <CategoryBadge 
                                  label={dish.category} 
                                  size="small"
                                  categorycolor={categoryColors[dish.category]}
                                />
                              )}
                            </Box>
                            <CardContent sx={{ position: 'relative' }}>
                              <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                                {dish.name}
                              </Typography>
                              
                              {dish.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  sx={{ mb: 2, height: '40px', overflow: 'hidden' }}
                                >
                                  {dish.description.length > 80 
                                    ? dish.description.substring(0, 80) + '...' 
                                    : dish.description}
                                </Typography>
                              )}
                              
                              <Divider sx={{ my: 1.5 }} />
                              
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center">
                                  <Rating value={parseFloat(dish.rating)} readOnly precision={0.5} size="small" />
                                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                                    {dish.rating}
                                  </Typography>
                                </Box>
                                <Chip 
                                  icon={<TimerIcon fontSize="small" />} 
                                  label={`${dish.prepTime} min`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                              
                              <Box display="flex" justifyContent="flex-end" mt={2}>
                                <AddButton
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDialog(dish);
                                  }}
                                >
                                  Add
                                </AddButton>
                              </Box>
                            </CardContent>
                          </DishCard>
                        </Zoom>
                      </Grid>
                    ))}
                  
                  {filteredDishes.length === 0 && !loading && (
                    <Grid item xs={12}>
                      <Box textAlign="center" py={8} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '16px' }}>
                        <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No dishes available in this category
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '400px', mx: 'auto' }}>
                          Please check back later or try another category from our menu
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Cart */}
        <Grid item xs={12} md={4}>
          <CartPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <Badge 
                badgeContent={cart.length} 
                color="primary" 
                sx={{ 
                  mr: 2,
                  '& .MuiBadge-badge': { 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    minWidth: '22px',
                    height: '22px',
                  } 
                }}
              >
                <ShoppingCartIcon color="primary" fontSize="large" />
              </Badge>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Your Order
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            {/* Cart Items */}
            {cart.length === 0 ? (
              <Box textAlign="center" py={8} mb={3}>
                <Box
                  component="img"
                  src="https://img.freepik.com/free-vector/empty-shopping-cart-illustration_114065-634.jpg?w=826&t=st=1699123456~exp=1699124056~hmac=86a5d1f14da1d3c532839d11bba8c9ce44c5b23f50953a44d576edb7b8a29381"
                  alt="Empty cart"
                  sx={{ width: '70%', maxWidth: '200px', mb: 3, opacity: 0.8 }}
                />
                <Typography color="text.secondary" variant="h6" gutterBottom>
                  Your cart is empty
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Add some delicious dishes from our menu
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {cart.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      py: 2,
                      px: 0,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromCart(index)}
                        sx={{ 
                          backgroundColor: 'rgba(255, 90, 95, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 90, 95, 0.2)',
                          }
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    }
                  >
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Box 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'} 
                          alt={item.dish_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flexGrow: 1, pr: 2 }}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" fontWeight="bold">
                            {item.dish_name}
                          </Typography>
                          <Chip 
                            label={`x${item.quantity}`} 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }}
                          />
                        </Box>
                        {item.remarks && (
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                            Note: {item.remarks}
                          </Typography>
                        )}
                        <Typography variant="body2" color="primary.main" fontWeight="medium" sx={{ mt: 0.5 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}

            {/* Order Summary */}
            {cart.length > 0 && (
              <Box mt={3} pt={2} pb={1} px={2} bgcolor="rgba(0,0,0,0.02)" borderRadius={2}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Items Subtotal:</Typography>
                  <Typography variant="body2">${calculateTotal()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Service Charge:</Typography>
                  <Typography variant="body2">$0.00</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    ${calculateTotal()}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box mt={4}>
              {currentOrder ? (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={handleRequestPayment}
                  sx={{ 
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(145deg, #4DAA57 0%, #2E8B57 100%)',
                    boxShadow: '0 8px 16px rgba(77, 170, 87, 0.25)',
                    borderRadius: '12px',
                  }}
                >
                  Proceed to Payment
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={cart.length === 0}
                  onClick={handlePlaceOrder}
                  sx={{ 
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(145deg, #FF5A5F 0%, #FF385C 100%)',
                    boxShadow: '0 8px 16px rgba(255, 90, 95, 0.25)',
                    borderRadius: '12px',
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(255, 90, 95, 0.3)',
                    },
                  }}
                >
                  Place Order
                </Button>
              )}
              
              {/* Delivery Time Indicator */}
              {cart.length > 0 && !currentOrder && (
                <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                  <DeliveryDiningIcon color="action" sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    Estimated delivery: {Math.floor(Math.random() * 15) + 15}-{Math.floor(Math.random() * 15) + 30} mins
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Restaurant Policy */}
            <Box mt={4} pt={3} borderTop="1px dashed rgba(0,0,0,0.1)">
              <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="medium">
                Restaurant Policy
              </Typography>
              <Typography variant="caption" color="text.secondary" component="p" paragraph>
                • All prices are inclusive of taxes
              </Typography>
              <Typography variant="caption" color="text.secondary" component="p" paragraph>
                • Once placed, orders cannot be cancelled
              </Typography>
              <Typography variant="caption" color="text.secondary" component="p">
                • For assistance, please contact our staff
              </Typography>
            </Box>
          </CartPaper>
        </Grid>
      </Grid>

      {/* Add to Cart Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">{selectedDish?.name}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDish && (
            <>
              <Box 
                sx={{ 
                  height: 200, 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  mb: 3,
                  position: 'relative'
                }}
              >
                <img 
                  src={selectedDish.image_path ? `${process.env.REACT_APP_API_URL}${selectedDish.image_path}` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'}
                  alt={selectedDish.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    width: '100%', 
                    p: 2,
                    color: 'white'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">${selectedDish.price.toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedDish.description || 'A delicious dish prepared with quality ingredients.'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Quantity
              </Typography>
              <Box 
                display="flex" 
                alignItems="center" 
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: '50px',
                  width: 'fit-content', 
                  px: 1
                }}
              >
                <IconButton 
                  size="small" 
                  onClick={decrementQuantity}
                  sx={{ 
                    color: quantity === 1 ? 'text.disabled' : 'primary.main',
                    '&:hover': {
                      backgroundColor: quantity === 1 ? 'transparent' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                  disabled={quantity === 1}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  variant="standard"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(val);
                    }
                  }}
                  InputProps={{ 
                    disableUnderline: true, 
                    inputProps: { 
                      style: { textAlign: 'center', width: '30px', fontWeight: 'bold' } 
                    } 
                  }}
                />
                <IconButton size="small" onClick={incrementQuantity} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Special Instructions (Optional)
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  placeholder="E.g., No onions, extra spicy, etc."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddToCart}
            sx={{ 
              px: 3,
              borderRadius: '50px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #FF5A5F 0%, #FF385C 100%)',
            }}
          >
            Add to Cart - ${selectedDish?.price ? (selectedDish.price * quantity).toFixed(2) : '0.00'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog 
        open={orderConfirmationOpen} 
        onClose={handleCloseConfirmation} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <Box 
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'success.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              color: 'success.main',
            }}
          >
            <CheckCircleIcon fontSize="large" />
          </Box>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your order #{orderId} has been received
          </Typography>
          <Box 
            sx={{ 
              my: 3, 
              p: 2, 
              border: '1px dashed', 
              borderColor: 'divider', 
              borderRadius: '8px',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Estimated Preparation Time
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              <TimerIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                20-35 minutes
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please wait while our chef prepares your delicious meal. You can track your order status here.
          </Typography>
          <Button 
            onClick={handleCloseConfirmation} 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '50px',
              fontWeight: 'bold',
              background: 'linear-gradient(145deg, #FF5A5F 0%, #FF385C 100%)',
            }}
          >
            Track Order Status
          </Button>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: '50px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerMenu;
