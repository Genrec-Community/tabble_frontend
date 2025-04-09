import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://tabble.onrender.com'
    : 'https://tabble.onrender.com',
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
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/customer/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/customer/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
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
  // Get all dishes
  getDishes: async () => {
    try {
      const response = await api.get('/admin/api/dishes');
      return response.data;
    } catch (error) {
      console.error('Error fetching dishes:', error);
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
};

export default api;
