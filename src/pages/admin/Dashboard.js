import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminDashboard = () => {
  // State
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    paid_orders: 0
  });
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch stats and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get statistics
        const statsData = await adminService.getOrderStats();
        setStats(statsData);
        setLoading(false);

        // Get orders
        await fetchOrders(statusFilter);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load dashboard data',
          severity: 'error'
        });
        setLoading(false);
        setLoadingOrders(false);
      }
    };

    fetchData();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  // Fetch orders with optional status filter
  const fetchOrders = async (status = '') => {
    setLoadingOrders(true);
    try {
      const ordersData = await adminService.getOrders(status);
      setOrders(ordersData);
      setLoadingOrders(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders',
        severity: 'error'
      });
      setLoadingOrders(false);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    fetchOrders(newStatus);
  };

  // View order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  // Close order details dialog
  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
  };

  // Mark order as paid
  const handleMarkAsPaid = async (orderId) => {
    try {
      await adminService.markOrderAsPaid(orderId);

      // Close dialog
      setOrderDetailsOpen(false);

      // Show success message
      setSnackbar({
        open: true,
        message: 'Order marked as paid!',
        severity: 'success'
      });

      // Refresh data
      const statsData = await adminService.getOrderStats();
      setStats(statsData);
      await fetchOrders(statusFilter);
    } catch (error) {
      console.error('Error marking order as paid:', error);
      setSnackbar({
        open: true,
        message: 'Failed to mark order as paid',
        severity: 'error'
      });
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

  // Get status chip
  const getStatusChip = (status) => {
    let color, icon, label;

    switch (status) {
      case 'pending':
        color = 'warning';
        icon = <PendingIcon fontSize="small" />;
        label = 'Pending';
        break;
      case 'completed':
        color = 'success';
        icon = <CheckCircleIcon fontSize="small" />;
        label = 'Completed';
        break;
      case 'payment_requested':
        color = 'info';
        icon = <ReceiptIcon fontSize="small" />;
        label = 'Payment Requested';
        break;
      case 'paid':
        color = 'secondary';
        icon = <PaidIcon fontSize="small" />;
        label = 'Paid';
        break;
      default:
        color = 'default';
        icon = null;
        label = status;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        sx={{ '& .MuiChip-icon': { fontSize: '1rem' } }}
      />
    );
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    if (!order || !order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + (item.dish.price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
      </Box>

      {/* Statistics */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                borderTop: '4px solid',
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
                    <ReceiptIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="primary.dark">
                    {stats.total_orders}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                borderTop: '4px solid',
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
                    <PendingIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="warning.dark">
                    {stats.pending_orders}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                borderTop: '4px solid',
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
                    {stats.completed_orders}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Completed Orders
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                borderTop: '4px solid',
                borderColor: 'secondary.main',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
              component={RouterLink}
              to="/admin/completed-orders"
              style={{ textDecoration: 'none' }}
            >
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <Box sx={{ color: 'secondary.main', mb: 2 }}>
                    <PaidIcon sx={{ fontSize: 48 }} />
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" color="secondary.dark">
                    {stats.paid_orders}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Paid Orders
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Orders */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
          Recent Orders
        </Typography>

        <Box mb={3}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Filter by Status"
            >
              <MenuItem value="">All Orders</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="payment_requested">Payment Requested</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loadingOrders ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Alert severity="info">No orders found.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Unique ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.table_number}</TableCell>
                    <TableCell>{order.unique_id}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Order Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order ID
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    #{selectedOrder.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Table
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedOrder.table_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {getStatusChip(selectedOrder.status)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Time
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedOrder.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Unique ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.unique_id}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.dish.name}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${item.dish.price.toFixed(2)}</TableCell>
                        <TableCell align="right">${(item.dish.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>{item.remarks || '-'}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Total Amount:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${calculateOrderTotal(selectedOrder)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails}>Close</Button>
          {selectedOrder && selectedOrder.status === 'payment_requested' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PaidIcon />}
              onClick={() => handleMarkAsPaid(selectedOrder.id)}
            >
              Mark as Paid
            </Button>
          )}
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

export default AdminDashboard;
