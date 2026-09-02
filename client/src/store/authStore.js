import { create } from 'zustand';
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
  
  register: async (name, email, password, phone, role) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone, role });
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
