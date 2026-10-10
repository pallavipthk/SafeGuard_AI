import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Car, BrainCircuit, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const floatingIcons = [
  { Icon: Shield, delay: 0, x: '10%', y: '20%', size: 48, color: 'text-blue-400' },
  { Icon: Car, delay: 1.5, x: '75%', y: '15%', size: 40, color: 'text-emerald-400' },
  { Icon: BrainCircuit, delay: 3, x: '85%', y: '60%', size: 44, color: 'text-cyan-400' },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 10 + 10,
  opacity: Math.random() * 0.3 + 0.1,
}));

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Reports Filed' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '24/7', label: 'Support' },
];

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-theme">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: p.opacity,
          }}
        />
      ))}

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {floatingIcons.map(({ Icon, delay, x, y, size, color }) => (
        <motion.div
          key={color}
          className={cn('absolute hidden lg:block', color)}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6"
            >
              <Shield size={14} />
              <span>AI-Powered Road Safety Platform</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">SafeGuard AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              Intelligent Road Safety & Accident Prevention Platform
            </p>

            <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl">
              Leveraging artificial intelligence to predict, prevent, and respond to road hazards in real-time. Making every journey safer.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Get Started Free
                <ChevronRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                <Play size={20} />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-[400px] h-[400px] rounded-full gradient-bg opacity-20 blur-[80px] absolute animate-pulse-glow" />
              <div className="relative glass-card p-8 w-[380px]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Shield className="text-blue-400 shrink-0" size={24} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">AI Protection Active</p>
                      <p className="text-xs text-[var(--text-muted)]">Real-time monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <Car className="text-green-400 shrink-0" size={24} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Vehicle Tracking</p>
                      <p className="text-xs text-[var(--text-muted)]">12 vehicles nearby</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <BrainCircuit className="text-cyan-400 shrink-0" size={24} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">AI Processing</p>
                      <p className="text-xs text-[var(--text-muted)]">Analyzing road conditions</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--text-muted)]">System Status</span>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      All Systems Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
               <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
