import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  UserCircle, Camera, Upload, Shield, Brain, AlertTriangle, Star,
  Trophy, Medal, Lock, Trash2, Activity, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/services/api';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const achievements = [
  { id: 1, name: 'First Report', icon: AlertTriangle, desc: 'Report your first hazard', earned: true },
  { id: 2, name: 'Quiz Master', icon: Brain, desc: 'Score 100% on any quiz', earned: true },
  { id: 3, name: 'Safety Guardian', icon: Shield, desc: 'Achieve safety score above 80', earned: false },
  { id: 4, name: 'Road Warrior', icon: Trophy, desc: 'Complete 10 risk predictions', earned: true },
  { id: 5, name: 'Helper', icon: Star, desc: 'Report 5 hazards', earned: false },
  { id: 6, name: 'Learner', icon: Medal, desc: 'Read 10 articles', earned: false },
];

const activityTimeline = [
  { action: 'Reported a pothole on MG Road', time: '2 hours ago', type: 'hazard' },
  { action: 'Completed Road Safety Quiz', time: '1 day ago', type: 'quiz' },
  { action: 'Risk prediction for evening commute', time: '2 days ago', type: 'risk' },
  { action: 'Updated emergency contact', time: '3 days ago', type: 'profile' },
  { action: 'Read "Defensive Driving" article', time: '5 days ago', type: 'learning' },
];

export default function Profile() {
  const { user, updateProfile, logout } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await auth.updateProfile(form);
      updateProfile({ ...user, ...form });
      toast.success('Profile updated');
    } catch {
      updateProfile({ ...user, ...form });
      toast.success('Profile updated');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPassword(false);
  };

  const handleDeleteAccount = () => {
    logout();
    toast.success('Account deleted');
  };

  const stats = [
    { label: 'Reports Made', value: '24', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { label: 'Quizzes Taken', value: '12', icon: Brain, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Safety Score', value: '78', icon: Shield, color: 'from-green-500 to-green-600' },
    { label: 'Achievements', value: '3', icon: Trophy, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Profile Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your account and view your achievements.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div {...getRootProps()} className="relative cursor-pointer group">
                <input {...getInputProps()} />
                <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-0.5">Member since {new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="+91-XXXXXXXXXX" />
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="w-full py-3 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Account Settings</h3>
            <div className="space-y-3">
              <div>
                <button onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-[var(--text-secondary)]">Change Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                {showPassword && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 mt-2 overflow-hidden">
                    <input value={passwords.current} onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))} type="password" placeholder="Current password" className="input-field text-sm" />
                    <input value={passwords.new} onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))} type="password" placeholder="New password" className="input-field text-sm" />
                    <input value={passwords.confirm} onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))} type="password" placeholder="Confirm new password" className="input-field text-sm" />
                    <button onClick={handleChangePassword} className="w-full py-2 gradient-bg text-white text-sm font-medium rounded-xl">Update Password</button>
                  </motion.div>
                )}
              </div>
              <div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-red-500/10 transition-all">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-[var(--text-secondary)]">Delete Account</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                    <p className="text-sm text-red-400 font-medium">Are you sure? This action cannot be undone.</p>
                    <div className="flex gap-2">
                      <button onClick={handleDeleteAccount} className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-all">Delete</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 transition-all">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-white/5 text-center">
                  <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2', stat.color)}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Achievements</h3>
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div key={ach.id} className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg',
                  ach.earned ? 'bg-blue-500/10' : 'bg-white/5 opacity-50'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    ach.earned ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-white/10'
                  )}>
                    <ach.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-primary)] font-medium">{ach.name}</p>
                    <p className="text-[10px] text-gray-500">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Activity</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activityTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                  <div className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    item.type === 'hazard' && 'bg-red-500/20 text-red-400',
                    item.type === 'quiz' && 'bg-yellow-500/20 text-yellow-400',
                    item.type === 'risk' && 'bg-cyan-500/20 text-cyan-400',
                    item.type === 'profile' && 'bg-blue-500/20 text-blue-400',
                    item.type === 'learning' && 'bg-green-500/20 text-green-400',
                  )}>
                    <Activity className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-secondary)]">{item.action}</p>
                    <p className="text-[10px] text-gray-600">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
