import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/services/api';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: storeRegister } = useAuthStore();
  const isLoginPage = location.pathname === '/login';

  const [isLogin, setIsLogin] = useState(isLoginPage);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isLogin && !form.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await auth.login({ email: form.email, password: form.password });
        login(res.data.user, res.data.token);
        toast.success('Welcome back!');
      } else {
        const res = await auth.register({ name: form.name, email: form.email, password: form.password });
        storeRegister(res.data.user, res.data.token);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = (err.response?.data?.message || err.response?.data?.error || (isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.'));
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-[var(--text-primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {isLogin ? 'Sign in to your SafeGuard AI account' : 'Join SafeGuard AI for safer roads'}
            </p>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {['Login', 'Register'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setIsLogin(mode === 'Login');
                  setError('');
                  setForm({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                  (isLogin && mode === 'Login') || (!isLogin && mode === 'Register')
                    ? 'gradient-bg text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={toggleMode} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
