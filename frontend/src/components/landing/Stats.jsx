import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, AlertTriangle, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const statsData = [
  {
    icon: Users,
    label: 'Active Users',
    value: 12850,
    suffix: '+',
    color: 'from-blue-500 to-cyan-500',
    delay: 0,
  },
  {
    icon: AlertTriangle,
    label: 'Hazards Reported',
    value: 52340,
    suffix: '+',
    color: 'from-amber-500 to-orange-500',
    delay: 0.2,
  },
  {
    icon: ShieldCheck,
    label: 'Accidents Prevented',
    value: 3840,
    suffix: '+',
    color: 'from-emerald-500 to-teal-500',
    delay: 0.4,
  },
  {
    icon: Star,
    label: 'Safety Scores Given',
    value: 89120,
    suffix: '+',
    color: 'from-purple-500 to-pink-500',
    delay: 0.6,
  },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Impact in Numbers</h2>
          <p className="section-subtitle">
            Real results making roads safer for everyone
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
              >
                <div className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                  <div className={cn(
                    'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center',
                    'bg-gradient-to-br', stat.color,
                    'shadow-lg group-hover:shadow-xl transition-all duration-300'
                  )}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
