import React from 'react';
import {
  Box,
  Typography,
  Grid,
  CardContent,
  Divider,
  CircularProgress,
  Zoom
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import {
  DishCard,
  CategoryBadge,
  SpecialBadge,
  AddButton
} from './MenuStyled';

// Helper function to get correct image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://tabble.onrender.com${imagePath}`;
};

const MenuItemsGrid = ({
  dishes,
  filteredDishes,
  currentCategory,
  loading,
  handleOpenDialog,
  categoryColors,
  theme
}) => {
  // Show all dishes without filtering out featured dishes
  const displayDishes = filteredDishes;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          '&:after': {
            content: '""',
            display: 'block',
            height: '1px',
            flexGrow: 1,
            backgroundColor: 'rgba(255, 165, 0, 0.3)',
            ml: 2
          }
        }}
      >
        <Typography variant="h5" color="white" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          {currentCategory === 'All' ? 'All Items' : currentCategory}
        </Typography>
      </Box>

      {/* Menu Items Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#FFA500' }} />
        </Box>
      ) : (
        <Grid container spacing={6}>
          {displayDishes.map((dish) => (
            <Grid item xs={12} sm={6} md={6} key={dish.id}>
              <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                <DishCard onClick={() => handleOpenDialog(dish)} sx={{ display: 'flex', flexDirection: 'row', height: '340px' }}>
                  {/* Left side - Image */}
                  <Box sx={{ width: '55%', position: 'relative' }}>
                    <Box
                      component="img"
                      src={getImageUrl(dish.image_path)}
                      alt={dish.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'relative'
                      }}
                    />

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

                  {/* Right side - Content */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <CardContent sx={{
                      flex: '1 0 auto',
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      backgroundColor: '#121212',
                      color: 'white'
                    }}>
                      <Box>
                        <Typography gutterBottom variant="h5" component="div" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                          {dish.name}
                        </Typography>

                        {dish.description && (
                          <Typography
                            variant="h6"
                            sx={{ mb: 1, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}
                          >
                            {dish.description.length > 80
                              ? dish.description.substring(0, 80) + '...'
                              : dish.description}
                          </Typography>
                        )}
                      </Box>

                      <Box>
                        <Divider sx={{ my: 1, backgroundColor: 'rgba(255, 165, 0, 0.2)' }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                          <Typography variant="h6" fontWeight="bold" color="#FFA500">
                            ${dish.price.toFixed(2)}
                          </Typography>
                          <AddButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(dish);
                            }}
                            sx={{ py: 1.5, px: 3, fontSize: '1.1rem' }}
                          >
                            Add
                          </AddButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Box>
                </DishCard>
              </Zoom>
            </Grid>
          ))}

          {filteredDishes.length === 0 && !loading && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8} sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 165, 0, 0.2)'
              }}>
                <RestaurantIcon sx={{ fontSize: 80, color: 'rgba(255, 165, 0, 0.3)', mb: 3, opacity: 0.7 }} />
                <Typography variant="h6" color="white" gutterBottom fontWeight="medium">
                  No dishes available in this category
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ maxWidth: '400px', mx: 'auto' }}>
                  Please check back later or try another category from our luxury menu
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default MenuItemsGrid;
