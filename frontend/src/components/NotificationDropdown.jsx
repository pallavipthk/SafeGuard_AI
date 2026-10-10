import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Siren,
  Sparkles,
  X
} from 'lucide-react';
import { notifications as notificationsApi } from '@/services/api';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 101,
    title: 'Hazard Report Verified',
    message: 'Your report for "Pothole on MG Road" has been verified by smart city authorities.',
    type: 'success',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 102,
    title: 'Adverse Weather Warning',
    message: 'Rain alert in your zone. AI recommends reducing speed by 15 km/h.',
    type: 'warning',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 103,
    title: 'New Safety Badge Earned!',
    message: 'Congratulations! You earned the "Road Guardian" achievement badge.',
    type: 'badge',
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 104,
    title: 'Monthly Analytics Ready',
    message: 'Your monthly driving risk profile and safety score analysis is now available.',
    type: 'info',
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function formatTimeAgo(isoString) {
  if (!isoString) return 'recently';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getNotificationIcon(type) {
  switch (type) {
    case 'warning':
    case 'hazard':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'badge':
      return <Sparkles className="w-4 h-4 text-purple-400" />;
    case 'emergency':
    case 'siren':
      return <Siren className="w-4 h-4 text-red-400" />;
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [items, setItems] = useState(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getNotifications();
      if (res.data && Array.isArray(res.data.notifications) && res.data.notifications.length > 0) {
        setItems(res.data.notifications);
      }
    } catch {
      // Keep default fallback items if backend is unreachable or user is unauthenticated
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationsApi.markAsRead(id);
    } catch {}
  };

  const handleMarkAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllAsRead();
    } catch {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationsApi.deleteNotification(id);
    } catch {}
  };

  const displayedItems =
    filter === 'unread' ? items.filter((n) => !n.read) : items;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Open notifications"
        className={`relative p-2 rounded-xl text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all ${
          isOpen ? 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] ring-1 ring-blue-500/30' : ''
        }`}
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
            style={{
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.15)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-xs text-muted hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex px-4 pt-2 border-b border-white/5 gap-4 text-xs font-medium bg-white/[0.01]">
              <button
                onClick={() => setFilter('all')}
                className={`pb-2 border-b-2 transition-all ${
                  filter === 'all'
                    ? 'border-blue-500 text-blue-400 font-semibold'
                    : 'border-transparent text-muted hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`pb-2 border-b-2 transition-all ${
                  filter === 'unread'
                    ? 'border-blue-500 text-blue-400 font-semibold'
                    : 'border-transparent text-muted hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              {displayedItems.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-muted">
                    <BellOff className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-white/90">No notifications</p>
                  <p className="text-xs text-muted mt-1">
                    {filter === 'unread'
                      ? "You've read all your notifications!"
                      : "You're all caught up with everything."}
                  </p>
                </div>
              ) : (
                displayedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMarkAsRead(item.id)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                      !item.read ? 'bg-blue-500/[0.06]' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      {getNotificationIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            !item.read ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-muted shrink-0">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-center">
                      {!item.read && (
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                          title="Unread"
                        />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-muted hover:text-red-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-2.5 border-t border-white/10 bg-white/[0.02] text-center">
                <p className="text-[11px] text-muted">
                  SafeGuard AI Real-time Safety Alerts
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
