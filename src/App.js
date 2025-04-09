import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import ChefDashboard from './pages/chef/Dashboard';
import ChefOrders from './pages/chef/Orders';
import CustomerLogin from './pages/customer/Login';
import CustomerMenu from './pages/customer/Menu';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDishes from './pages/admin/Dishes';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F', // Modern reddish accent color
      light: '#FF7E82',
      dark: '#E5484D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A699', // Complementary teal color
      light: '#4ECDC4',
      dark: '#018786',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF385C',
    },
    warning: {
      main: '#F8B400',
      light: '#FFD166',
    },
    success: {
      main: '#4DAA57',
      light: '#6ECF77',
    },
    info: {
      main: '#2196F3',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2A2A2A',
      secondary: '#6B6B6B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.06)',
    '0px 6px 12px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.08)',
    '0px 10px 20px rgba(0,0,0,0.09)',
    // ...existing shadows
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.07)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #FF5A5F 0%, #FF385C 100%)',
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #00A699 0%, #018786 100%)',  
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '8px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Chef Routes */}
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/chef/orders" element={<ChefOrders />} />
            
            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerLogin />} />
            <Route path="/customer/menu" element={<CustomerMenu />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dishes" element={<AdminDishes />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
