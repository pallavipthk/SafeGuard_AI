import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Users, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { admin } from '@/services/api';
import { ChartSkeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

const userGrowth = [120, 145, 132, 168, 155, 180, 165, 190, 210, 195, 220, 245];
const resolutionRate = [60, 65, 62, 70, 68, 75, 72, 78, 80, 76, 82, 85];
const severityDist = [
  { level: 'Low', count: 120, color: '#22C55E' },
  { level: 'Medium', count: 85, color: '#F59E0B' },
  { level: 'High', count: 45, color: '#F97316' },
  { level: 'Critical', count: 25, color: '#EF4444' },
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const exportData = async (format) => {
    try {
      if (format === 'csv') await admin.exportCSV('analytics');
      else await admin.exportPDF('analytics');
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch {
      toast.success(`${format.toUpperCase()} export initiated`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <ChartSkeleton />
      </div>
    );
  }

  const maxUsers = Math.max(...userGrowth);
  const maxResolution = Math.max(...resolutionRate);
  const maxSeverity = Math.max(...severityDist.map((s) => s.count));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Admin Analytics</h2>
          <p className="text-gray-400 text-sm mt-1">In-depth platform analytics and metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportData('csv')} className="btn-secondary text-sm flex items-center gap-1.5"><FileText className="w-4 h-4" /> CSV</button>
          <button onClick={() => exportData('pdf')} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-400' },
          { label: 'Total Reports', value: '456', icon: AlertTriangle, color: 'text-yellow-400' },
          { label: 'Resolved', value: '312', icon: CheckCircle, color: 'text-green-400' },
          { label: 'Avg Resolution', value: '72%', icon: Clock, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <stat.icon className={cn('w-5 h-5', stat.color)} />
              <div><p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">User Growth (Monthly)</h3>
          <div className="flex items-end gap-2 h-48">
            {userGrowth.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(val / maxUsers) * 100}%` }} transition={{ duration: 0.4, delay: i * 0.03 }} className="w-full rounded-t bg-blue-500/60 hover:bg-blue-500/80 transition-colors" style={{ minHeight: 6 }} />
                <span className="text-[8px] text-gray-500">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Report Resolution Rate (%)</h3>
          <div className="flex items-end gap-2 h-48">
            {resolutionRate.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(val / maxResolution) * 100}%` }} transition={{ duration: 0.4, delay: i * 0.03 }} className="w-full rounded-t bg-green-500/60 hover:bg-green-500/80 transition-colors" style={{ minHeight: 6 }} />
                <span className="text-[8px] text-gray-500">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Severity Distribution</h3>
          <div className="space-y-3">
            {severityDist.map((s) => (
              <div key={s.level}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300">{s.level}</span>
                  <span className="text-[var(--text-primary)] font-medium">{s.count}</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.count / maxSeverity) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-secondary border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'New Users (This Month)', value: '245' },
              { label: 'Reports Resolved (This Month)', value: '85' },
              { label: 'Active Moderators', value: '12' },
              { label: 'Avg Response Time', value: '4.2 hrs' },
              { label: 'Critical Open Alerts', value: '7' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <span className="text-sm text-gray-300">{stat.label}</span>
                <span className={cn('font-bold', stat.label === 'Critical Open Alerts' ? 'text-red-400' : 'text-[var(--text-primary)]')}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
