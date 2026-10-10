import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, ScanEye, AlertTriangle, Gauge,
  Map, Siren, BookOpen, Brain, Shield, BarChart3, UserCircle,
  LogOut, Menu, X, ShieldAlert,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard Home', end: true },
  { to: '/dashboard/chat', icon: MessageSquare, label: 'AI Chatbot' },
  { to: '/dashboard/vision', icon: ScanEye, label: 'Sign Recognition' },
  { to: '/dashboard/hazards', icon: AlertTriangle, label: 'Hazard Reports' },
  { to: '/dashboard/risk', icon: Gauge, label: 'Risk Prediction' },
  { to: '/dashboard/map', icon: Map, label: 'City Map' },
  { to: '/dashboard/sos', icon: Siren, label: 'Emergency SOS' },
  { to: '/dashboard/learning', icon: BookOpen, label: 'Learning Hub' },
  { to: '/dashboard/quiz', icon: Brain, label: 'Quiz' },
  { to: '/dashboard/safety-score', icon: Shield, label: 'Safety Score' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
      isActive
        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
        : 'text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-transparent'
    );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 glass-card lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-white" />
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

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 flex flex-col glass-card border-r border-theme rounded-none transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-theme">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">SafeGuard</h1>
              <p className="text-[10px] text-muted -mt-0.5">AI Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-muted lg:hidden"
          >
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
              className={linkClass}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-theme space-y-3">
          <NavLink
            to="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => linkClass({ isActive })}
          >
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{color: 'var(--text-primary)'}}>{user?.name || 'User'}</p>
              <p className="text-xs text-muted truncate">{user?.email || ''}</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
