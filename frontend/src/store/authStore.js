import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({
      user: userData,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  register: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({
      user: userData,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateProfile: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
