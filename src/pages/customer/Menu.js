import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FeedbackDialog from '../../components/FeedbackDialog';
import { customerService } from '../../services/api';
import OrderHistoryDialog from './components/OrderHistoryDialog';
import CartDialog from './components/CartDialog';
import OrderConfirmationDialog from './components/OrderConfirmationDialog';

// Import components
import HeroBanner from './components/HeroBanner';
import SpecialOffers from './components/SpecialOffers';
import TodaySpecials from './components/TodaySpecials';
import MenuCategories from './components/MenuCategories';
// import FeaturedDishes from './components/FeaturedDishes';
import MenuItemsGrid from './components/MenuItemsGrid';

// Helper function to get correct image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://tabble.onrender.com${imagePath}`;
};

const CustomerMenu = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tableNumber = queryParams.get('table_number');
  const uniqueId = queryParams.get('unique_id');
  const userId = queryParams.get('user_id');

  // Redirect if table number, unique ID, or user ID is missing
  useEffect(() => {
    if (!tableNumber || !uniqueId || !userId) {
      navigate('/customer');
    }
  }, [tableNumber, uniqueId, userId, navigate]);

  // State
  const [categories, setCategories] = useState(['All']);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [orderConfirmationDialogOpen, setOrderConfirmationDialogOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [lastPaidOrderId, setLastPaidOrderId] = useState(null);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState({
    discount_percentage: 0,
    message: ''
  });
  const [selectionOfferDiscount, setSelectionOfferDiscount] = useState({
    discount_amount: 0,
    message: ''
  });

  // Category color mapping
  const categoryColors = {
    'Appetizer': theme.palette.primary.main,
    'Main Course': theme.palette.secondary.main,
    'Dessert': theme.palette.error.main,
    'Beverage': theme.palette.success.main,
  };

  // State for offers and specials
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [specials, setSpecials] = useState([]);
  const [loadingSpecials, setLoadingSpecials] = useState(true);

  // Load dishes, categories, and offers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get categories
        const categoriesData = await customerService.getCategories();
        setCategories(['All', ...categoriesData]);
        setLoadingCategories(false);

        // Get menu items
        const dishesData = await customerService.getMenu();

        // Get offer items
        const offersData = await customerService.getOffers();
        setOffers(offersData);
        setLoadingOffers(false);

        // Get special items
        const specialsData = await customerService.getSpecials();
        setSpecials(specialsData);
        setLoadingSpecials(false);

        // Add mock ratings and random prep times for visual enhancement
        const enhancedDishes = dishesData.map(dish => ({
          ...dish,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
          prepTime: Math.floor(Math.random() * 15) + 5, // Random prep time between 5-20 mins
          isPopular: Math.random() > 0.7, // 30% chance of being popular
          isNew: Math.random() > 0.8, // 20% chance of being new
          isFeatured: dish.is_offer === 1 ? true : Math.random() > 0.85, // Offers are featured, plus 15% chance for others
        }));

        setDishes(enhancedDishes);
        setFilteredDishes(enhancedDishes);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading menu data',
          severity: 'error'
        });
        setLoading(false);
        setLoadingCategories(false);
        setLoadingOffers(false);
        setLoadingSpecials(false);
      }
    };

    fetchData();
  }, []);

  // Fetch current order and loyalty discount
  const fetchCurrentOrder = useCallback(async () => {
    try {
      if (userId) {
        console.log('Fetching orders for user ID:', userId);

        // Get all orders
        const orders = await customerService.getPersonOrders(userId);
        console.log('Orders received:', orders);

        // Find all unpaid orders for the current table
        const tableUnpaidOrders = orders.filter(order =>
          order.status !== 'paid' &&
          order.table_number === parseInt(tableNumber)
        );
        console.log('Unpaid orders for table', tableNumber, ':', tableUnpaidOrders);

        // Set the most recent unpaid order as the current order (for backward compatibility)
        const activeOrder = tableUnpaidOrders.length > 0 ? tableUnpaidOrders[0] : null;
        console.log('Active order:', activeOrder);

        if (activeOrder) {
          setCurrentOrder(activeOrder);
        }

        // Set all unpaid orders
        setUnpaidOrders(tableUnpaidOrders);

        // If no unpaid orders, create a dummy order for testing
        if (tableUnpaidOrders.length === 0) {
          console.log('No unpaid orders found, creating a test order');

          try {
            // Create a test order
            const testOrderData = {
              table_number: parseInt(tableNumber),
              items: [
                {
                  dish_id: 1,
                  quantity: 1,
                  remarks: 'Test order'
                }
              ]
            };

            const newOrder = await customerService.createOrder(testOrderData, userId);
            console.log('Test order created:', newOrder);

            // Refresh orders
            const updatedOrders = await customerService.getPersonOrders(userId);
            const updatedUnpaidOrders = updatedOrders.filter(order =>
              order.status !== 'paid' &&
              order.table_number === parseInt(tableNumber)
            );

            setUnpaidOrders(updatedUnpaidOrders);
            if (updatedUnpaidOrders.length > 0) {
              setCurrentOrder(updatedUnpaidOrders[0]);
            }
          } catch (orderError) {
            console.error('Error creating test order:', orderError);
          }
        }

        // Get loyalty discount
        try {
          const person = await customerService.getPerson(userId);
          console.log('Person details:', person);

          if (person && person.visit_count > 0) {
            const discountData = await customerService.getLoyaltyDiscount(person.visit_count);
            console.log('Loyalty discount:', discountData);
            setLoyaltyDiscount(discountData);
          }
        } catch (error) {
          console.error('Error fetching loyalty discount:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching current order:', error);
    }
  }, [userId, tableNumber]); // customerService is excluded as it's an imported module

  // Fetch current order and loyalty discount when userId changes
  useEffect(() => {
    if (userId) {
      fetchCurrentOrder();
    }
  }, [fetchCurrentOrder, userId]);

  // Mark table as occupied when component loads
  useEffect(() => {
    const markTableAsOccupied = async () => {
      if (tableNumber) {
        try {
          await customerService.setTableOccupiedByNumber(parseInt(tableNumber));
          console.log(`Table ${tableNumber} marked as occupied`);
        } catch (error) {
          console.error('Error marking table as occupied:', error);
        }
      }
    };

    markTableAsOccupied();
  }, [tableNumber]);

  // Filter dishes by category
  const handleCategoryChange = (_, newValue) => {
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
    // Calculate the actual price (with discount if applicable)
    const actualPrice = selectedDish.is_offer === 1 ?
      parseFloat(calculateDiscountedPrice(selectedDish.price, selectedDish.discount)) :
      selectedDish.price;

    const newItem = {
      dish_id: selectedDish.id,
      dish_name: selectedDish.name,
      price: actualPrice,
      original_price: selectedDish.price,
      discount: selectedDish.discount,
      is_offer: selectedDish.is_offer,
      quantity: quantity,
      remarks: remarks,
      image: selectedDish.image_path,
      added_at: new Date().toISOString(), // Add timestamp to track order
      position: cart.length + 1 // Add position to maintain order
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

    // Update positions after removal
    const updatedCart = newCart.map((item, idx) => ({
      ...item,
      position: idx + 1
    }));

    setCart(updatedCart);
  };

  // Reorder items in cart
  const handleReorderCart = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === cart.length - 1)
    ) {
      return; // Can't move first item up or last item down
    }

    const newCart = [...cart];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap items
    [newCart[index], newCart[newIndex]] = [newCart[newIndex], newCart[index]];

    // Update positions
    const updatedCart = newCart.map((item, idx) => ({
      ...item,
      position: idx + 1
    }));

    setCart(updatedCart);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderItems = cart.map(item => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        remarks: item.remarks || null
      }));

      const orderData = {
        table_number: parseInt(tableNumber),
        unique_id: uniqueId,
        items: orderItems
      };

      const order = await customerService.createOrder(orderData, userId || null);
      setCart([]);
      setCurrentOrder(order);
      setOrderConfirmationDialogOpen(true);
      setLastOrderId(order.id);

      if (userId) {
        const orders = await customerService.getPersonOrders(userId);
        setUserOrders(orders);
      }

      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
      setCartDialogOpen(false);
    } catch (error) {
      console.error('Error placing order:', error);
      setSnackbar({
        open: true,
        message: 'Error placing order. Please try again.',
        severity: 'error'
      });
    }
  };

  // Request payment
  const handleRequestPayment = async () => {
    console.log('Requesting payment, unpaid orders:', unpaidOrders);

    // Refresh orders before showing payment dialog
    try {
      if (userId) {
        // Refresh orders
        const orders = await customerService.getPersonOrders(userId);
        console.log('Refreshed orders:', orders);

        // Find all unpaid orders for the current table
        const tableUnpaidOrders = orders.filter(order =>
          order.status !== 'paid' &&
          order.table_number === parseInt(tableNumber)
        );
        console.log('Refreshed unpaid orders:', tableUnpaidOrders);

        // Update unpaid orders state
        setUnpaidOrders(tableUnpaidOrders);

        // If no unpaid orders, show a message and return
        if (tableUnpaidOrders.length === 0) {
          setSnackbar({
            open: true,
            message: 'No unpaid orders found. Please place an order first.',
            severity: 'warning'
          });
          return;
        }

        // Refresh loyalty discount
        try {
          const person = await customerService.getPerson(userId);
          console.log('Person details for loyalty discount:', person);

          if (person && person.visit_count > 0) {
            // Apply a default loyalty discount based on visit count
            let discountData = {
              discount_percentage: 0,
              message: 'No loyalty discount available',
              visit_count: person.visit_count
            };

            // Apply discount based on visit count (exact matches only)
            if (person.visit_count === 10) {
              discountData = {
                discount_percentage: 15,
                message: 'Loyalty Discount: 15% off for exactly 10 visits',
                visit_count: person.visit_count
              };
            } else if (person.visit_count === 5) {
              discountData = {
                discount_percentage: 10,
                message: 'Loyalty Discount: 10% off for exactly 5 visits',
                visit_count: person.visit_count
              };
            } else if (person.visit_count === 3) {
              discountData = {
                discount_percentage: 5,
                message: 'Loyalty Discount: 5% off for exactly 3 visits',
                visit_count: person.visit_count
              };
            }

            console.log('Applied loyalty discount:', discountData);
            setLoyaltyDiscount(discountData);
          }
        } catch (error) {
          console.error('Error setting loyalty discount:', error);
        }

        // Get selection offer discount based on total of all unpaid orders
        try {
          // Calculate total across all unpaid orders
          const totalOrderAmount = tableUnpaidOrders.reduce((total, order) => {
            return total + (order.items ? order.items.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0) : 0);
          }, 0);

          console.log('Total order amount for discount calculation:', totalOrderAmount);

          // Get selection offer discount from backend API
          try {
            const offerData = await customerService.getSelectionOfferDiscount(totalOrderAmount);
            console.log('Selection offer discount from API:', offerData);
            setSelectionOfferDiscount(offerData);
          } catch (apiError) {
            console.error('Error fetching selection offer discount from API:', apiError);

            // Fallback to local calculation if API fails
            let offerData = { discount_amount: 0, message: 'No special offer available' };

            // If total amount is over $100, apply a $15 discount
            if (totalOrderAmount >= 100) {
              offerData = {
                discount_amount: 15,
                message: 'Special Offer: $15 off on orders above $100'
              };
            }
            // If total amount is over $50, apply a $5 discount
            else if (totalOrderAmount >= 50) {
              offerData = {
                discount_amount: 5,
                message: 'Special Offer: $5 off on orders above $50'
              };
            }

            console.log('Selection offer discount (fallback):', offerData);
            setSelectionOfferDiscount(offerData);
          }
        } catch (error) {
          console.error('Error setting selection offer discount:', error);
        }

        // Open payment dialog
        setPaymentDialogOpen(true);
      }
    } catch (error) {
      console.error('Error refreshing orders for payment:', error);
      setSnackbar({
        open: true,
        message: 'Error loading payment details. Please try again.',
        severity: 'error'
      });
    }
  };

  // Close payment dialog
  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  // Complete payment
  const handleCompletePayment = async () => {
    try {
      // Store the first order ID for feedback before marking as paid
      const firstOrderId = unpaidOrders.length > 0 ? unpaidOrders[0].id : null;

      // Mark all unpaid orders as paid
      const paymentPromises = unpaidOrders.map(order =>
        customerService.requestPayment(order.id)
      );

      await Promise.all(paymentPromises);

      // Store the last paid order ID for feedback
      setLastPaidOrderId(firstOrderId);

      setPaymentDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Payment completed successfully! The bill will arrive at your table soon.',
        severity: 'success'
      });

      // Refresh order history after payment
      if (userId) {
        const orders = await customerService.getPersonOrders(userId);
        setUserOrders(orders);

        // Clear unpaid orders
        setUnpaidOrders([]);
        setCurrentOrder(null);
      }

      // Show feedback dialog after successful payment
      setTimeout(() => {
        setFeedbackDialogOpen(true);
      }, 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error processing payment',
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

  // Close order confirmation dialog (kept for future use)
  // const handleCloseConfirmation = () => {
  //   setOrderConfirmationOpen(false);
  // };

  // Open cart dialog
  const handleOpenCartDialog = () => {
    setCartDialogOpen(true);
  };

  // Close cart dialog
  const handleCloseCartDialog = () => {
    setCartDialogOpen(false);
  };



  // Open order history dialog
  const handleOpenOrderHistory = async () => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: 'User ID not found. Please log in again.',
        severity: 'error'
      });
      return;
    }

    setLoadingOrders(true);
    setOrderHistoryOpen(true);

    try {
      const orders = await customerService.getPersonOrders(userId);
      setUserOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Error loading order history',
        severity: 'error'
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  // Close order history dialog
  const handleCloseOrderHistory = () => {
    setOrderHistoryOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY h:mm A');
  };

  // Get order status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'payment_requested':
        return 'info';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get order status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Preparing';
      case 'completed':
        return 'Ready';
      case 'payment_requested':
        return 'Payment Requested';
      case 'paid':
        return 'Paid';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
      {/* Hero Banner */}
      <HeroBanner tableNumber={tableNumber} uniqueId={uniqueId} />

      {/* Special Offers Section */}
      <SpecialOffers
        offers={offers}
        loading={loadingOffers}
        handleOpenDialog={handleOpenDialog}
        calculateDiscountedPrice={calculateDiscountedPrice}
      />

      {/* Today's Special Section */}
      <TodaySpecials
        specials={specials}
        loading={loadingSpecials}
        handleOpenDialog={handleOpenDialog}
      />

      <Grid container spacing={4}>
        {/* Menu */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 6,
              borderRadius: '6px',
              backgroundColor: '#121212',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 165, 0, 0.2)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: '#FFA500',
              }
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
                mb: 3,
                '&:after': {
                  content: '""',
                  display: 'block',
                  height: '2px',
                  flexGrow: 1,
                  backgroundColor: 'rgba(255, 165, 0, 0.3)',
                  ml: 2
                }
              }}
            >
              Our <Box component="span" sx={{ color: '#FFA500', ml: 1 }}>Menu</Box>
            </Typography>

            {/* Category Tabs */}
            <MenuCategories
              categories={categories}
              currentCategory={currentCategory}
              handleCategoryChange={handleCategoryChange}
              loading={loadingCategories}
            />



            {/* Regular Menu Items */}
            <MenuItemsGrid
              dishes={dishes}
              filteredDishes={filteredDishes}
              currentCategory={currentCategory}
              loading={loading}
              handleOpenDialog={handleOpenDialog}
              categoryColors={categoryColors}
              theme={theme}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Add to Cart Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '6px',
            backgroundColor: '#121212',
            color: 'white',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: '#FFA500',
            }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid rgba(255, 165, 0, 0.2)' }}>
          <Typography variant="h6" fontWeight="bold" color="white">{selectedDish?.name}</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
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
                  src={getImageUrl(selectedDish.image_path)}
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
                  {selectedDish.is_offer === 1 ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ${selectedDish.price.toFixed(2)}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="error.main">
                        ${calculateDiscountedPrice(selectedDish.price, selectedDish.discount)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h6" fontWeight="bold">${selectedDish.price.toFixed(2)}</Typography>
                  )}
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} paragraph>
                {selectedDish.description || 'A delicious dish prepared with quality ingredients.'}
              </Typography>

              <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />

              <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
                Quantity
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  border: '1px solid',
                  borderColor: 'rgba(255, 165, 0, 0.3)',
                  borderRadius: '4px',
                  width: 'fit-content',
                  px: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}
              >
                <IconButton
                  size="small"
                  onClick={decrementQuantity}
                  sx={{
                    color: quantity === 1 ? 'rgba(255,255,255,0.3)' : '#FFA500',
                    '&:hover': {
                      backgroundColor: quantity === 1 ? 'transparent' : 'rgba(255,165,0,0.1)'
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
                      style: { textAlign: 'center', width: '30px', fontWeight: 'bold', color: 'white' }
                    }
                  }}
                />
                <IconButton size="small" onClick={incrementQuantity} sx={{ color: '#FFA500' }}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="white">
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
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'rgba(255, 165, 0, 0.3)',
                      color: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 165, 0, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFA500',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 165, 0, 0.3)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiFormLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#FFA500',
                    },
                  }}
                  InputProps={{
                    style: { color: 'white' }
                  }}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, backgroundColor: '#121212', borderTop: '1px solid rgba(255, 165, 0, 0.2)' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 165, 0, 0.5)',
              color: '#FFA500',
              borderRadius: '4px',
              '&:hover': {
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.08)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            sx={{
              px: 3,
              borderRadius: '4px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              backgroundColor: '#FFA500',
              '&:hover': {
                backgroundColor: '#E69500',
              }
            }}
          >
            Add to Cart - ${selectedDish ? (
              selectedDish.is_offer === 1 ?
                (calculateDiscountedPrice(selectedDish.price, selectedDish.discount) * quantity).toFixed(2) :
                (selectedDish.price * quantity).toFixed(2)
            ) : '0.00'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <OrderConfirmationDialog
        open={orderConfirmationDialogOpen}
        onClose={() => setOrderConfirmationDialogOpen(false)}
        orderId={lastOrderId}
      />

      {/* Snackbar for notifications */}
      {/* Cart Dialog with CartDialog component */}
      <CartDialog
        open={cartDialogOpen}
        onClose={handleCloseCartDialog}
        cart={cart}
        handleRemoveFromCart={handleRemoveFromCart}
        calculateTotal={calculateTotal}
        handlePlaceOrder={handlePlaceOrder}
        currentOrder={currentOrder}
        handleReorderCart={handleReorderCart}
      />

      {/* Order History Dialog */}
      <OrderHistoryDialog
        open={orderHistoryOpen}
        onClose={handleCloseOrderHistory}
        userOrders={userOrders}
        loadingOrders={loadingOrders}
        formatDate={formatDate}
        getStatusLabel={getStatusLabel}
        getStatusColor={getStatusColor}
        refreshOrders={() => handleOpenOrderHistory()}
      />

      {/* Bottom App Bar with View Cart Button */}
      <AppBar
        position="fixed"
        color="default"
        sx={{
          top: 'auto',
          bottom: 0,
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#000000',
          borderTop: '1px solid rgba(255, 165, 0, 0.2)'
        }}
      >
        <Toolbar>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<HistoryIcon />}
            onClick={handleOpenOrderHistory}
            sx={{
              borderRadius: '4px',
              mr: 2,
              borderColor: 'rgba(255, 165, 0, 0.5)',
              borderWidth: '2px',
              color: '#FFA500',
              '&:hover': {
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.1)'
              }
            }}
          >
            View Orders
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={
              <Badge
                badgeContent={cart.length}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    minWidth: '18px',
                    height: '18px',
                    backgroundColor: '#000000',
                    color: '#FFA500',
                    border: '1px solid #FFA500'
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            }
            onClick={handleOpenCartDialog}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: '4px',
              fontWeight: 'bold',
              backgroundColor: '#FFA500',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#E69500',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            View Cart {cart.length > 0 && `• $${calculateTotal()}`}
          </Button>
          {currentOrder && (
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={handleRequestPayment}
              sx={{
                ml: 2,
                py: 1.2,
                px: 3,
                borderRadius: '4px',
                fontWeight: 'bold',
                backgroundColor: '#4DAA57',
                color: '#FFFFFF',
                border: '2px solid #4DAA57',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
                  opacity: 0.5
                },
                '&:hover': {
                  backgroundColor: '#3D8A47',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              Payment
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Add padding at the bottom to account for the bottom bar */}
      <Box sx={{ height: 80 }} />

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: '#121212',
            color: 'white',
            border: '1px solid rgba(255, 165, 0, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 165, 0, 0.2)' }}>
          <Box display="flex" alignItems="center">
            <PaymentIcon sx={{ mr: 2, color: '#FFA500' }} />
            <Typography variant="h5" component="h2" fontWeight="bold" color="white">
              Payment Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
          {unpaidOrders.length > 0 ? (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 165, 0, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: '#FFA500' }}>
                  Bill Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                    Table #{unpaidOrders[0].table_number}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {unpaidOrders.length} {unpaidOrders.length === 1 ? 'Order' : 'Orders'} to Pay
                  </Typography>
                </Box>

                {/* Display each unpaid order */}
                {unpaidOrders.map((order, orderIndex) => (
                  <Box key={order.id} sx={{ mb: orderIndex < unpaidOrders.length - 1 ? 3 : 0 }}>
                    <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="white">
                      Order #{order.id}
                    </Typography>
                    <List disablePadding>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => (
                          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                            <ListItemText
                              primary={
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="body2" color="white">
                                    {item.dish?.name || "Unknown Dish"} x{item.quantity}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="medium" color="white">
                                    ${((item.dish?.price || 0) * item.quantity).toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" sx={{ fontStyle: 'italic' }}>
                          No items in this order
                        </Typography>
                      )}
                    </List>
                    <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="medium" color="white">
                        Order Subtotal: ${(order.items ? order.items.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0) : 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />

                {/* Calculate totals across all orders */}
                {(() => {
                  // Calculate subtotal across all orders
                  const subtotal = unpaidOrders.reduce((total, order) => {
                    return total + (order.items ? order.items.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0) : 0);
                  }, 0);

                  // Calculate loyalty discount
                  const loyaltyDiscountAmount = loyaltyDiscount.discount_percentage > 0
                    ? subtotal * (loyaltyDiscount.discount_percentage / 100)
                    : 0;

                  // Calculate final total
                  const finalTotal = (subtotal - loyaltyDiscountAmount - selectionOfferDiscount.discount_amount);

                  return (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" color="white">Subtotal</Typography>
                        <Typography variant="subtitle1" color="white">
                          ${subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      {loyaltyDiscount.discount_percentage > 0 && (
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                          <Typography variant="subtitle1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMembershipIcon fontSize="small" sx={{ mr: 1 }} />
                            Loyalty Discount ({loyaltyDiscount.discount_percentage}%)
                          </Typography>
                          <Typography variant="subtitle1" color="success.main">
                            -${loyaltyDiscountAmount.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      {selectionOfferDiscount.discount_amount > 0 && (
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                          <Typography variant="subtitle1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
                            Special Offer Discount
                          </Typography>
                          <Typography variant="subtitle1" color="success.main">
                            -${selectionOfferDiscount.discount_amount.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold" color="white">Total</Typography>
                        <Typography variant="h6" fontWeight="bold" color="#FFA500">
                          ${finalTotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}

                <Box sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.3)', p: 2, borderRadius: '8px', border: '1px dashed rgba(255, 165, 0, 0.3)' }}>
                  <Typography variant="subtitle2" color="#FFA500" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Applied Discounts:
                  </Typography>

                  {loyaltyDiscount.discount_percentage > 0 ? (
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      {loyaltyDiscount.message}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic', mb: 0.5 }}>
                      No loyalty discount applied
                    </Typography>
                  )}

                  {selectionOfferDiscount.discount_amount > 0 ? (
                    <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      {selectionOfferDiscount.message}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                      No special offer discount applied
                    </Typography>
                  )}
                </Box>
              </Paper>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} paragraph>
                  Please proceed to the counter to complete your payment or click the button below to mark as paid.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="white" gutterBottom>
                No unpaid orders found
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Please place an order first before requesting payment.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 165, 0, 0.2)' }}>
          <Button
            onClick={handleClosePaymentDialog}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 165, 0, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'rgba(255, 165, 0, 0.8)',
                backgroundColor: 'rgba(255, 165, 0, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCompletePayment}
            disabled={unpaidOrders.length === 0}
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: 'bold',
              backgroundColor: '#FFA500',
              color: '#000000',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#E69500',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(255, 165, 0, 0.3)',
                color: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            Complete Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        orderId={lastPaidOrderId}
        personId={userId ? parseInt(userId) : null}
      />

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
