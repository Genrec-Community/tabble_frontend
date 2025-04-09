import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Badge,
  Zoom
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { chefService } from '../../services/api';

const ChefOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    orderId: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const orders = await chefService.getPendingOrders();
      setPendingOrders(orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load pending orders',
        severity: 'error'
      });
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingOrders();
    
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchPendingOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Open confirm dialog
  const handleConfirmOpen = (orderId) => {
    setConfirmDialog({
      open: true,
      orderId
    });
  };
  
  // Close confirm dialog
  const handleConfirmClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false
    });
  };
  
  // Mark order as completed
  const handleCompleteOrder = async () => {
    try {
      await chefService.completeOrder(confirmDialog.orderId);
      
      // Close dialog
      handleConfirmClose();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Order marked as completed!',
        severity: 'success'
      });
      
      // Refresh orders
      fetchPendingOrders();
    } catch (error) {
      console.error('Error completing order:', error);
      
      // Show error message
      setSnackbar({
        open: true,
        message: 'Failed to complete order',
        severity: 'error'
      });
      
      // Close dialog
      handleConfirmClose();
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  // Calculate time elapsed
  const getTimeElapsed = (dateString) => {
    const orderTime = new Date(dateString);
    const now = new Date();
    const diffMs = now - orderTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 120) {
      return '1 hour ago';
    } else {
      return `${Math.floor(diffMins / 60)} hours ago`;
    }
  };
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Chef Portal
        </Typography>
        
        <Tabs value={1} aria-label="chef tabs" sx={{ mb: 3 }}>
          <Tab 
            label="Kitchen Dashboard" 
            component={RouterLink} 
            to="/chef" 
            sx={{ fontWeight: 'medium' }}
          />
          <Tab 
            label="Pending Orders" 
            component={RouterLink} 
            to="/chef/orders" 
            sx={{ fontWeight: 'medium' }}
          />
        </Tabs>
      </Box>
      
      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          <Badge
            badgeContent={pendingOrders.length}
            color="warning"
            showZero
            sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem', height: '1.2rem', minWidth: '1.2rem' } }}
          >
            <Box component="span" mr={1}>Pending Orders</Box>
          </Badge>
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : pendingOrders.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No pending orders at the moment.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {pendingOrders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <Card 
                    sx={{
                      borderLeft: '4px solid',
                      borderColor: 'warning.main',
                    }}
                  >
                    <CardHeader
                      title={
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" component="span">
                            Order #{order.id}
                          </Typography>
                          <Chip 
                            label={`Table ${order.table_number}`}
                            color="primary"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      }
                      subheader={
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                          <Typography variant="body2" color="text.secondary">
                            {getTimeElapsed(order.created_at)} ({formatDate(order.created_at)})
                          </Typography>
                        </Box>
                      }
                      action={
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleConfirmOpen(order.id)}
                          sx={{ mt: 1 }}
                        >
                          Complete
                        </Button>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        Order Items
                      </Typography>
                      <List disablePadding>
                        {order.items.map((item) => (
                          <ListItem 
                            key={item.id} 
                            disableGutters 
                            sx={{ 
                              py: 1,
                              borderBottom: '1px dashed rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="medium">
                                  {item.dish.name}
                                </Typography>
                              }
                              secondary={
                                item.remarks && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Note: {item.remarks}
                                  </Typography>
                                )
                              }
                            />
                            <Chip
                              label={`Qty: ${item.quantity}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      
      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark Order #{confirmDialog.orderId} as completed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleCompleteOrder}
            startIcon={<DoneAllIcon />}
          >
            Yes, Complete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChefOrders;
