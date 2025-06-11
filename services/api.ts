import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'https://foodiehub-backend-zs3s.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  updateProfile: async (userData: { name?: string; avatar?: string }) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
};
export const productsAPI = {
  getAll: async (category?: string) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/products', { params });
      return response.data.products;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
};
export const pointsAPI = {
  add: async (points: number, reason?: string) => {
    try {
      const response = await api.post('/points/add', { points, reason });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  redeem: async (points: number, reason?: string) => {
    try {
      const response = await api.post('/points/redeem', { points, reason });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  getHistory: async () => {
    try {
      const response = await api.get('/points/history');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
};
export const ordersAPI = {
  create: async (orderData: any) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { message: 'Network error' };
    }
  },
};
