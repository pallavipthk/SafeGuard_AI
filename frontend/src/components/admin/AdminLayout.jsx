import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, AlertTriangle, BarChart3, LogOut, Menu, X, Shield, Search, Sun, Moon } from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

const pageTitles = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/reports': 'Report Management',
  '/admin/analytics': 'Admin Analytics',
};

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="min-h-screen bg-theme">
      <button onClick={() => setIsOpen(true)} className="fixed top-4 left-4 z-50 p-2.5 glass-card rounded-xl lg:hidden">
        <Menu className="w-5 h-5" style={{color: 'var(--text-primary)'}} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-50 flex flex-col bg-theme-secondary border-r border-theme transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between p-5 border-b border-theme">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--text-primary)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>SafeGuard</h1>
              <p className="text-[10px] text-red-400 uppercase tracking-wider font-medium">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-muted lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-white border border-red-500/30 shadow-lg shadow-red-500/10'
                  : 'text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-transparent'
              )}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-theme space-y-3">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{color: 'var(--text-primary)'}}>{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-red-400 uppercase font-medium">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-theme-secondary border-b border-theme px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-4">
              <h1 className="text-xl font-bold hidden md:block" style={{color: 'var(--text-primary)'}}>{title}</h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="text" placeholder="Search admin..." className="input-field text-sm pl-10 pr-4 py-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-[var(--bg-card-hover)] text-muted hover:text-[var(--text-primary)] transition-all">
                {mode === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <NotificationDropdown />
              <div className="flex items-center gap-2.5 pl-2 border-l border-theme">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-medium uppercase tracking-wider">Admin</span>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold md:hidden mt-3" style={{color: 'var(--text-primary)'}}>{title}</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
