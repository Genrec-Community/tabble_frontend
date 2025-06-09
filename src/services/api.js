import axios from 'axios';

// Get the base URL dynamically based on the current window location
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }

  // In development, use the current hostname (works with both localhost and IP)
  // This error happened, coz, we didnt setup the URL correctly
  // const protocol = window.location.protocol;
  // const hostname = window.location.hostname;
  // const port = '8000'; // Backend port
  const protocol = "https:"
  const hostname = "tabble.onrender.com"
  return `${protocol}//${hostname}`;

  // return `${protocol}//${hostname}:${port}`;
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API services
export const customerService = {
  // Get all menu items
  getMenu: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/customer/api/menu', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },

  // Get offer dishes
  getOffers: async () => {
    try {
      const response = await api.get('/customer/api/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  // Get special dishes
  getSpecials: async () => {
    try {
      const response = await api.get('/customer/api/specials');
      return response.data;
    } catch (error) {
      console.error('Error fetching specials:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/customer/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new order
  createOrder: async (orderData, personId = null) => {
    try {
      // Add person_id as a query parameter if provided
      const params = personId ? { person_id: personId } : {};
      const response = await api.post('/customer/api/orders', orderData, { params });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Request payment for an order
  requestPayment: async (orderId) => {
    try {
      const response = await api.put(`/customer/api/orders/${orderId}/payment`);
      return response.data;
    } catch (error) {
      console.error('Error requesting payment:', error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/customer/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Get orders by person ID
  getPersonOrders: async (personId) => {
    try {
      const response = await api.get(`/customer/api/person/${personId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching person orders:', error);
      throw error;
    }
  },

  // Get person details
  getPerson: async (personId) => {
    try {
      const response = await api.get(`/customer/api/person/${personId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching person details:', error);
      throw error;
    }
  },

  // Set a table as occupied by table number
  setTableOccupiedByNumber: async (tableNumber) => {
    try {
      const response = await api.put(`/tables/number/${tableNumber}/occupy`);
      return response.data;
    } catch (error) {
      console.error('Error setting table as occupied by number:', error);
      // Don't throw error, just log it
      return null;
    }
  },

  // Submit feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback/', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Get feedback by order ID
  getFeedbackByOrder: async (orderId) => {
    try {
      const response = await api.get(`/feedback/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  // Get loyalty discount for visit count
  getLoyaltyDiscount: async (visitCount) => {
    try {
      const response = await api.get(`/loyalty/discount/${visitCount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty discount:', error);
      return { discount_percentage: 0, message: 'No loyalty discount available' };
    }
  },

  // Get selection offer discount for order amount
  getSelectionOfferDiscount: async (orderAmount) => {
    try {
      const response = await api.get(`/selection-offers/discount/${orderAmount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching selection offer discount:', error);
      return { discount_amount: 0, message: 'No selection offer discount available' };
    }
  },
};

// Chef API services
export const chefService = {
  // Get pending orders
  getPendingOrders: async () => {
    try {
      const response = await api.get('/chef/orders/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      throw error;
    }
  },

  // Mark an order as completed
  completeOrder: async (orderId) => {
    try {
      const response = await api.put(`/chef/orders/${orderId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  },

  // Get completed orders count
  getCompletedOrdersCount: async () => {
    try {
      const response = await api.get('/chef/api/completed-orders-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching completed orders count:', error);
      throw error;
    }
  },
};

// Admin API services
export const adminService = {
  // Get hotel settings
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update hotel settings
  updateSettings: async (formData) => {
    try {
      const response = await api.put('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Generate bill PDF for a single order
  generateBill: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}/bill`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating bill:', error);
      throw error;
    }
  },

  // Generate bill PDF for multiple orders
  generateMultiBill: async (orderIds) => {
    try {
      const response = await api.post(`/admin/orders/multi-bill`, orderIds, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating multi-order bill:', error);
      throw error;
    }
  },

  // Merge two orders
  mergeOrders: async (sourceOrderId, targetOrderId) => {
    try {
      const response = await api.post(`/admin/orders/merge`, null, {
        params: {
          source_order_id: sourceOrderId,
          target_order_id: targetOrderId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error merging orders:', error);
      throw error;
    }
  },
  // Get all dishes
  getDishes: async (isOffer = null, isSpecial = null) => {
    try {
      const params = {};
      if (isOffer !== null) params.is_offer = isOffer;
      if (isSpecial !== null) params.is_special = isSpecial;

      const response = await api.get('/admin/api/dishes', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw error;
    }
  },

  // Get offer dishes
  getOfferDishes: async () => {
    try {
      const response = await api.get('/admin/api/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offer dishes:', error);
      throw error;
    }
  },

  // Get special dishes
  getSpecialDishes: async () => {
    try {
      const response = await api.get('/admin/api/specials');
      return response.data;
    } catch (error) {
      console.error('Error fetching special dishes:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/admin/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (categoryName) => {
    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      const response = await api.post('/admin/api/categories', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Create a new dish
  createDish: async (dishData) => {
    try {
      const formData = new FormData();
      Object.keys(dishData).forEach(key => {
        formData.append(key, dishData[key]);
      });

      const response = await api.post('/admin/api/dishes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating dish:', error);
      throw error;
    }
  },

  // Delete a dish
  deleteDish: async (dishId) => {
    try {
      const response = await api.delete(`/admin/api/dishes/${dishId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting dish:', error);
      throw error;
    }
  },

  // Update a dish
  updateDish: async (dishId, dishData) => {
    try {
      const formData = new FormData();
      Object.keys(dishData).forEach(key => {
        formData.append(key, dishData[key]);
      });

      const response = await api.put(`/admin/api/dishes/${dishId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating dish:', error);
      throw error;
    }
  },

  // Get all orders
  getOrders: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/stats/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  },

  // Mark an order as paid
  markOrderAsPaid: async (orderId) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/paid`);
      return response.data;
    } catch (error) {
      console.error('Error marking order as paid:', error);
      throw error;
    }
  },

  // Get all loyalty program tiers
  getLoyaltyTiers: async () => {
    try {
      const response = await api.get('/loyalty/');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty tiers:', error);
      throw error;
    }
  },

  // Create a new loyalty tier
  createLoyaltyTier: async (tierData) => {
    try {
      const response = await api.post('/loyalty/', tierData);
      return response.data;
    } catch (error) {
      console.error('Error creating loyalty tier:', error);
      throw error;
    }
  },

  // Update a loyalty tier
  updateLoyaltyTier: async (tierId, tierData) => {
    try {
      const response = await api.put(`/loyalty/${tierId}`, tierData);
      return response.data;
    } catch (error) {
      console.error('Error updating loyalty tier:', error);
      throw error;
    }
  },

  // Delete a loyalty tier
  deleteLoyaltyTier: async (tierId) => {
    try {
      const response = await api.delete(`/loyalty/${tierId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting loyalty tier:', error);
      throw error;
    }
  },

  // Get all selection offers
  getSelectionOffers: async () => {
    try {
      const response = await api.get('/selection-offers/');
      return response.data;
    } catch (error) {
      console.error('Error fetching selection offers:', error);
      throw error;
    }
  },

  // Create a new selection offer
  createSelectionOffer: async (offerData) => {
    try {
      const response = await api.post('/selection-offers/', offerData);
      return response.data;
    } catch (error) {
      console.error('Error creating selection offer:', error);
      throw error;
    }
  },

  // Update a selection offer
  updateSelectionOffer: async (offerId, offerData) => {
    try {
      const response = await api.put(`/selection-offers/${offerId}`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error updating selection offer:', error);
      throw error;
    }
  },

  // Delete a selection offer
  deleteSelectionOffer: async (offerId) => {
    try {
      const response = await api.delete(`/selection-offers/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting selection offer:', error);
      throw error;
    }
  },

  // Get all tables
  getTables: async () => {
    try {
      const response = await api.get('/tables/');
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  },

  // Get table status summary
  getTableStatus: async () => {
    try {
      const response = await api.get('/tables/status/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching table status:', error);
      throw error;
    }
  },

  // Create a new table
  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables/', tableData);
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },

  // Create multiple tables at once
  createTablesBatch: async (numTables) => {
    try {
      const response = await api.post(`/tables/batch?num_tables=${numTables}`);
      return response.data;
    } catch (error) {
      console.error('Error creating tables batch:', error);
      throw error;
    }
  },

  // Update a table
  updateTable: async (tableId, tableData) => {
    try {
      const response = await api.put(`/tables/${tableId}`, tableData);
      return response.data;
    } catch (error) {
      console.error('Error updating table:', error);
      throw error;
    }
  },

  // Delete a table
  deleteTable: async (tableId) => {
    try {
      const response = await api.delete(`/tables/${tableId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  },

  // Set a table as occupied
  setTableOccupied: async (tableId, orderId = null) => {
    try {
      const url = orderId ? `/tables/${tableId}/occupy?order_id=${orderId}` : `/tables/${tableId}/occupy`;
      const response = await api.put(url);
      return response.data;
    } catch (error) {
      console.error('Error setting table as occupied:', error);
      throw error;
    }
  },

  // Set a table as occupied by table number
  setTableOccupiedByNumber: async (tableNumber) => {
    try {
      const response = await api.put(`/tables/number/${tableNumber}/occupy`);
      return response.data;
    } catch (error) {
      console.error('Error setting table as occupied by number:', error);
      throw error;
    }
  },

  // Set a table as free
  setTableFree: async (tableId) => {
    try {
      const response = await api.put(`/tables/${tableId}/free`);
      return response.data;
    } catch (error) {
      console.error('Error setting table as free:', error);
      throw error;
    }
  },
};

// Analytics API services
export const analyticsService = {
  // Get dashboard statistics
  getDashboardStats: async (startDate = null, endDate = null) => {
    try {
      let url = '/analytics/dashboard';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  // Get top customers
  getTopCustomers: async (limit = 10, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const response = await api.get(`/analytics/top-customers?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top customers:', error);
      throw error;
    }
  },

  // Get top dishes
  getTopDishes: async (limit = 10, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const response = await api.get(`/analytics/top-dishes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top dishes:', error);
      throw error;
    }
  },

  // Get sales by category
  getSalesByCategory: async (startDate = null, endDate = null) => {
    try {
      let url = '/analytics/sales-by-category';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by category:', error);
      throw error;
    }
  },

  // Get sales over time
  getSalesOverTime: async (days = 30, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('days', days);

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const response = await api.get(`/analytics/sales-over-time?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales over time:', error);
      throw error;
    }
  },

  // Get chef performance metrics
  getChefPerformance: async (days = 30, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('days', days);

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const response = await api.get(`/analytics/chef-performance?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chef performance:', error);
      throw error;
    }
  },

  // Get table utilization statistics
  getTableUtilization: async (startDate = null, endDate = null) => {
    try {
      let url = '/analytics/table-utilization';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching table utilization:', error);
      throw error;
    }
  },

  // Get customer visit frequency analysis
  getCustomerFrequency: async (startDate = null, endDate = null) => {
    try {
      let url = '/analytics/customer-frequency';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer frequency:', error);
      throw error;
    }
  },

  // Get feedback analysis
  getFeedbackAnalysis: async (startDate = null, endDate = null) => {
    try {
      let url = '/analytics/feedback-analysis';
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate);
      }

      if (endDate) {
        params.append('end_date', endDate);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback analysis:', error);
      throw error;
    }
  },
};

export default api;
