import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import ChefDashboard from './pages/chef/Dashboard';
import ChefOrders from './pages/chef/Orders';
import CustomerLogin from './pages/customer/Login';
import CustomerMenu from './pages/customer/Menu';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDishes from './pages/admin/Dishes';
import AdminOffers from './pages/admin/Offers';
import AdminSpecials from './pages/admin/Specials';
import CompletedOrders from './pages/admin/CompletedOrders';
import LoyaltyProgram from './pages/admin/LoyaltyProgram';
import SelectionOffers from './pages/admin/SelectionOffers';
import TableManagement from './pages/admin/TableManagement';
import AdminSettings from './pages/admin/Settings';

// Analysis Pages
import AnalysisDashboard from './pages/analysis/Dashboard';
import CustomerAnalysis from './pages/analysis/CustomerAnalysis';
import DishAnalysis from './pages/analysis/DishAnalysis';
import ChefAnalysis from './pages/analysis/ChefAnalysis';

// Create a theme with luxury hotel aesthetic
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA500', // Vibrant Orange as primary color
      light: '#FFB733', // Light Orange for subtle highlights
      dark: '#E69500', // Dark Orange for hover states
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // Black as secondary color
      light: '#333333', // Dark Gray for secondary text
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF385C',
    },
    warning: {
      main: '#FFA500', // Using orange for warnings too
      light: '#FFB733',
    },
    success: {
      main: '#4DAA57',
      light: '#6ECF77',
    },
    info: {
      main: '#2196F3',
    },
    background: {
      default: '#000000', // Black background
      paper: '#121212', // Dark paper background
    },
    text: {
      primary: '#FFFFFF', // White text for dark backgrounds
      secondary: '#F5F5F5', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif', // Elegant sans-serif font
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '32px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      fontSize: '28px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '24px',
    },
    h4: {
      fontWeight: 600,
      fontSize: '22px',
    },
    h5: {
      fontWeight: 600,
      fontSize: '20px',
    },
    h6: {
      fontWeight: 600,
      fontSize: '18px',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '16px',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '16px',
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 6, // Slightly reduced border radius for more elegant look
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.15)',
    '0px 4px 8px rgba(0,0,0,0.16)',
    '0px 6px 12px rgba(0,0,0,0.18)',
    '0px 8px 16px rgba(0,0,0,0.18)',
    '0px 10px 20px rgba(0,0,0,0.19)',
    // ...existing shadows
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', // Dark background for cards
          color: '#FFFFFF', // White text
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.16)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.18)',
          },
          borderTop: '1px solid rgba(255, 165, 0, 0.3)', // Subtle orange accent
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px', // Rounded corners as specified
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.17)',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: '#FFA500', // Solid orange for primary buttons
            '&:hover': {
              background: '#E69500', // Darker orange on hover
            },
          },
          '&.MuiButton-containedSecondary': {
            background: '#000000', // Black for secondary buttons
            '&:hover': {
              background: '#333333', // Slightly lighter on hover
            },
          },
        },
        outlined: {
          borderWidth: '2px',
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#FFA500',
            color: '#FFA500',
            '&:hover': {
              borderColor: '#E69500',
              backgroundColor: 'rgba(255, 165, 0, 0.08)',
            },
          },
        },
        text: {
          '&.MuiButton-textPrimary': {
            color: '#FFA500',
            '&:hover': {
              backgroundColor: 'rgba(255, 165, 0, 0.08)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', // Dark background for papers
          color: '#FFFFFF', // White text
          borderRadius: '8px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000', // Black app bar
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '4px',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#FFA500',
          },
        },
        outlined: {
          '&.MuiChip-colorPrimary': {
            borderColor: '#FFA500',
            color: '#FFA500',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 165, 0, 0.1)', // Subtle orange background
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 165, 0, 0.05)', // Subtle orange hover
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 165, 0, 0.2)', // Subtle orange dividers
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 165, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFA500',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#F5F5F5',
            '&.Mui-focused': {
              color: '#FFA500',
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 165, 0, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
            },
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
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            {/* Chef Routes */}
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/chef/orders" element={<ChefOrders />} />

            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerLogin />} />
            <Route path="/customer/menu" element={<CustomerMenu />} />
          </Route>

          {/* Admin Layout Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dishes" element={<AdminDishes />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/specials" element={<AdminSpecials />} />
            <Route path="/admin/completed-orders" element={<CompletedOrders />} />
            <Route path="/admin/loyalty" element={<LoyaltyProgram />} />
            <Route path="/admin/selection-offers" element={<SelectionOffers />} />
            <Route path="/admin/tables" element={<TableManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Analysis Routes */}
            <Route path="/analysis" element={<AnalysisDashboard />} />
            <Route path="/analysis/customer" element={<CustomerAnalysis />} />
            <Route path="/analysis/dish" element={<DishAnalysis />} />
            <Route path="/analysis/chef" element={<ChefAnalysis />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
