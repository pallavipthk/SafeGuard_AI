import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, Activity, Filter, Layers, Bell } from 'lucide-react';
import MapView from '@/components/dashboard/MapView';
import { cn } from '@/lib/utils';
import { CardSkeleton } from '@/components/ui/skeleton';

const hazardTypes = [
  { value: 'all', label: 'All Types', color: 'white' },
  { value: 'pothole', label: 'Pothole', color: '#F97316' },
  { value: 'broken_signal', label: 'Broken Signal', color: '#EF4444' },
  { value: 'road_damage', label: 'Road Damage', color: '#F59E0B' },
  { value: 'waterlogging', label: 'Waterlogging', color: '#22C55E' },
  { value: 'accident', label: 'Accident', color: '#EF4444' },
  { value: 'missing_sign', label: 'Missing Sign', color: '#3B82F6' },
];

const severityLevels = [
  { value: 'all', label: 'All Severities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const mockMarkers = [
  { id: 1, lat: 28.6139, lng: 77.209, type: 'Pothole', severity: 'high', description: 'Large pothole near bus stop on MG Road', report: 'Reported by Ravi', date: '2026-06-29' },
  { id: 2, lat: 28.7041, lng: 77.1025, type: 'Broken Signal', severity: 'critical', description: 'Traffic light not working at intersection', report: 'Reported by Priya', date: '2026-06-28' },
  { id: 3, lat: 28.4595, lng: 77.0266, type: 'Road Damage', severity: 'medium', description: 'Cracked road surface on highway', report: 'Reported by Amit', date: '2026-06-27' },
  { id: 4, lat: 28.5355, lng: 77.391, type: 'Waterlogging', severity: 'low', description: 'Water accumulation near market', report: 'Reported by Sunita', date: '2026-06-26' },
  { id: 5, lat: 28.58, lng: 77.18, type: 'Accident', severity: 'critical', description: 'Multi-vehicle collision reported', report: 'Emergency services dispatched', date: '2026-06-25' },
  { id: 6, lat: 28.65, lng: 77.23, type: 'Missing Sign', severity: 'medium', description: 'Stop sign missing at T-junction', report: 'Reported by Vijay', date: '2026-06-24' },
];

const recentAlerts = [
  { id: 1, message: 'Critical accident reported at Connaught Place', time: '5m ago', severity: 'critical' },
  { id: 2, message: 'Waterlogging reported in Karol Bagh area', time: '15m ago', severity: 'medium' },
  { id: 3, message: 'Traffic signal broken at Rajpath intersection', time: '1h ago', severity: 'high' },
  { id: 4, message: 'Pothole repaired on Ring Road', time: '2h ago', severity: 'low' },
];

export default function CityDashboard() {
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [stats] = useState({
    total: 156,
    active: 43,
    resolved: 98,
    critical: 7,
  });

  const filteredMarkers = mockMarkers.filter((m) => {
    if (filterType !== 'all' && m.type.toLowerCase().replace(' ', '_') !== filterType && m.type.toLowerCase() !== filterType) return false;
    if (filterSeverity !== 'all' && m.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">City Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time hazard monitoring and city-wide safety overview.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: stats.total, icon: MapPin, color: 'blue' },
          { label: 'Active Hazards', value: stats.active, icon: AlertTriangle, color: 'yellow' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'green' },
          { label: 'Critical Alerts', value: stats.critical, icon: Activity, color: 'red' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'glass-card p-4 border',
              stat.color === 'red' && 'border-red-500/20',
              stat.color === 'yellow' && 'border-yellow-500/20',
              stat.color === 'green' && 'border-green-500/20',
              stat.color === 'blue' && 'border-blue-500/20',
            )}
          >
            <div className="flex items-center gap-3">
              <stat.icon className={cn(
                'w-5 h-5',
                stat.color === 'red' && 'text-red-400',
                stat.color === 'yellow' && 'text-yellow-400',
                stat.color === 'green' && 'text-green-400',
                stat.color === 'blue' && 'text-blue-400',
              )} />
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 glass-card p-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-transparent text-sm text-[var(--text-primary)] border-none outline-none">
                {hazardTypes.map((ht) => (
                  <option key={ht.value} value={ht.value} className="bg-gray-900">{ht.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 glass-card p-2">
              <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="bg-transparent text-sm text-[var(--text-primary)] border-none outline-none">
                {severityLevels.map((sl) => (
                  <option key={sl.value} value={sl.value} className="bg-gray-900">{sl.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all',
                showHeatmap ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 text-gray-400 hover:bg-white/5'
              )}
            >
              <Layers className="w-4 h-4" />
              Heatmap
            </button>
          </div>

          <MapView markers={filteredMarkers} showHeatmap={showHeatmap} className="min-h-[500px]" />
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Map Legend</h3>
            <div className="space-y-2">
              {hazardTypes.filter((h) => h.value !== 'all').map((ht) => (
                <div key={ht.value} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ht.color }} />
                  {ht.label}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Alerts</h3>
            </div>
            <div className="space-y-2">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-2.5 rounded-lg bg-white/5 space-y-1">
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-1 shrink-0',
                      alert.severity === 'critical' && 'bg-red-500',
                      alert.severity === 'high' && 'bg-orange-500',
                      alert.severity === 'medium' && 'bg-yellow-500',
                      alert.severity === 'low' && 'bg-green-500',
                    )} />
                    <p className="text-xs text-gray-300">{alert.message}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 pl-4">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
