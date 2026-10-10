import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, AlertTriangle, Shield, Brain, Activity, ArrowRight, Zap, MapPin, BookOpen } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { cn } from '@/lib/utils';
import { dashboard } from '@/services/api';
import { CardSkeleton, ListSkeleton } from '@/components/ui/skeleton';
import useAuthStore from '@/store/authStore';

const tips = [
  'Always wear your seatbelt, even on short trips.',
  'Keep a safe distance of at least 2 seconds from the vehicle ahead.',
  'Check your blind spots before changing lanes.',
  'Never use your phone while driving — pull over if you need to call.',
  'Obey speed limits — they are set for your safety.',
  'Use turn signals at least 100 feet before turning.',
  'Be extra cautious in rainy or foggy weather.',
];

const quickActions = [
  { to: '/dashboard/chat', icon: MessageSquare, label: 'AI Chat', color: 'from-blue-500 to-blue-600' },
  { to: '/dashboard/hazards', icon: AlertTriangle, label: 'Report Hazard', color: 'from-red-500 to-red-600' },
  { to: '/dashboard/vision', icon: Brain, label: 'Scan Sign', color: 'from-cyan-500 to-cyan-600' },
  { to: '/dashboard/quiz', icon: Zap, label: 'Take Quiz', color: 'from-yellow-500 to-yellow-600' },
];

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          dashboard.getStats(),
          dashboard.getTrends(),
        ]);
        setStats(statsRes.data ? {
          activeReports: statsRes.data.total_reports,
          openHazards: statsRes.data.pending_reports,
          safetyScore: 78,
          aiInteractions: 156,
        } : null);
        const trendData = trendsRes.data?.trend || [];
        setTrends(Array.isArray(trendData) && trendData.length > 0 && typeof trendData[0] === 'object'
          ? trendData.map(t => t.count || 0)
          : trendData);
        setActivity(trendsRes.data?.activity || []);
      } catch {
        setStats({ activeReports: 24, openHazards: 12, safetyScore: 78, aiInteractions: 156 });
        setActivity([
          { action: 'Reported pothole on MG Road', time: '2 hours ago', type: 'hazard' },
          { action: 'Completed Safety Quiz #5', time: '4 hours ago', type: 'quiz' },
          { action: 'AI Chat about road signs', time: '6 hours ago', type: 'chat' },
          { action: 'Risk prediction for evening drive', time: '1 day ago', type: 'risk' },
          { action: 'Updated emergency contacts', time: '2 days ago', type: 'sos' },
        ]);
        setTrends([30, 45, 38, 52, 48, 65, 55]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxTrend = Math.max(...trends, 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
        <ListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}</span>
        </h2>
        <p className="text-gray-400 mt-1">Here's your safety overview for today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={AlertTriangle} title="Active Reports" value={stats?.activeReports || 0} trend={12} color="red" />
        <StatsCard icon={MapPin} title="Open Hazards" value={stats?.openHazards || 0} trend={-5} color="yellow" />
        <StatsCard icon={Shield} title="Safety Score" value={stats?.safetyScore || 0} trend={8} trendLabel="points this month" color="green" />
        <StatsCard icon={MessageSquare} title="AI Interactions" value={stats?.aiInteractions || 0} trend={23} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link key={action.to} to={action.to} className="group">
                  <div className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center cursor-pointer">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', action.color)}>
                      <action.icon className="w-5 h-5 text-[var(--text-primary)]" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-[var(--text-primary)] transition-colors">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Weekly Activity</h3>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>
            <div className="flex items-end gap-2 h-40">
              {trends.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-gray-500">{val}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxTrend) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="w-full max-w-[40px] rounded-t-lg gradient-bg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ minHeight: 8 }}
                  />
                  <span className="text-[10px] text-gray-500">{weekDays[i % 7]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {activity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0"
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    item.type === 'hazard' && 'bg-red-500/20 text-red-400',
                    item.type === 'quiz' && 'bg-yellow-500/20 text-yellow-400',
                    item.type === 'chat' && 'bg-blue-500/20 text-blue-400',
                    item.type === 'risk' && 'bg-cyan-500/20 text-cyan-400',
                    item.type === 'sos' && 'bg-purple-500/20 text-purple-400',
                  )}>
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">{item.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Safety Tip</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
