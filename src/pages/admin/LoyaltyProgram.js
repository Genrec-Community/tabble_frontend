import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PercentIcon from '@mui/icons-material/Percent';
import { loyaltyService } from '../../services/api';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'medium',
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const LoyaltyProgram = () => {
  // State
  const [loyaltyTiers, setLoyaltyTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTier, setCurrentTier] = useState(null);
  const [formData, setFormData] = useState({
    visit_count: '',
    discount_percentage: '',
    is_active: true
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  // Fetch loyalty tiers on component mount
  useEffect(() => {
    fetchLoyaltyTiers();
  }, []);

  // Fetch loyalty tiers from API
  const fetchLoyaltyTiers = async () => {
    try {
      setLoading(true);
      const data = await loyaltyService.getAllTiers();
      setLoyaltyTiers(data);
    } catch (error) {
      console.error('Error fetching loyalty tiers:', error);
      setSnackbar({
        open: true,
        message: 'Error loading loyalty program data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle numeric inputs
    if (type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      if (name === 'visit_count' && (numValue < 1 || !Number.isInteger(numValue))) {
        setErrors({
          ...errors,
          [name]: 'Visit count must be a positive integer'
        });
      } else if (name === 'discount_percentage' && (numValue < 0 || numValue > 100)) {
        setErrors({
          ...errors,
          [name]: 'Discount must be between 0 and 100'
        });
      } else {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const visitCount = parseInt(formData.visit_count);
    const discountPercentage = parseFloat(formData.discount_percentage);

    if (!formData.visit_count || isNaN(visitCount)) {
      newErrors.visit_count = 'Visit count is required';
    } else if (visitCount < 1 || !Number.isInteger(visitCount)) {
      newErrors.visit_count = 'Visit count must be a positive integer';
    }

    if (!formData.discount_percentage || isNaN(discountPercentage)) {
      newErrors.discount_percentage = 'Discount percentage is required';
    } else if (discountPercentage < 0 || discountPercentage > 100) {
      newErrors.discount_percentage = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open dialog to add new tier
  const handleOpenAddDialog = () => {
    setFormData({
      visit_count: '',
      discount_percentage: '',
      is_active: true
    });
    setEditMode(false);
    setDialogOpen(true);
  };

  // Open dialog to edit tier
  const handleOpenEditDialog = (tier) => {
    setFormData({
      visit_count: tier.visit_count.toString(),
      discount_percentage: tier.discount_percentage.toString(),
      is_active: tier.is_active
    });
    setCurrentTier(tier);
    setEditMode(true);
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setErrors({});
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (tier) => {
    setTierToDelete(tier);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  // Submit form to create or update tier
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const tierData = {
      visit_count: parseInt(formData.visit_count),
      discount_percentage: parseFloat(formData.discount_percentage),
      is_active: formData.is_active
    };

    try {
      if (editMode) {
        // Update existing tier
        await loyaltyService.updateLoyaltyTier(currentTier.id, tierData);

        setSnackbar({
          open: true,
          message: 'Loyalty tier updated successfully',
          severity: 'success'
        });
      } else {
        // Create new tier
        await loyaltyService.createLoyaltyTier(tierData);

        setSnackbar({
          open: true,
          message: 'Loyalty tier created successfully',
          severity: 'success'
        });
      }

      // Refresh data and close dialog
      fetchLoyaltyTiers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving loyalty tier:', error);

      // Handle specific API errors
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string' &&
          error.response.data.detail.includes('already exists')) {
          setErrors({
            ...errors,
            visit_count: 'A tier with this visit count already exists'
          });
        } else if (Array.isArray(error.response.data.detail)) {
          // Handle validation errors from FastAPI
          const validationErrors = {};
          error.response.data.detail.forEach(err => {
            const field = err.loc[err.loc.length - 1];
            validationErrors[field] = err.msg;
          });
          setErrors(validationErrors);
        } else {
          setSnackbar({
            open: true,
            message: error.response.data.detail,
            severity: 'error'
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Error saving loyalty tier. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  // Delete tier
  const handleDeleteTier = async () => {
    try {
      await loyaltyService.deleteLoyaltyTier(tierToDelete.id);

      setSnackbar({
        open: true,
        message: 'Loyalty tier deleted successfully',
        severity: 'success'
      });

      // Refresh data and close dialog
      fetchLoyaltyTiers();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting loyalty tier:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting loyalty tier. Please try again.',
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Admin Portal
        </Typography>

        <Tabs value={4} aria-label="admin tabs" sx={{ mb: 3 }}>
          <Tab
            label="Dashboard"
            component={RouterLink}
            to="/admin"
            sx={{ fontWeight: 'medium' }}
          />
          <Tab
            label="Manage Dishes"
            component={RouterLink}
            to="/admin/dishes"
            sx={{ fontWeight: 'medium' }}
          />
          <Tab
            label="Manage Offers"
            component={RouterLink}
            to="/admin/offers"
            sx={{ fontWeight: 'medium' }}
          />
          <Tab
            label="Today's Special"
            component={RouterLink}
            to="/admin/specials"
            sx={{ fontWeight: 'medium' }}
          />
          <Tab
            label="Loyalty Program"
            component={RouterLink}
            to="/admin/loyalty"
            sx={{ fontWeight: 'medium' }}
          />
          <Tab
            label="Completed Orders"
            component={RouterLink}
            to="/admin/completed-orders"
            sx={{ fontWeight: 'medium' }}
          />
        </Tabs>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <CardMembershipIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Loyalty Program Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }}
          >
            Add New Tier
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box mb={3}>
          <Typography variant="body1" paragraph>
            Set up loyalty tiers based on customer visit counts. When a customer reaches a specific visit count,
            they will automatically receive the corresponding discount on their orders.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>How it works:</strong> When a customer's visit count matches or exceeds a tier threshold,
              they will receive the discount percentage defined for that tier. If a customer qualifies for multiple tiers,
              the highest applicable discount will be applied.
            </Typography>
          </Alert>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : loyaltyTiers.length === 0 ? (
          <Alert severity="info">
            No loyalty tiers have been created yet. Add your first tier to start the loyalty program.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Visit Count</StyledTableCell>
                  <StyledTableCell>Discount Percentage</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created At</StyledTableCell>
                  <StyledTableCell>Updated At</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loyaltyTiers.map((tier) => (
                  <StyledTableRow key={tier.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <CardMembershipIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {tier.visit_count} visits
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PercentIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                        {tier.discount_percentage}%
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tier.is_active ? 'Active' : 'Inactive'}
                        color={tier.is_active ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(tier.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(tier.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditDialog(tier)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteDialog(tier)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight="bold">
            {editMode ? 'Edit Loyalty Tier' : 'Add New Loyalty Tier'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Visit Count"
                name="visit_count"
                type="number"
                value={formData.visit_count}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={!!errors.visit_count}
                helperText={errors.visit_count}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount Percentage"
                name="discount_percentage"
                type="number"
                value={formData.discount_percentage}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={!!errors.discount_percentage}
                helperText={errors.discount_percentage}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 },
                  endAdornment: <PercentIcon color="action" />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight="bold" color="error">
            Delete Loyalty Tier
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the loyalty tier for {tierToDelete?.visit_count} visits with {tierToDelete?.discount_percentage}% discount?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTier}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default LoyaltyProgram;
