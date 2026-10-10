import { motion } from 'framer-motion';
import { Clock, Route, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const insights = [
  {
    title: 'Peak Accident Times',
    icon: Clock,
    color: 'from-red-500 to-orange-500',
    description: 'Analysis of accident frequency across different times of day reveals critical patterns.',
    data: [
      { label: '6AM - 9AM', value: 85, peak: true },
      { label: '9AM - 12PM', value: 45, peak: false },
      { label: '12PM - 3PM', value: 55, peak: false },
      { label: '3PM - 6PM', value: 75, peak: true },
      { label: '6PM - 9PM', value: 95, peak: true },
      { label: '9PM - 12AM', value: 60, peak: false },
    ],
    stat: 'Peak: 6PM - 9PM (95% risk)',
    statColor: 'text-red-400',
  },
  {
    title: 'Most Dangerous Roads',
    icon: Route,
    color: 'from-amber-500 to-yellow-500',
    description: 'High-risk road segments identified through AI analysis of historical incident data.',
    data: [
      { label: 'Highway 101', value: 92, peak: true },
      { label: 'Downtown Blvd', value: 78, peak: true },
      { label: 'River Road', value: 65, peak: false },
      { label: 'Pine Street', value: 52, peak: false },
      { label: 'Oak Avenue', value: 45, peak: false },
      { label: 'Lake Drive', value: 30, peak: false },
    ],
    stat: 'Highest: Highway 101 (92)',
    statColor: 'text-amber-400',
  },
  {
    title: 'Common Hazards',
    icon: AlertTriangle,
    color: 'from-purple-500 to-pink-500',
    description: 'Distribution of reported hazards by type, helping prioritize safety improvements.',
    data: [
      { label: 'Potholes', value: 88, peak: true },
      { label: 'Poor Lighting', value: 72, peak: true },
      { label: 'Faded Signs', value: 65, peak: false },
      { label: 'Debris', value: 50, peak: false },
      { label: 'Water Logging', value: 42, peak: false },
      { label: 'Construction', value: 35, peak: false },
    ],
    stat: 'Most Common: Potholes (88%)',
    statColor: 'text-purple-400',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' },
  }),
};

export default function Insights() {
  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
            <TrendingUp size={14} />
            <span>Data Insights</span>
          </div>
          <h2 className="section-title">Road Safety Insights</h2>
          <p className="section-subtitle">
            Data-driven insights powered by AI analysis of thousands of incidents
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const InsightIcon = insight.icon;
            const maxVal = Math.max(...insight.data.map((d) => d.value));

            return (
              <motion.div
                key={insight.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br', insight.color,
                  )}>
                    <InsightIcon size={24} className="text-[var(--text-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{insight.title}</h3>
                </div>

                <p className="text-sm text-gray-400 mb-6">{insight.description}</p>

                <div className="space-y-2.5 mb-4">
                  {insight.data.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 shrink-0">{item.label}</span>
                      <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.value / maxVal) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.2, ease: 'easeOut' }}
                          className={cn(
                            'h-full rounded-full',
                            item.peak
                              ? 'bg-gradient-to-r' + ' ' + insight.color
                              : 'bg-white/20'
                          )}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className={cn('text-sm font-medium', insight.statColor)}>
                    {insight.stat}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
