import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Download, FileText, PieChart,
  Activity, AlertTriangle, MapPin, Clock, ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard, admin } from '@/services/api';
import { ChartSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];

const reportsOverTime = [45, 52, 38, 65, 48, 72, 58, 62, 55, 70, 68, 80, 75, 60, 55, 72, 78, 65, 82, 74, 68, 58, 62, 55, 70, 65, 58];
const hazardDistribution = [
  { type: 'Pothole', count: 45, color: 'bg-orange-500' },
  { type: 'Broken Signal', count: 32, color: 'bg-red-500' },
  { type: 'Road Damage', count: 28, color: 'bg-yellow-500' },
  { type: 'Waterlogging', count: 20, color: 'bg-blue-500' },
  { type: 'Accident', count: 15, color: 'bg-red-600' },
  { type: 'Missing Sign', count: 12, color: 'bg-cyan-500' },
];
const riskCategories = [
  { label: 'Low Risk', value: 35, color: '#22C55E' },
  { label: 'Moderate', value: 30, color: '#F59E0B' },
  { label: 'High Risk', value: 20, color: '#F97316' },
  { label: 'Critical', value: 15, color: '#EF4444' },
];
const dangerousRoads = [
  { road: 'MG Road', incidents: 34, risk: 'High' },
  { road: 'Ring Road', incidents: 28, risk: 'High' },
  { road: 'Grand Trunk Road', incidents: 22, risk: 'Medium' },
  { road: 'Srinagar Highway', incidents: 19, risk: 'Medium' },
  { road: 'Eastern Express', incidents: 15, risk: 'Low' },
];
const peakTimes = [
  { time: '6-8 AM', count: 45 },
  { time: '8-10 AM', count: 72 },
  { time: '10-12 PM', count: 38 },
  { time: '12-2 PM', count: 42 },
  { time: '2-4 PM', count: 35 },
  { time: '4-6 PM', count: 68 },
  { time: '6-8 PM', count: 85 },
  { time: '8-10 PM', count: 52 },
  { time: '10-12 AM', count: 28 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const totalReports = reportsOverTime.reduce((a, b) => a + b, 0);
  const avgDaily = Math.round(totalReports / reportsOverTime.length);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <ChartSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const maxReport = Math.max(...reportsOverTime);
  const maxPeak = Math.max(...peakTimes.map((p) => p.count));
  const maxHazard = Math.max(...hazardDistribution.map((h) => h.count));
  const totalRisk = riskCategories.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Comprehensive safety data analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-field text-sm w-auto">
            {dateRanges.map((dr) => (
              <option key={dr} value={dr} className="bg-gray-900">{dr}</option>
            ))}
          </select>
          <button onClick={() => exportData('csv')} className="btn-secondary text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => exportData('pdf')} className="btn-secondary text-sm flex items-center gap-1.5">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: totalReports, icon: BarChart3, color: 'text-blue-400' },
          { label: 'Active Hazards', value: 43, icon: Activity, color: 'text-yellow-400' },
          { label: 'Avg Daily Rate', value: avgDaily, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Critical Alerts', value: 7, icon: AlertTriangle, color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <stat.icon className={cn('w-5 h-5', stat.color)} />
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Reports Over Time</h3>
          <div className="flex items-end gap-1.5 h-48">
            {reportsOverTime.slice(0, 28).map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxReport) * 100}%` }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  className="w-full rounded-t gradient-bg opacity-70 hover:opacity-100 transition-opacity"
                  style={{ minHeight: 4 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Hazard Types Distribution</h3>
          <div className="space-y-3">
            {hazardDistribution.map((h) => (
              <div key={h.type}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-300">{h.type}</span>
                  <span className="text-[var(--text-primary)] font-medium">{h.count}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(h.count / maxHazard) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className={cn('h-full rounded-full', h.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Risk Categories</h3>
          <div className="flex items-center justify-center gap-1">
            {riskCategories.map((rc) => (
              <div key={rc.label} className="flex flex-col items-center">
                <div
                  className="rounded-t-lg"
                  style={{
                    width: 80,
                    height: `${(rc.value / totalRisk) * 200}px`,
                    backgroundColor: rc.color,
                    minHeight: 20,
                  }}
                />
                <span className="text-xs text-gray-400 mt-1">{rc.label}</span>
                <span className="text-xs text-[var(--text-primary)] font-medium">{rc.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Most Dangerous Areas</h3>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5', 'D1', 'D2', 'D3', 'D4', 'D5', 'E1', 'E2', 'E3', 'E4', 'E5'].map((cell) => {
              const random = Math.random();
              return (
                <div
                  key={cell}
                  className={cn(
                    'aspect-square rounded flex items-center justify-center text-[8px] font-medium',
                    random > 0.8 ? 'bg-red-500/30 text-red-300' : random > 0.6 ? 'bg-orange-500/20 text-orange-300' : random > 0.4 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                  )}
                >
                  {cell}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500/50" /> Low</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500/50" /> Med</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500/50" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/50" /> Critical</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Most Dangerous Roads</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th className="text-left py-2 font-medium">Road</th>
                <th className="text-right py-2 font-medium">Incidents</th>
                <th className="text-right py-2 font-medium">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {dangerousRoads.map((r) => (
                <tr key={r.road} className="border-b border-white/5 last:border-0">
                  <td className="py-2 text-gray-300">{r.road}</td>
                  <td className="py-2 text-right text-[var(--text-primary)] font-medium">{r.incidents}</td>
                  <td className="py-2 text-right">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                      r.risk === 'High' && 'bg-red-500/20 text-red-400',
                      r.risk === 'Medium' && 'bg-yellow-500/20 text-yellow-400',
                      r.risk === 'Low' && 'bg-green-500/20 text-green-400',
                    )}>
                      {r.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Peak Accident Times</h3>
          <div className="flex items-end gap-1.5 h-40">
            {peakTimes.map((p, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(p.count / maxPeak) * 100}%` }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="w-full rounded-t bg-red-500/60 hover:bg-red-500/80 transition-colors"
                  style={{ minHeight: 6 }}
                />
                <span className="text-[8px] text-gray-500 whitespace-nowrap">{p.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
