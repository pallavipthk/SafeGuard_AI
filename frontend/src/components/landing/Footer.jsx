import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Github, Twitter, Linkedin, Youtube, Mail,
  ChevronRight, Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickLinks = [
  { label: 'Features', href: '#features' },
  { label: 'About Us', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Blog', href: '#blog' },
  { label: 'Documentation', href: '#docs' },
  { label: 'API Reference', href: '#api' },
];

const supportLinks = [
  { label: 'Help Center', href: '#help' },

  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Cookie Policy', href: '#cookies' },
  { label: 'Sitemap', href: '#sitemap' },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: 'mailto:hello@safeguardai.com', label: 'Email' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="relative bg-theme border-t border-theme">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield size={22} className="text-[var(--text-primary)]" />
              </div>
              <span className="text-xl font-bold gradient-text">SafeGuard AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Making roads safer with artificial intelligence. Real-time hazard detection,
              predictive analytics, and smart city integration for a safer tomorrow.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[var(--text-primary)] hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <SocialIcon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for the latest safety updates and features.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input-field text-sm flex-1"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0"
              >
                <ChevronRight size={16} className="text-[var(--text-primary)]" />
              </motion.button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              &copy; {new Date().getFullYear()} SafeGuard AI. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Made with <Heart size={14} className="text-red-500" /> for safer roads
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
