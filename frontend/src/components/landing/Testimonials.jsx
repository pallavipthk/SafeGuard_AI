import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fleet Manager, MetroTrans',
    avatar: 'SJ',
    rating: 5,
    text: 'SafeGuard AI has revolutionized how we manage our fleet safety. The real-time hazard detection and driver scoring features have reduced our incident rate by 60%. The AI predictions are incredibly accurate.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Marcus Chen',
    role: 'City Traffic Engineer',
    avatar: 'MC',
    rating: 5,
    text: 'As a traffic engineer, the analytics and risk prediction capabilities are game-changing. We\'ve identified and mitigated 47 high-risk zones in our city within the first quarter of deployment.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Daily Commuter',
    avatar: 'PS',
    rating: 5,
    text: 'The SOS feature alone gives me peace of mind during my night commutes. The road sign recognition has helped me navigate unfamiliar areas safely. Truly a lifesaver app!',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'James Rodriguez',
    role: 'Safety Officer, City Council',
    avatar: 'JR',
    rating: 4,
    text: 'The admin panel gives us unprecedented visibility into road safety metrics. We\'ve improved our emergency response time by 40% since implementing SafeGuard AI across the municipality.',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">
            Trusted by thousands of drivers, authorities, and organizations worldwide
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card p-8 md:p-12">
            <Quote className="absolute top-6 left-6 text-blue-500/20" size={60} />

            <div className="flex justify-center mb-8">
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white',
                'bg-gradient-to-br', t.color,
              )}>
                {t.avatar}
              </div>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-center"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div>
                  <p className="font-semibold text-white text-lg">{t.name}</p>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="glass-card p-3 hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    i === current ? 'bg-blue-500 w-8' : 'bg-white/20 hover:bg-white/40'
                  )}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="glass-card p-3 hover:bg-white/10 transition-all"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
