import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { chefService } from '../../services/api';

const ChefDashboard = () => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get pending orders
        const pendingOrders = await chefService.getPendingOrders();
        setPendingOrdersCount(pendingOrders.length);
        
        // Calculate total items
        let totalItems = 0;
        pendingOrders.forEach(order => {
          order.items.forEach(item => {
            totalItems += item.quantity;
          });
        });
        setTotalItemsCount(totalItems);
        
        // Get completed orders count
        const completedData = await chefService.getCompletedOrdersCount();
        setCompletedOrdersCount(completedData.count);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Chef Portal
        </Typography>
        
        <Tabs value={0} aria-label="chef tabs" sx={{ mb: 3 }}>
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
      
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="medium">Welcome to the Chef Portal</Typography>
        <Typography variant="body2">
          This is your kitchen dashboard. Here you can view and manage orders that need to be prepared.
          Use the "Pending Orders" tab to see orders that customers have placed and mark them as completed when ready.
        </Typography>
      </Alert>
      
      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Today's Summary
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'warning.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Box sx={{ color: 'warning.main', mb: 2 }}>
                      <RestaurantIcon sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" color="warning.dark">
                      {pendingOrdersCount}
                    </Typography>
                    <Typography variant="h6" component="div" color="text.secondary">
                      Pending Orders
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      color="warning" 
                      component={RouterLink}
                      to="/chef/orders"
                      sx={{ mt: 2 }}
                    >
                      View Orders
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'success.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Box sx={{ color: 'success.main', mb: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" color="success.dark">
                      {completedOrdersCount}
                    </Typography>
                    <Typography variant="h6" component="div" color="text.secondary">
                      Completed Orders
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      color="success" 
                      disabled
                      sx={{ mt: 2, visibility: 'hidden' }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      <LocalDiningIcon sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" color="primary.dark">
                      {totalItemsCount}
                    </Typography>
                    <Typography variant="h6" component="div" color="text.secondary">
                      Total Items Prepared
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      disabled
                      sx={{ mt: 2, visibility: 'hidden' }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
      
      <Box my={5}>
        <Divider />
      </Box>
      
      <Box textAlign="center" py={3}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 2 
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <ListAltIcon color="action" sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink}
            to="/chef/orders"
            sx={{ mt: 2 }}
          >
            Manage Pending Orders
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ChefDashboard;
