import axios from 'axios';

// Get the base URL for the API server
const getBaseUrl = () => {
  return 'https://tabble.onrender.com';
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

  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post('/customer/api/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/customer/api/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Phone authentication
  phoneAuth: async (phoneData) => {
    try {
      const response = await api.post('/customer/api/phone-auth', phoneData);
      return response.data;
    } catch (error) {
      console.error('Error initiating phone auth:', error);
      throw error;
    }
  },

  verifyOtp: async (otpData) => {
    try {
      const response = await api.post('/customer/api/verify-otp', otpData);
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  registerPhoneUser: async (userData) => {
    try {
      const response = await api.post('/customer/api/register-phone-user', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering phone user:', error);
      throw error;
    }
  },

  // Menu related endpoints
  getOffers: async () => {
    try {
      const response = await api.get('/customer/api/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  getSpecials: async () => {
    try {
      const response = await api.get('/customer/api/specials');
      return response.data;
    } catch (error) {
      console.error('Error fetching specials:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/customer/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Order related endpoints
  createOrder: async (orderData, personId = null) => {
    try {
      const url = personId ? `/customer/api/orders?person_id=${personId}` : '/customer/api/orders';
      const response = await api.post(url, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/customer/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  getPersonOrders: async (personId) => {
    try {
      const response = await api.get(`/customer/api/person/${personId}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching person orders:', error);
      throw error;
    }
  },

  requestPayment: async (orderId) => {
    try {
      const response = await api.put(`/customer/api/orders/${orderId}/payment`);
      return response.data;
    } catch (error) {
      console.error('Error requesting payment:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/customer/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  // Person related endpoints
  getPerson: async (personId) => {
    try {
      const response = await api.get(`/customer/api/person/${personId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching person:', error);
      throw error;
    }
  }
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
  }
};

// Admin API services
export const adminService = {
  // Get hotel settings
  getSettings: async () => {
    try {
      const response = await api.get('/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update hotel settings
  updateSettings: async (formData) => {
    try {
      const response = await api.put('/settings/', formData, {
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

  // Order related endpoints
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

  generateMultiBill: async (orderIds) => {
    try {
      const response = await api.post('/admin/orders/multi-bill', orderIds, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating multi-order bill:', error);
      throw error;
    }
  },

  mergeOrders: async (sourceOrderId, targetOrderId) => {
    try {
      const response = await api.post('/admin/orders/merge', null, {
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

  markOrderAsPaid: async (orderId) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/paid`);
      return response.data;
    } catch (error) {
      console.error('Error marking order as paid:', error);
      throw error;
    }
  },

  // Dish and category management
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

  getOfferDishes: async () => {
    try {
      const response = await api.get('/admin/api/offers');
      return response.data;
    } catch (error) {
      console.error('Error fetching offer dishes:', error);
      throw error;
    }
  },

  getSpecialDishes: async () => {
    try {
      const response = await api.get('/admin/api/specials');
      return response.data;
    } catch (error) {
      console.error('Error fetching special dishes:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/admin/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

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

  deleteDish: async (dishId) => {
    try {
      const response = await api.delete(`/admin/api/dishes/${dishId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting dish:', error);
      throw error;
    }
  },

  // Stats
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/stats/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  }
};

// Analytics API services  
export const analyticsService = {
  // Dashboard stats
  getDashboardStats: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/analytics/dashboard${params.toString() ? '?' + params.toString() : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get top customers 
  getTopCustomers: async (limit = 10) => {
    try {
      const response = await api.get(`/analytics/top-customers?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top customers:', error);
      throw error;
    }
  },

  // Get top dishes
  getTopDishes: async (limit = 10) => {
    try {
      const response = await api.get(`/analytics/top-dishes?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top dishes:', error);
      throw error;
    }
  },

  // Get sales by category
  getSalesByCategory: async () => {
    try {
      const response = await api.get('/analytics/sales-by-category');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales by category:', error);
      throw error;
    }
  },

  // Get sales over time
  getSalesOverTime: async (days = 30) => {
    try {
      const response = await api.get(`/analytics/sales-over-time?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales over time:', error);
      throw error;
    }
  },

  // Get chef performance
  getChefPerformance: async (days = 30) => {
    try {
      const response = await api.get(`/analytics/chef-performance?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chef performance:', error);
      throw error;
    }
  },

  // Get table utilization
  getTableUtilization: async () => {
    try {
      const response = await api.get('/analytics/table-utilization');
      return response.data;
    } catch (error) {
      console.error('Error fetching table utilization:', error);
      throw error;
    }
  },

  // Get customer frequency analysis
  getCustomerFrequency: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/analytics/customer-frequency${params.toString() ? '?' + params.toString() : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer frequency:', error);
      throw error;
    }
  },

  // Get feedback analysis
  getFeedbackAnalysis: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const response = await api.get(`/analytics/feedback-analysis${params.toString() ? '?' + params.toString() : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback analysis:', error);
      throw error;
    }
  }
};

// Loyalty API services
export const loyaltyService = {
  getAllTiers: async () => {
    try {
      const response = await api.get('/loyalty/');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty tiers:', error);
      throw error;
    }
  },

  getActiveTiers: async () => {
    try {
      const response = await api.get('/loyalty/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active loyalty tiers:', error);
      throw error;
    }
  },

  getLoyaltyTier: async (tierId) => {
    try {
      const response = await api.get(`/loyalty/${tierId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty tier:', error);
      throw error;
    }
  },

  createLoyaltyTier: async (tierData) => {
    try {
      const response = await api.post('/loyalty/', tierData);
      return response.data;
    } catch (error) {
      console.error('Error creating loyalty tier:', error);
      throw error;
    }
  },

  updateLoyaltyTier: async (tierId, tierData) => {
    try {
      const response = await api.put(`/loyalty/${tierId}`, tierData);
      return response.data;
    } catch (error) {
      console.error('Error updating loyalty tier:', error);
      throw error;
    }
  },

  deleteLoyaltyTier: async (tierId) => {
    try {
      const response = await api.delete(`/loyalty/${tierId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting loyalty tier:', error);
      throw error;
    }
  },

  getDiscountForVisitCount: async (visitCount) => {
    try {
      const response = await api.get(`/loyalty/discount/${visitCount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching discount for visit count:', error);
      throw error;
    }
  }
};

// Tables API services
export const tableService = {
  getAllTables: async () => {
    try {
      const response = await api.get('/tables/');
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  },

  getTable: async (tableId) => {
    try {
      const response = await api.get(`/tables/${tableId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching table:', error);
      throw error;
    }
  },

  getTableByNumber: async (tableNumber) => {
    try {
      const response = await api.get(`/tables/number/${tableNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching table by number:', error);
      throw error;
    }
  },

  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables/', tableData);
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },

  createTablesBatch: async (numTables) => {
    try {
      const response = await api.post(`/tables/batch?num_tables=${numTables}`);
      return response.data;
    } catch (error) {
      console.error('Error creating tables batch:', error);
      throw error;
    }
  },

  updateTable: async (tableId, tableData) => {
    try {
      const response = await api.put(`/tables/${tableId}`, tableData);
      return response.data;
    } catch (error) {
      console.error('Error updating table:', error);
      throw error;
    }
  },

  deleteTable: async (tableId) => {
    try {
      const response = await api.delete(`/tables/${tableId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  },

  getTableStatus: async () => {
    try {
      const response = await api.get('/tables/status/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching table status:', error);
      throw error;
    }
  },

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

  setTableOccupiedByNumber: async (tableNumber) => {
    try {
      const response = await api.put(`/tables/number/${tableNumber}/occupy`);
      return response.data;
    } catch (error) {
      console.error('Error setting table as occupied by number:', error);
      throw error;
    }
  },

  setTableFree: async (tableId) => {
    try {
      const response = await api.put(`/tables/${tableId}/free`);
      return response.data;
    } catch (error) {
      console.error('Error setting table as free:', error);
      throw error;
    }
  }
};

// Feedback API services
export const feedbackService = {
  getAllFeedback: async () => {
    try {
      const response = await api.get('/feedback/');
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback/', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },

  getFeedbackByOrder: async (orderId) => {
    try {
      const response = await api.get(`/feedback/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback by order:', error);
      throw error;
    }
  },

  getFeedbackByPerson: async (personId) => {
    try {
      const response = await api.get(`/feedback/person/${personId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback by person:', error);
      throw error;
    }
  }
};

// Selection Offers API services
export const selectionOfferService = {
  getAllOffers: async () => {
    try {
      const response = await api.get('/selection-offers/');
      return response.data;
    } catch (error) {
      console.error('Error fetching selection offers:', error);
      throw error;
    }
  },

  getActiveOffers: async () => {
    try {
      const response = await api.get('/selection-offers/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active selection offers:', error);
      throw error;
    }
  },

  getOffer: async (offerId) => {
    try {
      const response = await api.get(`/selection-offers/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching selection offer:', error);
      throw error;
    }
  },

  createOffer: async (offerData) => {
    try {
      const response = await api.post('/selection-offers/', offerData);
      return response.data;
    } catch (error) {
      console.error('Error creating selection offer:', error);
      throw error;
    }
  },

  updateOffer: async (offerId, offerData) => {
    try {
      const response = await api.put(`/selection-offers/${offerId}`, offerData);
      return response.data;
    } catch (error) {
      console.error('Error updating selection offer:', error);
      throw error;
    }
  },

  deleteOffer: async (offerId) => {
    try {
      const response = await api.delete(`/selection-offers/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting selection offer:', error);
      throw error;
    }
  },

  getDiscountForOrderAmount: async (orderAmount) => {
    try {
      const response = await api.get(`/selection-offers/discount/${orderAmount}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching discount for order amount:', error);
      throw error;
    }
  }
};

export default api;
