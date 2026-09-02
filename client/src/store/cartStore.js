import { create } from 'zustand';
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
      const { data } = await api.delete(`/cart/${itemId}`);
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
