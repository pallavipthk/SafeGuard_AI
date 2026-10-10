import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, CheckCircle, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { admin } from '@/services/api';
import { CardSkeleton } from '@/components/ui/skeleton';

const recentRegistrations = [
  { name: 'Ravi Kumar', email: 'ravi@example.com', date: '2 hours ago' },
  { name: 'Priya Singh', email: 'priya@example.com', date: '5 hours ago' },
  { name: 'Amit Sharma', email: 'amit@example.com', date: '1 day ago' },
  { name: 'Sunita Patel', email: 'sunita@example.com', date: '2 days ago' },
  { name: 'Vijay Gupta', email: 'vijay@example.com', date: '2 days ago' },
];

const recentReports = [
  { id: 1, type: 'Pothole', user: 'Ravi K.', status: 'pending', date: '2h ago' },
  { id: 2, type: 'Broken Signal', user: 'Priya S.', status: 'verified', date: '5h ago' },
  { id: 3, type: 'Accident', user: 'Amit S.', status: 'pending', date: '1d ago' },
  { id: 4, type: 'Waterlogging', user: 'Sunita P.', status: 'resolved', date: '2d ago' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await admin.getAnalytics();
        setStats({
          totalUsers: res.data?.overview?.total_users,
          totalReports: res.data?.overview?.total_reports,
          verifiedReports: res.data?.reports_by_status?.verified || 0,
          pendingReports: res.data?.reports_by_status?.pending || 0,
        });
      } catch {
        setStats({ totalUsers: 1248, totalReports: 456, verifiedReports: 312, pendingReports: 89 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Overview of platform activity and metrics.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          { label: 'Total Reports', value: stats?.totalReports || 0, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
          { label: 'Verified Reports', value: stats?.verifiedReports || 0, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
          { label: 'Pending Reports', value: stats?.pendingReports || 0, icon: Clock, color: 'text-red-400', bg: 'bg-red-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Registrations</h3>
            <Link to="/admin/users" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {recentRegistrations.map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)] font-medium">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className="text-[10px] text-gray-600">{u.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Reports</h3>
            <Link to="/admin/reports" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {recentReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{r.type}</p>
                  <p className="text-xs text-gray-500">by {r.user} &middot; {r.date}</p>
                </div>
                <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', r.status === 'pending' && 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400', r.status === 'verified' && 'border-blue-500/30 bg-blue-500/20 text-blue-400', r.status === 'resolved' && 'border-green-500/30 bg-green-500/20 text-green-400')}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/reports" className="btn-primary text-sm">Verify Pending Reports</Link>
        <Link to="/admin/analytics" className="btn-secondary text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Export Data</Link>
      </div>
    </div>
  );
}
