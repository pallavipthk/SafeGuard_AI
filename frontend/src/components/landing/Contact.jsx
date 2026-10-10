import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@safeguardai.com', href: 'mailto:hello@safeguardai.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA 94105', href: null },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9AM - 6PM PST', href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative py-24 bg-theme overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond promptly.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="input-field resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex items-center gap-2 w-full justify-center"
              >
                {submitted ? 'Message Sent!' : 'Send Message'}
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {contactInfo.map((item) => {
              const ItemIcon = item.icon;
              const content = (
                <div className="glass-card p-5 flex items-center gap-4 group hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <ItemIcon size={20} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">{item.value}</p>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <a key={item.label} href={item.href}>
                    {content}
                  </a>
                );
              }
              return <div key={item.label}>{content}</div>;
            })}

            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={18} className="text-green-400" />
                <span className="text-sm font-medium text-[var(--text-primary)]">We&apos;re here to help</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our support team typically responds within 2-4 hours during business hours.
                For urgent matters, use the SOS feature in the app.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
