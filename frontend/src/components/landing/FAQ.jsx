import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'What is SafeGuard AI and how does it work?',
    a: 'SafeGuard AI is an intelligent road safety platform that uses artificial intelligence, computer vision, and real-time data analytics to predict, prevent, and respond to road hazards. It combines machine learning algorithms with IoT sensors and user reports to create a comprehensive safety ecosystem for drivers, pedestrians, and authorities.',
  },
  {
    q: 'Is SafeGuard AI free to use?',
    a: 'Yes! SafeGuard AI offers a free tier with essential features including hazard reporting, road sign recognition, and basic safety alerts. Premium plans with advanced analytics, fleet management, and API access are available for professional users and organizations.',
  },
  {
    q: 'How accurate is the AI hazard detection?',
    a: 'Our AI models achieve over 95% accuracy in hazard detection and road sign recognition. The system continuously learns from new data and user feedback, improving its accuracy over time. We use multiple validation layers to minimize false positives.',
  },
  {
    q: 'Can I use SafeGuard AI offline?',
    a: 'Yes, core features like SOS alerts and basic hazard reporting work offline. The app automatically syncs data when connectivity is restored. Real-time features like live traffic updates and AI analytics require an internet connection.',
  },
  {
    q: 'How does the Emergency SOS feature work?',
    a: 'The SOS feature instantly alerts emergency services with your exact GPS coordinates, vehicle information, and medical details. It can be triggered manually or automatically when crash detection sensors are activated. Response teams receive prioritized alerts with critical context.',
  },
  {
    q: 'Is my data secure and private?',
    a: 'Absolutely. We employ end-to-end encryption for all data transmission, comply with GDPR and local data protection regulations, and never share personal information with third parties. Location data is anonymized for analytics purposes. You can delete your data at any time.',
  },
  {
    q: 'Can businesses integrate SafeGuard AI?',
    a: 'Yes, we offer comprehensive API access and SDK integration for businesses, fleet operators, and smart city infrastructure. Our enterprise plan includes custom integrations, dedicated support, white-label options, and advanced analytics dashboards.',
  },
  {
    q: 'Which cities is SafeGuard AI available in?',
    a: 'SafeGuard AI is currently operational in 50+ cities across 12 countries. We are rapidly expanding to new regions. You can check availability in your area by signing up, and we will notify you as soon as coverage expands to your location.',
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(
    () => faqs.filter(
      (faq) => faq.q.toLowerCase().includes(searchQuery.toLowerCase())
        || faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
            <HelpCircle size={14} />
            <span>FAQ</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about SafeGuard AI
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative mb-10"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenIndex(null); }}
              className="input-field pl-12"
            />
          </motion.div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No questions found. Try a different search.</p>
            ) : (
              filtered.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className={cn(
                      'w-full text-left glass-card p-5 transition-all duration-300',
                      openIndex === i ? 'border-blue-500/30' : 'hover:bg-white/10'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-[var(--text-primary)]">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          'shrink-0 text-gray-400 transition-transform duration-300',
                          openIndex === i && 'rotate-180'
                        )}
                      />
                    </div>
                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 leading-relaxed mt-4 pt-4 border-t border-white/10">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
