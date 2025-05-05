import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#121212',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 165, 0, 0.2)',
    maxWidth: '500px',
    width: '100%'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'white',
    fontSize: '1.125rem',
    padding: '16px 14px',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const TableSetup = ({ open, onClose }) => {
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!tableNumber || tableNumber.trim() === '') {
      setError('Please enter a valid table number');
      return;
    }

    // Store table number in localStorage
    localStorage.setItem('tableNumber', tableNumber);
    
    // Close the dialog and notify parent
    onClose(tableNumber);
  };

  return (
    <StyledDialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside
      aria-labelledby="table-setup-dialog-title"
      fullWidth
    >
      <DialogTitle id="table-setup-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
          <TableRestaurantIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1.5 }} />
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
            TABBLE
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" mb={3}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Welcome to Tabble
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Please enter the table number to continue
          </Typography>
        </Box>
        
        <StyledTextField
          label="Table Number"
          variant="outlined"
          type="number"
          fullWidth
          value={tableNumber}
          onChange={(e) => {
            setTableNumber(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TableRestaurantIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 500
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default TableSetup;
