import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, BarChart3, MapPin, Bell,
  Shield, ChevronRight, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Monitor,
    content: {
      title: 'Real-Time Dashboard',
      description: 'Comprehensive overview of road safety metrics, live alerts, and system status at a glance.',
      metrics: [
        { label: 'Active Users', value: '12,850', change: '+12%', positive: true },
        { label: 'Hazards Today', value: '47', change: '-8%', positive: true },
        { label: 'Response Time', value: '2.4s', change: '-15%', positive: true },
        { label: 'Accuracy', value: '98.2%', change: '+1.2%', positive: true },
      ],
    },
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    content: {
      title: 'AI Analytics Engine',
      description: 'Deep insights into traffic patterns, risk zones, and safety trends powered by machine learning.',
      metrics: [
        { label: 'Data Points', value: '2.4M', change: '+18%', positive: true },
        { label: 'Predictions', value: '15,240', change: '94%', positive: true },
        { label: 'Risk Zones', value: '128', change: '-5%', positive: false },
        { label: 'Coverage', value: '96%', change: '+3%', positive: true },
      ],
    },
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: Bell,
    content: {
      title: 'Smart Alert System',
      description: 'Real-time hazard alerts and notifications with AI-prioritized responses.',
      metrics: [
        { label: 'Active Alerts', value: '12', change: 'Critical: 2', positive: false },
        { label: 'Resolved', value: '1,892', change: '+24%', positive: true },
        { label: 'Avg Response', value: '45s', change: '-12s', positive: true },
        { label: 'Escalations', value: '3', change: '-60%', positive: true },
      ],
    },
  },
  {
    id: 'map',
    label: 'Map View',
    icon: MapPin,
    content: {
      title: 'Interactive Safety Map',
      description: 'Live map visualization of hazards, traffic conditions, and safety zones across the city.',
      metrics: [
        { label: 'Monitored Area', value: '850 km²', change: '+50 km²', positive: true },
        { label: 'Active Cameras', value: '1,240', change: '+120', positive: true },
        { label: 'Hotspots', value: '34', change: '-8', positive: true },
        { label: 'Coverage', value: '92%', change: '+5%', positive: true },
      ],
    },
  },
];

export default function LiveDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-4">
            <Activity size={14} />
            <span>Live Preview</span>
          </div>
          <h2 className="section-title">See It In Action</h2>
          <p className="section-subtitle">
            Interactive preview of our platform&apos;s powerful features
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  )}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                      {activeContent?.title}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{activeContent?.title}</h3>
                    <p className="text-gray-400 mb-6">{activeContent?.description}</p>

                    <div className="space-y-3">
                      {activeContent?.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <span className="text-sm text-gray-400">{metric.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">{metric.value}</span>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              metric.positive
                                ? 'text-green-400 bg-green-500/10'
                                : 'text-red-400 bg-red-500/10'
                            )}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-2xl" />
                    <div className="relative glass-card p-6 space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <Shield className="text-cyan-400" size={32} />
                        <div>
                          <p className="font-semibold text-white">SafeGuard AI</p>
                          <p className="text-xs text-gray-400">System Active</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { icon: Bell, text: 'Hazard detected on Main St', time: '2m ago', color: 'text-amber-400' },
                          { icon: MapPin, text: 'Traffic update: Zone B clear', time: '5m ago', color: 'text-green-400' },
                          { icon: Activity, text: 'Risk prediction: Low for next 2h', time: '10m ago', color: 'text-blue-400' },
                        ].map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div key={item.text} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                              <ItemIcon size={16} className={item.color} />
                              <span className="text-sm text-gray-300 flex-1">{item.text}</span>
                              <span className="text-xs text-gray-500">{item.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>System Performance</span>
                          <span className="text-green-400">98.2%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '98.2%' }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Try It Now
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
