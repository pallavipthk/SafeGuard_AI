import { motion } from 'framer-motion';
import {
  Car, Footprints, Building2, Smartphone, Bell, Shield,
  Navigation, Users, Radio, Settings, Eye, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const benefitGroups = [
  {
    title: 'For Drivers',
    icon: Car,
    color: 'from-blue-500 to-cyan-500',
    benefits: [
      { icon: Navigation, text: 'Real-time hazard alerts and route optimization' },
      { icon: Bell, text: 'Instant emergency response at your fingertips' },
      { icon: Eye, text: 'AI-powered road sign recognition system' },
    ],
  },
  {
    title: 'For Pedestrians',
    icon: Footprints,
    color: 'from-emerald-500 to-teal-500',
    benefits: [
      { icon: Shield, text: 'Crosswalk safety alerts and zone warnings' },
      { icon: Smartphone, text: 'Report hazards instantly with photo AI analysis' },
      { icon: Clock, text: 'Real-time traffic and safety condition updates' },
    ],
  },
  {
    title: 'For Authorities',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    benefits: [
      { icon: Radio, text: 'Centralized command center for incident management' },
      { icon: Users, text: 'Complete fleet and citizen safety monitoring' },
      { icon: BarChart3, text: 'Data-driven policy and infrastructure decisions' },
    ],
  },
  {
    title: 'For Smart Cities',
    icon: Smartphone,
    color: 'from-amber-500 to-orange-500',
    benefits: [
      { icon: Settings, text: 'Seamless IoT and traffic system integration' },
      { icon: BarChart3, text: 'Advanced analytics for city-wide planning' },
      { icon: Radio, text: 'Automated incident response coordination' },
    ],
  },
];

function BarChart3({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Benefits() {
  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Designed For Everyone</h2>
          <p className="section-subtitle">
            Tailored solutions for every participant in the road safety ecosystem
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefitGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <motion.div
                key={group.title}
                variants={groupVariants}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-5',
                  'bg-gradient-to-br', group.color,
                  'shadow-lg group-hover:shadow-xl transition-all duration-300'
                )}>
                  <GroupIcon size={28} className="text-[var(--text-primary)]" />
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{group.title}</h3>

                <div className="space-y-3">
                  {group.benefits.map((benefit) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div
                        key={benefit.text}
                        className="flex items-start gap-3"
                      >
                        <BenefitIcon
                          size={16}
                          className={cn(
                            'mt-1 shrink-0',
                            group.color.includes('blue') ? 'text-blue-400' :
                            group.color.includes('emerald') || group.color.includes('green') ? 'text-emerald-400' :
                            group.color.includes('purple') ? 'text-purple-400' :
                            'text-amber-400'
                          )}
                        />
                        <p className="text-sm text-gray-400 leading-relaxed">{benefit.text}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
