import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/themeStore';

const navLinks = [];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleTheme } = useThemeStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield size={20} className="text-[var(--text-primary)]" />
            </div>
            <span className="text-lg font-bold gradient-text">SafeGuard AI</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-theme-secondary hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[var(--bg-card-hover)] text-muted hover:text-[var(--text-primary)] transition-all"
              aria-label="Toggle theme"
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="/login"
              className="px-5 py-2 text-sm text-theme-secondary hover:text-[var(--text-primary)] transition-colors"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white gradient-bg rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Get Started
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-[var(--border-color)]"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-theme-secondary hover:text-[var(--text-primary)] transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <button
                onClick={() => { toggleTheme(); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm text-theme-secondary hover:text-[var(--text-primary)] transition-colors py-2"
              >
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <a
                href="/login"
                className="block text-sm text-theme-secondary hover:text-[var(--text-primary)] transition-colors py-2"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="block text-center px-5 py-3 text-sm font-semibold text-white gradient-bg rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
