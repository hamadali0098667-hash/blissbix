const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('src/services/api.js', `import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`);

write('src/store/authStore.js', `import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  
  register: async (name, email, password, phone) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      localStorage.setItem('token', data.token);
      set({ user: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  checkAuth: async () => {
    if (!localStorage.getItem('token')) {
      set({ loading: false });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, loading: false });
    }
  }
}));

export default useAuthStore;
`);

write('src/store/cartStore.js', `import { create } from 'zustand';
import api from '../services/api';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  addToCart: async (productId, size, color, quantity, price) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/cart', { productId, size, color, quantity, price });
      set({ cart: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
      throw err;
    }
  },

  removeFromCart: async (itemId) => {
    set({ loading: true });
    try {
      const { data } = await api.delete(\`/cart/\${itemId}\`);
      set({ cart: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: null });
    } catch (err) {}
  }
}));

export default useCartStore;
`);

write('src/store/productStore.js', `import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set) => ({
  products: [],
  categories: [],
  collections: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products');
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await api.get('/categories');
      set({ categories: data });
    } catch (err) {}
  },

  fetchCollections: async () => {
    try {
      const { data } = await api.get('/collections');
      set({ collections: data });
    } catch (err) {}
  }
}));

export default useProductStore;
`);

write('src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}
`);

console.log('Frontend Part 1 generated');
