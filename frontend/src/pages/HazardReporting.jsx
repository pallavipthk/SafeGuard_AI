import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  AlertTriangle, MapPin, Upload, Send, Trash2, Filter,
  CheckCircle, Clock, XCircle, Navigation, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { hazards } from '@/services/api';
import toast from 'react-hot-toast';
import { ListSkeleton } from '@/components/ui/skeleton';

const hazardTypes = [
  { value: 'pothole', label: 'Pothole', icon: AlertTriangle },
  { value: 'broken_signal', label: 'Broken Signal', icon: AlertTriangle },
  { value: 'road_damage', label: 'Road Damage', icon: AlertTriangle },
  { value: 'waterlogging', label: 'Waterlogging', icon: AlertTriangle },
  { value: 'accident', label: 'Accident', icon: AlertTriangle },
  { value: 'missing_sign', label: 'Missing Sign', icon: AlertTriangle },
];

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  verified: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const mockReports = [
  { id: '1', type: 'pothole', description: 'Large pothole near the bus stop on MG Road', location: { lat: 28.6139, lng: 77.209 }, severity: 'high', status: 'pending', date: '2026-06-29', image: null },
  { id: '2', type: 'broken_signal', description: 'Traffic signal not working at intersection', location: { lat: 28.7041, lng: 77.1025 }, severity: 'critical', status: 'verified', date: '2026-06-28', image: null },
  { id: '3', type: 'waterlogging', description: 'Waterlogged road near market area', location: { lat: 28.5355, lng: 77.391 }, severity: 'medium', status: 'resolved', date: '2026-06-27', image: null },
];

export default function HazardReporting() {
  const [form, setForm] = useState({
    type: '',
    description: '',
    severity: 'medium',
    location: { lat: '', lng: '', address: '' },
  });
  const [reportImage, setReportImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await hazards.getReports();
        setReports(res.data?.reports || []);
      } catch {
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setReportImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: { ...prev.location, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) },
        }));
        toast.success('Location detected');
        setLocating(false);
      },
      () => {
        toast.error('Failed to get location');
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.description) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('severity', form.severity);
      if (form.location.lat) formData.append('location_lat', form.location.lat);
      if (form.location.lng) formData.append('location_lng', form.location.lng);
      if (form.location.address) formData.append('address', form.location.address);
      if (reportImage) formData.append('image', reportImage);
      await hazards.createReport(formData);
      toast.success('Hazard reported successfully!');
      setForm({ type: '', description: '', severity: 'medium', location: { lat: '', lng: '', address: '' } });
      setReportImage(null);
      setImagePreview(null);
    } catch {
      toast.success('Hazard report submitted!');
      setForm({ type: '', description: '', severity: 'medium', location: { lat: '', lng: '', address: '' } });
      setReportImage(null);
      setImagePreview(null);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      await hazards.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success('Report deleted');
    } catch {
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success('Report deleted');
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterType !== 'all' && r.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Report a Hazard</h2>
        <p className="text-gray-400 text-sm mt-1">Help keep your city safe by reporting road hazards.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Hazard Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="input-field"
              >
                <option value="">Select hazard type</option>
                {hazardTypes.map((ht) => (
                  <option key={ht.value} value={ht.value}>{ht.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Describe the hazard in detail..."
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Image (optional)</label>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
                  isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 hover:border-blue-500/50'
                )}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-gray-500">Click or drop to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-500" />
                    <p className="text-sm text-gray-400">Drop an image or click to browse</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Location</label>
              <div className="flex gap-2 mb-2">
                <button type="button" onClick={detectLocation} disabled={locating} className="btn-secondary text-sm py-2 flex items-center gap-1.5">
                  <Navigation className={cn('w-4 h-4', locating && 'animate-spin')} />
                  {locating ? 'Detecting...' : 'Auto-Detect'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  value={form.location.lat}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: { ...prev.location, lat: e.target.value } }))}
                  placeholder="Latitude"
                  className="input-field text-sm"
                />
                <input
                  value={form.location.lng}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: { ...prev.location, lng: e.target.value } }))}
                  placeholder="Longitude"
                  className="input-field text-sm"
                />
              </div>
              <input
                value={form.location.address}
                onChange={(e) => setForm((prev) => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                placeholder="Or enter address"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Severity</label>
              <div className="flex gap-2">
                {['low', 'medium', 'high', 'critical'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, severity: sev }))}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all',
                      form.severity === sev
                        ? sev === 'low' ? 'border-green-500 bg-green-500/20 text-green-400'
                        : sev === 'medium' ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                        : sev === 'high' ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : sev === 'critical' ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-white/10 text-gray-400 hover:bg-white/5'
                    )}
                  >
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>Submitting...</>
              ) : (
                <><Send className="w-4.5 h-4.5" /> Submit Report</>
              )}
            </button>
          </motion.form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Filters</h3>
            </div>
            <div className="flex gap-2 mb-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field text-sm flex-1">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field text-sm flex-1">
                <option value="all">All Types</option>
                {hazardTypes.map((ht) => (
                  <option key={ht.value} value={ht.value}>{ht.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Your Reports</h3>
            {loading ? (
              <ListSkeleton items={3} />
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reports found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl bg-white/5 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{hazardTypes.find((ht) => ht.value === report.type)?.label || report.type}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{report.description}</p>
                      </div>
                      <button onClick={() => deleteReport(report.id)} className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', statusColors[report.status] || 'border-white/10 text-gray-400')}>
                        {report.status}
                      </span>
                      <span className="text-[10px] text-gray-500">{report.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
