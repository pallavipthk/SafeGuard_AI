import { motion } from 'framer-motion';
import {
  Bot, Scan, AlertTriangle, TrendingUp, LayoutDashboard,
  PhoneCall, BookOpen, Award, BarChart3, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Bot,
    title: 'AI Road Safety Assistant',
    description: '24/7 intelligent voice assistant providing real-time road safety guidance, hazard alerts, and navigation support.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Scan,
    title: 'Road Sign Recognition',
    description: 'Advanced computer vision that instantly recognizes and interprets road signs, traffic signals, and markings.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: AlertTriangle,
    title: 'Smart Hazard Reporting',
    description: 'One-tap reporting of road hazards with AI-powered image analysis and automatic severity assessment.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Accident Risk Prediction',
    description: 'Predictive analytics identifying high-risk zones and times, helping prevent accidents before they happen.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart City Dashboard',
    description: 'Comprehensive city-wide traffic monitoring and management dashboard with real-time data visualization.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: PhoneCall,
    title: 'Emergency SOS',
    description: 'Instant emergency response system with automatic location sharing and direct alert to authorities.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: BookOpen,
    title: 'Safety Learning Hub',
    description: 'Interactive educational platform with courses, quizzes, and certifications on road safety.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Award,
    title: 'Driver Safety Score',
    description: 'AI-driven scoring system that evaluates and improves driving behavior with personalized feedback.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'AI Analytics Engine',
    description: 'Deep analytics and reporting engine providing actionable insights on traffic patterns and safety metrics.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Authority Admin Panel',
    description: 'Dedicated admin interface for traffic authorities to manage, monitor, and respond to incidents.',
    color: 'from-sky-500 to-indigo-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Features() {
  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Core Platform Modules</h2>
          <p className="section-subtitle">
            Ten powerful modules working together to create a comprehensive road safety ecosystem
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative"
              >
                <div className={cn(
                  'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl',
                  'bg-gradient-to-br', feature.color
                )} />
                <div className="relative glass-card p-6 h-full flex flex-col items-center text-center group-hover:border-transparent transition-all duration-500 hover:scale-[1.03]">
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                    'bg-gradient-to-br', feature.color,
                    'shadow-lg'
                  )}>
                    <Icon size={28} className="text-[var(--text-primary)]" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
