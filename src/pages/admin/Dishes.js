import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { adminService } from '../../services/api';

const AdminDishes = () => {
  // State
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    image: null,
    imagePreview: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    dishId: null,
    dishName: ''
  });

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  // Fetch dishes
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const dishesData = await adminService.getDishes();
      setDishes(dishesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load dishes',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({
        ...formValues,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
      // Clear error for image
      if (formErrors.image) {
        setFormErrors({
          ...formErrors,
          image: null
        });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.name) {
      errors.name = 'Name is required';
    }
    
    if (!formValues.category) {
      errors.category = 'Category is required';
    }
    
    if (!formValues.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formValues.price) || parseFloat(formValues.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formValues.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(formValues.quantity) || parseInt(formValues.quantity) < 0) {
      errors.quantity = 'Quantity must be a non-negative number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      const dishData = {
        name: formValues.name,
        description: formValues.description || '',
        category: formValues.category,
        price: parseFloat(formValues.price),
        quantity: parseInt(formValues.quantity)
      };
      
      if (formValues.image) {
        dishData.image = formValues.image;
      }
      
      await adminService.createDish(dishData);
      
      // Reset form
      setFormValues({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        image: null,
        imagePreview: null
      });
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Dish added successfully!',
        severity: 'success'
      });
      
      // Refresh dishes
      fetchDishes();
      
      setSubmitLoading(false);
    } catch (error) {
      console.error('Error adding dish:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add dish',
        severity: 'error'
      });
      setSubmitLoading(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteDialogOpen = (dishId, dishName) => {
    setDeleteDialog({
      open: true,
      dishId,
      dishName
    });
  };

  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false
    });
  };

  // Delete dish
  const handleDeleteDish = async () => {
    try {
      await adminService.deleteDish(deleteDialog.dishId);
      
      // Close dialog
      handleDeleteDialogClose();
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Dish deleted successfully!',
        severity: 'success'
      });
      
      // Refresh dishes
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete dish',
        severity: 'error'
      });
      handleDeleteDialogClose();
    }
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Admin Portal
        </Typography>
        
        <Tabs value={1} aria-label="admin tabs" sx={{ mb: 3 }}>
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
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        {/* Dish Form */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
              Add New Dish
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Dish Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formValues.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
              
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={formValues.description}
                onChange={handleFormChange}
              />
              
              <FormControl 
                fullWidth 
                margin="normal" 
                error={!!formErrors.category}
                required
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  label="Category"
                  value={formValues.category}
                  onChange={handleFormChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <FormHelperText>{formErrors.category}</FormHelperText>
                )}
              </FormControl>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="price"
                    label="Price"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    value={formValues.price}
                    onChange={handleFormChange}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="quantity"
                    label="Quantity Available"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    value={formValues.quantity}
                    onChange={handleFormChange}
                    error={!!formErrors.quantity}
                    helperText={formErrors.quantity}
                    required
                  />
                </Grid>
              </Grid>
              
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Dish Image
                </Typography>
                <Box 
                  sx={{ 
                    border: '1px dashed',
                    borderColor: formErrors.image ? 'error.main' : 'divider',
                    borderRadius: 1,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: formErrors.image ? 'error.lighter' : 'background.paper',
                    height: formValues.imagePreview ? 'auto' : '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  
                  {formValues.imagePreview ? (
                    <Box sx={{ width: '100%' }}>
                      <img 
                        src={formValues.imagePreview} 
                        alt="Dish preview" 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      />
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                        startIcon={<PhotoCameraIcon />}
                      >
                        Change Image
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <PhotoCameraIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload an image
                      </Typography>
                    </>
                  )}
                </Box>
                {formErrors.image && (
                  <FormHelperText error>{formErrors.image}</FormHelperText>
                )}
              </Box>
              
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<AddIcon />}
                  disabled={submitLoading}
                >
                  {submitLoading ? <CircularProgress size={24} /> : 'Add Dish'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
        
        {/* Dish List */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
            All Dishes
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : dishes.length === 0 ? (
            <Alert severity="info">No dishes available. Add your first dish!</Alert>
          ) : (
            <Grid container spacing={3}>
              {dishes.map((dish) => (
                <Grid item xs={12} sm={6} md={4} key={dish.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={dish.image_path ? `${process.env.REACT_APP_API_URL}${dish.image_path}` : '/static/images/default-dish.jpg'}
                      alt={dish.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {dish.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '40px', overflow: 'hidden' }}>
                        {dish.description || 'No description available'}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Category:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {dish.category}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" color="text.secondary">
                          Price:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="medium" color="primary">
                          ${dish.price.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2" color="text.secondary">
                          Available:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {dish.quantity}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteDialogOpen(dish.id, dish.name)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Dish</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.dishName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteDish}
          >
            Delete
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

export default AdminDishes;
