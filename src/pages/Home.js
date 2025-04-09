import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Container,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StarIcon from '@mui/icons-material/Star';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Hero section background with gradient
  const heroBg = `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`;

  const portalCards = [
    {
      title: 'Chef Portal',
      description: 'Efficiently manage kitchen operations, handle orders, and update the menu in real-time',
      icon: <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />,
      link: '/chef',
      color: 'primary.light'
    },
    {
      title: 'Customer Portal',
      description: 'Browse our delightful menu, place orders, and enjoy a seamless dining experience',
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />,
      link: '/customer',
      color: 'secondary.light'
    },
    {
      title: 'Admin Portal',
      description: 'Complete oversight of operations, sales reports, and system configuration',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />,
      link: '/admin',
      color: 'warning.light'
    }
  ];

  const features = [
    {
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      title: 'Digital Menu',
      description: 'Our beautifully designed digital menu showcases dishes with stunning imagery'
    },
    {
      icon: <DeliveryDiningIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Orders',
      description: 'Kitchen receives orders instantly for faster preparation and service'
    },
    {
      icon: <LocalDiningIcon sx={{ fontSize: 40 }} />,
      title: 'Table Management',
      description: 'Efficient table management system for better customer experience'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 }, 
          px: 2,
          mt: -4,
          mb: 8,
          background: heroBg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: { xs: '0 0 24px 24px', md: '0 0 32px 32px' },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Fade in={true} timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: 'primary.main',
                    lineHeight: 1.2
                  }}
                >
                  Elevate Your Dining Experience
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 4, maxWidth: '600px' }}
                >
                  Tabble brings seamless digital ordering and kitchen management to your restaurant
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    component={RouterLink}
                    to="/customer"
                    sx={{ 
                      py: 1.5, 
                      px: 4, 
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 16px rgba(255, 90, 95, 0.25)' 
                    }}
                  >
                    Start Ordering
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="large" 
                    component={RouterLink}
                    to="/chef"
                    sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
                  >
                    Kitchen Portal
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: '300px',
                      height: '300px',
                      right: -40,
                      top: -40,
                      background: 'rgba(255, 90, 95, 0.1)',
                      borderRadius: '50%',
                      zIndex: -1
                    }
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transform: 'rotate(2deg)',
                      width: '100%',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                      alt="Delicious cuisine" 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container>
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            fontWeight="bold"
            sx={{ position: 'relative', display: 'inline-block', mx: 'auto', mb: 3 }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                height: '8px',
                width: '50%',
                bottom: '0px',
                left: '25%',
                backgroundColor: 'rgba(255, 90, 95, 0.2)',
                zIndex: -1,
                borderRadius: '4px'
              }}
            />
            Smart Dining Features
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: '700px', mx: 'auto', mb: 6 }}
          >
            Our platform offers cutting-edge restaurant management capabilities for a seamless, elegant experience
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={true} timeout={(index + 1) * 500}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      borderTop: '5px solid',
                      borderColor: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : 'warning.main',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ color: index === 0 ? 'primary.main' : index === 1 ? 'secondary.main' : 'warning.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Portals/Cards Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8, borderRadius: '24px' }}>
        <Container>
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Access Our Portals
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: '700px', mx: 'auto', mb: 6 }}
          >
            Choose the right portal for your needs and get started
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {portalCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in={true} timeout={(index + 1) * 500}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                      },
                      position: 'relative',
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: -20,
                        left: 'calc(50% - 30px)',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        zIndex: 2
                      }}
                    >
                      {card.icon}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 5, pb: 3, px: 3 }}>
                      <Box 
                        sx={{
                          backgroundColor: `${card.color}20`,
                          py: 3,
                          px: 2,
                          borderRadius: 2,
                          mb: 2
                        }}
                      >
                        <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3, mt: 1 }}>
                          {card.description}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        color={index === 0 ? "primary" : index === 1 ? "secondary" : "warning"}
                        component={RouterLink} 
                        to={card.link}
                        size="large"
                        fullWidth
                        sx={{ py: 1.2, fontSize: '1rem' }}
                      >
                        Access {card.title}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial/Social Proof Section */}
      <Container sx={{ my: 8 }}>
        <Paper elevation={2} sx={{ 
          borderRadius: '24px', 
          p: { xs: 3, md: 5 },
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              right: -20, 
              bottom: -20, 
              fontSize: '120px', 
              opacity: 0.05, 
              color: 'primary.main',
              transform: 'rotate(-10deg)'
            }}
          >
            "
          </Box>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Beautiful dish"
                  sx={{
                    width: '80%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 24 }} />
                ))}
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontStyle: 'italic', mb: 3 }}>
                "Tabble has completely transformed our restaurant's operation. Orders are processed faster, customers are happier, and our staff can focus on delivering an exceptional dining experience."
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Michael Johnson
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Executive Chef, The Grand Restaurant
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Call to Action */}
      <Container sx={{ mb: 8 }}>
        <Box 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px rgba(255, 90, 95, 0.2)',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Ready to Elevate Your Dining?
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 4, opacity: 0.9 }}>
            Start using Tabble today and transform your restaurant experience
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            component={RouterLink}
            to="/customer"
            sx={{ 
              py: 1.5, 
              px: 5, 
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
