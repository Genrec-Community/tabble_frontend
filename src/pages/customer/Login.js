import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Grow,
  Fade,
  Card,
  CardMedia,
  Grid,
  useTheme,
  styled
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import KeyIcon from '@mui/icons-material/Key';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease-in-out',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  },
  '& .MuiInputAdornment-root': {
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  fontWeight: 600,
  padding: '12px 24px',
  fontSize: '1rem',
  boxShadow: '0 8px 20px rgba(255, 90, 95, 0.25)',
  transition: 'all 0.3s ease',
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 25px rgba(255, 90, 95, 0.35)',
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  }
}));

const LoginBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  textAlign: 'center',
  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  overflow: 'hidden',
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const CustomerLogin = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tableNumber, setTableNumber] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [tableError, setTableError] = useState('');
  const [uniqueIdError, setUniqueIdError] = useState('');
  const [animateIdField, setAnimateIdField] = useState(false);

  // Food images for the gallery
  const foodImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  ];

  const generateUniqueId = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setUniqueId(uniqueId);
    setUniqueIdError('');
    setAnimateIdField(true);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setAnimateIdField(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate table number
    if (!tableNumber) {
      setTableError('Please enter a table number');
      isValid = false;
    } else {
      setTableError('');
    }

    // Validate unique ID
    if (!uniqueId) {
      setUniqueIdError('Please generate a unique ID');
      isValid = false;
    } else {
      setUniqueIdError('');
    }

    if (isValid) {
      navigate(`/customer/menu?table_number=${tableNumber}&unique_id=${uniqueId}`);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4} alignItems="center" sx={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Left side: Form */}
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={800}>
            <LoginBox>
              <Fade in={true} timeout={1200}>
                <Box>
                  <Box mb={4} display="flex" alignItems="center" justifyContent="center">
                    <FoodBankIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1.5 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      Tabble
                    </Typography>
                  </Box>

                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Welcome to Your Digital Dining Experience
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
                    Enjoy our exquisite menu, place orders with ease, and experience a seamless dining journey with us.
                  </Typography>
                  
                  <Box mb={4}>
                    <form onSubmit={handleSubmit}>
                      <StyledTextField
                        label="Table Number"
                        variant="outlined"
                        type="number"
                        fullWidth
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        error={!!tableError}
                        helperText={tableError}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TableRestaurantIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />
                      
                      <Box sx={{ position: 'relative' }}>
                        <Fade in={animateIdField} timeout={400}>
                          <Box 
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'rgba(255, 90, 95, 0.05)',
                              borderRadius: 3,
                              zIndex: -1
                            }}
                          />
                        </Fade>
                        <StyledTextField
                          label="Unique ID"
                          variant="outlined"
                          fullWidth
                          value={uniqueId}
                          InputProps={{
                            readOnly: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <KeyIcon />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={generateUniqueId}
                                  sx={{ 
                                    borderRadius: 3,
                                    px: 2,
                                    fontWeight: 'medium',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  Generate
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                          error={!!uniqueIdError}
                          helperText={uniqueIdError || "Click 'Generate' to get a unique ID for your table"}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 5, position: 'relative' }}>
                        <AnimatedButton
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          endIcon={<ArrowForwardIcon />}
                        >
                          Enter Menu
                        </AnimatedButton>
                      </Box>
                    </form>
                  </Box>
                </Box>
              </Fade>
            </LoginBox>
          </Grow>
        </Grid>
        
        {/* Right side: Food gallery */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', position: 'relative' }}>
            <Grid container spacing={2}>
              {foodImages.map((image, index) => (
                <Grid item xs={6} key={index}>
                  <Grow in={true} timeout={(index + 1) * 300 + 800}>
                    <Card 
                      sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden', 
                        boxShadow: 3,
                        height: index % 2 === 0 ? 280 : 220,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="100%"
                        image={image}
                        alt={`Food item ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
            
            <Fade in={true} timeout={2000}>
              <Box 
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 0,
                  right: 0,
                  mx: 'auto',
                  width: '80%',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  <LocalDiningIcon sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.primary.main }} />
                  Exquisite Dining Experience
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discover our award-winning cuisine featuring local ingredients and innovative recipes
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerLogin;
