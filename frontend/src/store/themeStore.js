import { create } from 'zustand';

const useThemeStore = create((set) => ({
  mode: localStorage.getItem('theme') || 'dark',

  toggleTheme: () => {
    const newMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newMode);
    set({ mode: newMode });
  },

  initTheme: () => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ mode: saved });
  },
}));

export default useThemeStore;
