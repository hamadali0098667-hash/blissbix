import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set) => ({
  products: [],
  categories: [],
  collections: [],
  loading: false,
  error: null,

  fetchProducts: async (queryString = '') => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/products${queryString}`);
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
