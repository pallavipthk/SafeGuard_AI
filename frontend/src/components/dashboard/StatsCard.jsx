import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatsCard({ icon: Icon, title, value, trend, trendLabel, color = 'blue' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!value) return;
    const numValue = parseInt(value) || 0;
    let start = 0;
    const duration = 1000;
    const steps = 30;
    const increment = numValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setDisplayValue(numValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  };

  const iconBgMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const isPositive = trend && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card p-5 border overflow-hidden relative group',
        colorMap[color] || colorMap.blue
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', iconBgMap[color])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && trend !== null && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
            isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 font-mono">{displayValue}{typeof value === 'string' && value.includes('%') ? '%' : ''}</p>
        {trendLabel && <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>}
      </div>
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
        'bg-gradient-to-t from-transparent via-white/5 to-transparent'
      )} />
    </motion.div>
  );
}
