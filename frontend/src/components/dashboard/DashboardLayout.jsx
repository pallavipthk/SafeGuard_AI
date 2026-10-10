import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, UserCircle, Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import useThemeStore from '@/store/themeStore';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';

const pageTitles = {
  '/dashboard': 'Dashboard Home',
  '/dashboard/chat': 'AI Chatbot',
  '/dashboard/vision': 'Sign Recognition',
  '/dashboard/hazards': 'Hazard Reports',
  '/dashboard/risk': 'Risk Prediction',
  '/dashboard/map': 'City Map',
  '/dashboard/sos': 'Emergency SOS',
  '/dashboard/learning': 'Learning Hub',
  '/dashboard/quiz': 'Quiz',
  '/dashboard/safety-score': 'Safety Score',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile': 'Profile',
};

export default function DashboardLayout() {
  const location = useLocation();
  const { mode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-theme">
      <Sidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 glass-card rounded-none border-b border-theme px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <h1 className="text-xl font-bold gradient-text hidden md:block">{title}</h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="input-field text-sm pl-10 pr-4 py-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-[var(--bg-card-hover)] text-muted hover:text-[var(--text-primary)] transition-all"
              >
                {mode === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <NotificationDropdown />
              <div className="flex items-center gap-2.5 pl-2 border-l border-theme">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>{user?.name || 'User'}</p>
                  <p className="text-[10px] text-muted">{user?.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold gradient-text md:hidden mt-3">{title}</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
