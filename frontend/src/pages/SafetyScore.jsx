import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Gauge, TrendingUp, Target, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/services/api';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton';

const categories = [
  { key: 'quiz', label: 'Quiz Performance', icon: Brain, score: 85, color: 'from-blue-500 to-cyan-500' },
  { key: 'risk', label: 'Risk Assessments', icon: Gauge, score: 72, color: 'from-yellow-500 to-orange-500' },
  { key: 'habits', label: 'Driving Habits', icon: TrendingUp, score: 68, color: 'from-green-500 to-emerald-500' },
];

const scoreHistory = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Apr', score: 70 },
  { month: 'May', score: 76 },
  { month: 'Jun', score: 78 },
];

const tips = [
  'Complete daily quizzes to boost your knowledge score',
  'Use Risk Prediction before long drives',
  'Report hazards you encounter on the road',
  'Review first aid guides regularly',
  'Practice defensive driving techniques',
];

export default function SafetyScore() {
  const [score, setScore] = useState(78);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await dashboard.getSafetyScore();
        setScore(res.data?.current_score || 78);
      } catch {}
      setLoading(false);
    };
    fetchScore();
  }, []);

  useEffect(() => {
    if (!loading) {
      let current = 0;
      const steps = 30;
      const increment = score / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [loading, score]);

  const getRating = (s) => {
    if (s >= 90) return { label: 'Road Guardian', color: 'text-green-400', badge: 'Elite' };
    if (s >= 75) return { label: 'Safe Driver', color: 'text-blue-400', badge: 'Advanced' };
    if (s >= 60) return { label: 'Learning Driver', color: 'text-yellow-400', badge: 'Intermediate' };
    return { label: 'Beginner', color: 'text-gray-400', badge: 'Basic' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const rating = getRating(score);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Safety Score</h2>
        <p className="text-gray-400 text-sm mt-1">Your comprehensive road safety rating.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 flex flex-col items-center"
          >
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={score >= 75 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(displayScore / 100) * 339.292} 339.292`}
                  initial={{ strokeDasharray: '0 339.292' }}
                  animate={{ strokeDasharray: `${(displayScore / 100) * 339.292} 339.292` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-[var(--text-primary)]">{displayScore}</p>
                <p className="text-sm text-gray-500">/ 100</p>
              </div>
            </div>
            <span className={cn('text-2xl font-bold mb-1', rating.color)}>{rating.label}</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">{rating.badge} Rating</span>
          </motion.div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', cat.color)}>
                      <cat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{cat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)]">{cat.score}/100</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={cn('h-full rounded-full', cat.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Monthly Progress</h3>
            <div className="flex items-end gap-2 h-40">
              {scoreHistory.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs text-gray-500">{item.score}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.score / 100) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-full max-w-[30px] rounded-t-lg gradient-bg opacity-80"
                    style={{ minHeight: 8 }}
                  />
                  <span className="text-[10px] text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Improvement Tips</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                  <ChevronRight className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Score History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="text-left py-2 font-medium">Month</th>
                    <th className="text-right py-2 font-medium">Score</th>
                    <th className="text-right py-2 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreHistory.map((item, i) => {
                    const change = i > 0 ? item.score - scoreHistory[i - 1].score : 0;
                    return (
                      <tr key={item.month} className="border-b border-white/5 last:border-0">
                        <td className="py-2 text-[var(--text-secondary)]">{item.month}</td>
                        <td className="py-2 text-right text-[var(--text-primary)] font-medium">{item.score}</td>
                        <td className={cn('py-2 text-right', change >= 0 ? 'text-green-400' : 'text-red-400')}>
                          {change > 0 ? `+${change}` : change === 0 ? '-' : change}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
